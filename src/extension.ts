import * as vscode from 'vscode';
import fetch from 'node-fetch';

export function activate(context: vscode.ExtensionContext) {
  // Command: Ask Grok about Workspace (with chunking for large contexts)
  context.subscriptions.push(
    vscode.commands.registerCommand('vscodeGrok.askWorkspace', async () => {
      const apiKey = vscode.workspace.getConfiguration('vscodeGrok').get('apiKey', '');
      const model = vscode.workspace.getConfiguration('vscodeGrok').get('model', 'grok-4');
      const showPreview = vscode.workspace.getConfiguration('vscodeGrok').get<string>('showPreview', 'workspace-only');

      const files = await vscode.workspace.findFiles('**/*.{ts,js,py,jsx,tsx}', '**/node_modules/**');
      let workspaceContent = '';

      for (const file of files) {
        const document = await vscode.workspace.openTextDocument(file);
        workspaceContent += `File: ${file.fsPath}\n\`\`\`\n${document.getText()}\n\`\`\`\n`;
      }

      // Chunking for large contexts (split into 200k char chunks to avoid API limits)
      const chunks: string[] = [];
      for (let i = 0; i < workspaceContent.length; i += 200000) {
        chunks.push(workspaceContent.substring(i, i + 200000));
      }

      if (showPreview === 'always' || showPreview === 'workspace-only') {
        const proceed = await vscode.window.showInformationMessage(
          `Sending workspace data (${chunks.length} chunks, total ~${workspaceContent.length} chars). Proceed?`,
          'Yes', 'No'
        );
        if (proceed !== 'Yes') return;
      }

      const question = await vscode.window.showInputBox({ prompt: 'Ask Grok about your workspace' });
      if (!question) return;

      let fullOutput = '';
      for (const chunk of chunks) {
        const prompt = `Workspace chunk:\n${chunk}\n\nQuestion: ${question}`;
        try {
          const response = await callXAIAPI(prompt, model, apiKey);
          fullOutput += response.choices[0].message.content + '\n';
        } catch (error: any) {
          vscode.window.showErrorMessage(`Error in chunk: ${(error as Error).message}`);
          return;
        }
      }
      displayOutput(fullOutput);
    })
  );

  // Command: Ask Grok about Current Tab
  context.subscriptions.push(
    vscode.commands.registerCommand('vscodeGrok.askCurrentTab', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return vscode.window.showWarningMessage('No active editor');

      const apiKey = vscode.workspace.getConfiguration('vscodeGrok').get('apiKey', '');
      const model = vscode.workspace.getConfiguration('vscodeGrok').get('model', 'grok-4');

      const content = editor.document.getText();
      const question = await vscode.window.showInputBox({ prompt: 'Ask Grok about the current tab' });
      if (!question) return;

      const prompt = `File content:\n\`\`\`\n${content}\n\`\`\`\n\nQuestion: ${question}`;
      try {
        const response = await callXAIAPI(prompt, model, apiKey);
        const output = response.choices[0].message.content;
        displayOutput(output);
      } catch (error: any) {
        vscode.window.showErrorMessage(`Error: ${(error as Error).message}`);
      }
    })
  );

  // Command: Ask Grok about Function Under Cursor
  context.subscriptions.push(
    vscode.commands.registerCommand('vscodeGrok.askFunctionUnderCursor', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return vscode.window.showWarningMessage('No active editor');

      const position = editor.selection.active;
      const range = editor.document.getWordRangeAtPosition(position, /function\s+\w+\(/);
      if (!range) return vscode.window.showWarningMessage('No function under cursor');

      const content = editor.document.getText(range);
      const apiKey = vscode.workspace.getConfiguration('vscodeGrok').get('apiKey', '');
      const model = vscode.workspace.getConfiguration('vscodeGrok').get('model', 'grok-4');

      const question = await vscode.window.showInputBox({ prompt: 'Ask Grok about the function under cursor' });
      if (!question) return;

      const prompt = `Function content:\n\`\`\`\n${content}\n\`\`\`\n\nQuestion: ${question}`;
      try {
        const response = await callXAIAPI(prompt, model, apiKey);
        const output = response.choices[0].message.content;
        displayOutput(output);
      } catch (error: any) {
        vscode.window.showErrorMessage(`Error: ${(error as Error).message}`);
      }
    })
  );

  // Command: Ask Grok about Selected Text
  context.subscriptions.push(
    vscode.commands.registerCommand('vscodeGrok.askSelectedText', async () => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) return vscode.window.showWarningMessage('No active editor');

      const content = editor.document.getText(editor.selection);
      if (!content) return vscode.window.showWarningMessage('No text selected');

      const apiKey = vscode.workspace.getConfiguration('vscodeGrok').get('apiKey', '');
      const model = vscode.workspace.getConfiguration('vscodeGrok').get('model', 'grok-4');

      const question = await vscode.window.showInputBox({ prompt: 'Ask Grok about the selected text' });
      if (!question) return;

      const prompt = `Selected content:\n\`\`\`\n${content}\n\`\`\`\n\nQuestion: ${question}`;
      try {
        const response = await callXAIAPI(prompt, model, apiKey);
        const output = response.choices[0].message.content;
        displayOutput(output);
      } catch (error: any) {
        vscode.window.showErrorMessage(`Error: ${(error as Error).message}`);
      }
    })
  );

  // Command: Search Workspace
  context.subscriptions.push(
    vscode.commands.registerCommand('vscodeGrok.searchWorkspace', async () => {
      const apiKey = vscode.workspace.getConfiguration('vscodeGrok').get('apiKey', '');
      const model = vscode.workspace.getConfiguration('vscodeGrok').get('model', 'grok-4');

      const query = await vscode.window.showInputBox({ prompt: 'Search in workspace (e.g., "find function calculate_")' });
      if (!query) return;

      const files = await vscode.workspace.findFiles('**/*.{ts,js,py,jsx,tsx}', '**/node_modules/**');
      let results = '';

      for (const file of files) {
        const document = await vscode.workspace.openTextDocument(file);
        const content = document.getText();
        if (content.includes(query)) {
          results += `Found in ${file.fsPath}:\n\`\`\`\n${content}\n\`\`\`\n`;
        }
      }

      const prompt = `Search query: ${query}\nResults:\n${results}\n\nAnalyze and summarize the results.`;
      try {
        const response = await callXAIAPI(prompt, model, apiKey);
        const output = response.choices[0].message.content;
        displayOutput(output);
      } catch (error: any) {
        vscode.window.showErrorMessage(`Error: ${(error as Error).message}`);
      }
    })
  );

  // Inline Completion Provider (Copilot-like)
  const completionProvider = vscode.languages.registerInlineCompletionItemProvider(
    { scheme: 'file', language: '*' },
    {
      async provideInlineCompletionItems(document, position, context, token) {
        const apiKey = vscode.workspace.getConfiguration('vscodeGrok').get('apiKey', '');
        const model = vscode.workspace.getConfiguration('vscodeGrok').get('model', 'grok-code-fast-1');
        const textBeforeCursor = document.getText(new vscode.Range(new vscode.Position(0, 0), position));

        try {
          const response = await callXAIAPI(`Suggest code completion for: ${textBeforeCursor}`, model, apiKey);
          const suggestion = response.choices[0].message.content;
          return [
            new vscode.InlineCompletionItem(suggestion, new vscode.Range(position, position))
          ];
        } catch (error: any) {
          vscode.window.showErrorMessage(`Error in code completion: ${(error as Error).message}`);
          return [];
        }
      }
    }
  );
  context.subscriptions.push(completionProvider);

  // Command: Open Chat Panel
  context.subscriptions.push(
    vscode.commands.registerCommand('vscodeGrok.openChatPanel', () => {
      const panel = vscode.window.createWebviewPanel(
        'grokChat',
        'Grok Chat',
        vscode.ViewColumn.Beside,
        { enableScripts: true }
      );
      panel.webview.html = getChatWebviewContent();

      panel.webview.onDidReceiveMessage(
        async (message) => {
          if (message.command === 'sendMessage') {
            const apiKey = vscode.workspace.getConfiguration('vscodeGrok').get('apiKey', '');
            const model = vscode.workspace.getConfiguration('vscodeGrok').get('model', 'grok-4');
            try {
              const response = await callXAIAPI(message.text, model, apiKey);
              const reply = response.choices[0].message.content;
              panel.webview.postMessage({ command: 'receiveMessage', text: reply });
            } catch (error: any) {
              panel.webview.postMessage({ command: 'receiveMessage', text: `Error: ${(error as Error).message}` });
            }
          }
        },
        undefined,
        context.subscriptions
      );
    })
  );
}

