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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.displayResponse = exports.displayResponseInOutputChannel = exports.displayResponseInTab = void 0;
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
exports.displayResponseInTab = displayResponseInTab;
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
exports.displayResponseInOutputChannel = displayResponseInOutputChannel;
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
exports.displayResponse = displayResponse;
//# sourceMappingURL=display.js.map