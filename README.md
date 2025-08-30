# Simply Grok for VSCode

Version GitHub VSCode Extension Open VSX Registry

A Visual Studio Code extension that integrates with the xAI API to allow developers to ask Grok questions about their codebase directly within the editor. Get insights on your entire workspace, specific files, functions, or selected code snippets with ease. Now with Copilot-like inline completion, interactive chat panel, workspace search, and support for latest models like grok-4 and grok-code-fast-1.

## Demo

Demo GIF

## Features

* Ask Grok: Workspace - Query Grok about your entire project to get a comprehensive overview or solve cross-file issues (with chunking for large projects).
* Ask Grok: Current Tab - Focus on the active file and ask questions specific to its content.
* Ask Grok: Function Under Cursor - Get explanations or suggestions for the function or method at your cursor position.
* Ask Grok: Selected Text - Highlight code and ask Grok for insights or assistance on just that selection.
* Ask Grok: Search Workspace - Search and analyze your codebase for specific terms or functions.
* Ask Grok: Open Chat Panel - Open an interactive chat window for ongoing conversations with Grok.
* Inline Code Completion - Copilot-like suggestions using grok-code-fast-1 for real-time code generation.
* Customizable Output - Choose to display Grok's responses in a new editor tab or the Output panel.
* Data Preview - Review the data being sent to the Grok API before submission, with configurable settings for when previews appear.
* Model Selection - Select from a variety of Grok models (e.g., `grok-4`, `grok-code-fast-1`) to suit your needs, with tool use support for advanced analysis.

## Installation

0. Open Visual Studio Code.
1. Navigate to the Extensions view (`Ctrl+Shift+X` or `Cmd+Shift+X` on macOS).
2. Search for Simply Grok for VSCode.
3. Click Install to add the extension.

## Usage

0. Open a project or file in VSCode.
1. Access the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS).
2. Search for and select one of the "Ask Grok" commands:
   * `Ask Grok: Workspace`
   * `Ask Grok: Current Tab`
   * `Ask Grok: Function Under Cursor`
   * `Ask Grok: Selected Text`
   * `Ask Grok: Search Workspace`
   * `Ask Grok: Open Chat Panel`
3. Enter your xAI API key if prompted (stored securely in settings).
4. Type your question for Grok and submit.
5. View the response in a new tab or the Output panel, based on your settings.
6. For inline completion, start typing code – suggestions appear automatically using grok-code-fast-1.

### Configuration

Customize the extension via the VSCode Settings UI or `settings.json`:

- xAI API Key: Store your API key securely (`vscodeGrok.apiKey`).
- Model: Choose the Grok model to use (`vscodeGrok.model`), with options like `grok-4` (default), `grok-code-fast-1`, and more.
- Output Method: Decide where responses appear (`vscodeGrok.outputMethod`): `tab` (default) or `outputChannel`.
- Show Preview: Control when to preview data sent to Grok (`vscodeGrok.showPreview`): `always`, `workspace-only` (default), or `never`.

### Supported Models

* `grok-4`: Latest high-performance model with tool use.
* `grok-code-fast-1`: Optimized for fast code generation and completion.
* `grok-4-heavy`: Advanced variant for complex tasks.
* `grok-3-fast`: High-speed model.
* `grok-3-mini-fast`: Compact and fast for lightweight tasks.
* `grok-3-mini`: Efficient smaller model.
* `grok-3`: Powerful model for complex queries.
* `grok-2-vision`: Supports text and vision inputs.
* `grok-2`: Versatile general-purpose model.
* `grok-vision-beta`: Experimental vision and text model.
* `grok-beta`: Early-access model for testing.

For more information, see the xAI Models Documentation.

## Requirements

* An active xAI API key (obtainable from xAI).
* VSCode version 1.70.0 or higher.

## Disclaimer

This extension uses the xAI API, which may incur costs based on your usage and subscription plan with xAI. You are responsible for any associated fees. Please review xAI's pricing before using this extension. Simply Grok for VSCode is an independent project and is not affiliated with or endorsed by xAI.

## Contributing

We welcome contributions to improve Simply Grok for VSCode! Here's how you can help:

* Report Issues: Submit bugs or feature requests on the GitHub Issues page.
* Submit Pull Requests: Fork the repository, make changes, and submit a PR at GitHub Pull Requests.
* Share Feedback: Let us know how we can make this extension better.

## License

This extension is licensed under the MIT License. See the license file for more details.

## Links

Enhance your coding experience with Grok's AI assistance right in VSCode!