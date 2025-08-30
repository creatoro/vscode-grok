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
exports.displayResponseInTab = displayResponseInTab;
exports.displayResponseInOutputChannel = displayResponseInOutputChannel;
exports.displayResponse = displayResponse;
const vscode = __importStar(require("vscode"));
const const_1 = require("./const");
const config_1 = require("./config");
async function displayResponseInTab(choices) {
    for (const [index, choice] of choices.entries()) {
        const document = await vscode.workspace.openTextDocument({
            content: `# Grok Response ${index + 1}\n\n${choice.message.content}`,
            language: "markdown",
        });
        await vscode.window.showTextDocument(document, { preview: false });
    }
    vscode.window.showInformationMessage("Grok finished. Responses shown in new tabs.");
}
function displayResponseInOutputChannel(choices) {
    const outputChannel = vscode.window.createOutputChannel(const_1.OUTPUT_CHANNEL_NAME);
    outputChannel.clear();
    for (const [index, choice] of choices.entries()) {
        outputChannel.appendLine(`# Grok Response ${index + 1}`);
        outputChannel.appendLine(choice.message.content);
        outputChannel.appendLine("\n---\n");
    }
    outputChannel.show();
    vscode.window.showInformationMessage("Grok finished. Responses shown in the Output panel.");
}
async function displayResponse(choices) {
    const outputMethod = await (0, config_1.getOutputMethod)();
    if (outputMethod === const_1.OUTPUT_METHOD_OUTPUT_CHANNEL) {
        displayResponseInOutputChannel(choices);
    }
    else if (outputMethod === const_1.OUTPUT_METHOD_TAB) {
        await displayResponseInTab(choices);
    }
    else {
        vscode.window.showErrorMessage("Invalid output method set in configuration!");
        throw new Error("Invalid outputMethod");
    }
}
//# sourceMappingURL=display.js.map