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
exports.getMessage = void 0;
const vscode = __importStar(require("vscode"));
const editor_1 = require("./editor");
async function getWorkspaceMessage(question) {
    const uris = await (0, editor_1.getFilesList)();
    if (!uris.length) {
        vscode.window.showErrorMessage("No files found in workspace!");
        throw new Error("No workspace files");
    }
    const content = (await Promise.all(uris.map(async (uri) => ({
        path: uri.path,
        content: await (0, editor_1.readFileAsUtf8)(uri),
    })))).reduce((buffer, file, i) => `${buffer}${i ? "\n\n" : ""}${file.path}\n${file.content}`, "");
    return [
        `Please consider the following project files:`,
        content,
        `Question: ${question}`,
    ].join("\n\n");
}
async function getTabMessage(question) {
    const tab = (0, editor_1.getActiveTab)();
    return [
        `Please consider the following project file:`,
        `${tab.path}\n${tab.content}`,
        `Question: ${question}`,
    ].join("\n\n");
}
async function getFunctionMessage(question) {
    const funcText = await (0, editor_1.getActiveFunctionText)();
    return [
        `Please consider the following function/method:`,
        funcText,
        `Question: ${question}`,
    ].join("\n\n");
}
async function getSelectionMessage(question) {
    const selectedText = await (0, editor_1.getSelectedText)();
    return [
        `Please consider the following code:`,
        selectedText,
        `Question: ${question}`,
    ].join("\n\n");
}
async function getMessage(type, question) {
    switch (type) {
        case "workspace":
            return getWorkspaceMessage(question);
        case "tab":
            return getTabMessage(question);
        case "function":
            return getFunctionMessage(question);
        case "selection":
            return getSelectionMessage(question);
        default:
            return "";
    }
}
exports.getMessage = getMessage;
//# sourceMappingURL=message.js.map