export function deactivate() {}

async function callXAIAPI(prompt: string, model: string, apiKey: string): Promise<any> {
  const response = await fetch('https://api.x.ai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: model,
      messages: [{ role: 'user', content: prompt }],
      tools: [
        {
          type: 'function',
          function: {
            name: 'code_analysis',
            description: 'Analyze and provide insights on code',
            parameters: {
              type: 'object',
              properties: {
                code: { type: 'string' },
                fileName: { type: 'string' }
              }
            }
          }
        }
      ],
      max_tokens: 4096
    })
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.statusText}`);
  }

  return await response.json();
}

function displayOutput(output: string) {
  if (vscode.workspace.getConfiguration('vscodeGrok').get('outputMethod') === 'tab') {
    vscode.workspace.openTextDocument({ content: output, language: 'markdown' }).then(doc => {
      vscode.window.showTextDocument(doc);
    });
  } else {
    const outputChannel = vscode.window.createOutputChannel('Grok');
    outputChannel.appendLine(output);
    outputChannel.show();
  }
}

function getChatWebviewContent(): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Grok Chat</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        #chat-container { max-width: 600px; margin: 0 auto; }
        #messages { border: 1px solid #ccc; padding: 10px; height: 400px; overflow-y: scroll; }
        #input { width: 100%; padding: 10px; margin-top: 10px; }
      </style>
    </head>
    <body>
      <div id="chat-container">
        <div id="messages"></div>
        <input id="input" type="text" placeholder="Ask Grok about your code..." />
        <script>
          const vscode = acquireVsCodeApi();
          const messages = document.getElementById('messages');
          const input = document.getElementById('input');

          input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && input.value.trim()) {
              vscode.postMessage({ command: 'sendMessage', text: input.value });
              messages.innerHTML += '<p><b>You:</b> ' + input.value + '</p>';
              input.value = '';
            }
          });

          window.addEventListener('message', (event) => {
            const message = event.data;
            if (message.command === 'receiveMessage') {
              messages.innerHTML += '<p><b>Grok:</b> ' + message.text + '</p>';
              messages.scrollTop = messages.scrollHeight;
            }
          });
        </script>
      </div>
    </body>
    </html>
  `;
}