"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleGrokPreview = handleGrokPreview;
exports.shouldShowGrokPreview = shouldShowGrokPreview;
exports.showGrokPreview = showGrokPreview;
exports.showDataPreview = showDataPreview;
const vscode = __importStar(require("vscode"));
const const_1 = require("./const");
const config_1 = require("./config");
async function handleGrokPreview(type, prompt) {
    if (await shouldShowGrokPreview(type)) {
        return await showGrokPreview(prompt);
    }
    return true;
}
async function shouldShowGrokPreview(type) {
    const previewMode = await (0, config_1.getShowPreview)();
    if (previewMode === const_1.SHOW_PREVIEW_ALWAYS) {
        return true;
    }
    if (previewMode === const_1.SHOW_PREVIEW_WORKSPACE && type === "workspace") {
        return true;
    }
    return false;
}
function showGrokPreview(data) {
    return showDataPreview(const_1.PREVIEW_PANEL_TITLE, data);
}
/**
 * Displays a preview of data in a webview panel with confirmation buttons.
 */
function showDataPreview(title, data) {
    return new Promise((resolve) => {
        const panel = vscode.window.createWebviewPanel(const_1.PREVIEW_PANEL_KEY, title, vscode.ViewColumn.One, { enableScripts: true });
        // HTML content for the webview
        panel.webview.html = getWebviewContent(data);
        // Handle messages from the webview
        panel.webview.onDidReceiveMessage((message) => {
            switch (message.command) {
                case "confirm":
                    resolve(true);
                    panel.dispose();
                    break;
                case "cancel":
                    resolve(false);
                    panel.dispose();
                    break;
            }
        });
        // Cleanup when the panel is closed
        panel.onDidDispose(() => resolve(false));
    });
}
/**
 * Generates HTML content for the webview with formatted data and buttons.
 */
function getWebviewContent(data) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
    </head>
    <body>
      <h3>Data to Send to Grok API:</h3>
      <hr>
      <pre>${escapeHtml(data)}</pre>
      <hr>
      <div>
        <button onclick="sendMessage('confirm')">Send</button>
        <button onclick="sendMessage('cancel')">Cancel</button>
      </div>
      <script>
        const vscode = acquireVsCodeApi();
        function sendMessage(command) {
          vscode.postMessage({ command });
        }
      </script>
    </body>
    </html>
  `;
}
/**
 * Escapes HTML characters to prevent injection.
 */
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
//# sourceMappingURL=preview.js.map