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
exports.prepareContext = exports.prepareWorkspaceContext = exports.ensureModel = exports.ensureQuestion = exports.ensureApiKey = exports.ensureWorkspaceOpen = void 0;
const vscode = __importStar(require("vscode"));
const config_1 = require("./config");
const ui_1 = require("./ui");
async function ensureWorkspaceOpen() {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        vscode.window.showErrorMessage("No workspace folder open!");
        throw new Error("No workspace");
    }
    return workspaceFolder;
}
exports.ensureWorkspaceOpen = ensureWorkspaceOpen;
async function ensureApiKey() {
    let apiKey = await (0, config_1.getApiKey)();
    if (!apiKey) {
        apiKey = await (0, ui_1.promptForApiKey)();
        if (apiKey) {
            await (0, config_1.setApiKey)(apiKey);
        }
        else {
            vscode.window.showErrorMessage("API Key is required!");
            throw new Error("No API key");
        }
    }
    return apiKey;
}
exports.ensureApiKey = ensureApiKey;
async function ensureQuestion() {
    const question = await (0, ui_1.promptForQuestion)();
    if (!question) {
        vscode.window.showErrorMessage("A question is required!");
        throw new Error("No question");
    }
    return question;
}
exports.ensureQuestion = ensureQuestion;
async function ensureModel() {
    const model = await (0, config_1.getModel)();
    if (!model) {
        vscode.window.showErrorMessage("xAI model is required!");
        throw new Error("No model");
    }
    return model;
}
exports.ensureModel = ensureModel;
async function prepareWorkspaceContext() {
    const workspaceFolder = await ensureWorkspaceOpen();
    return {
        workspaceFolder,
        ...await prepareContext(),
    };
}
exports.prepareWorkspaceContext = prepareWorkspaceContext;
async function prepareContext() {
    const apiKey = await ensureApiKey();
    const model = await ensureModel();
    const question = await ensureQuestion();
    return { apiKey, model, question };
}
exports.prepareContext = prepareContext;
//# sourceMappingURL=context.js.map