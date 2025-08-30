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
exports.isValidExtension = isValidExtension;
exports.readFileAsUtf8 = readFileAsUtf8;
exports.getFilesList = getFilesList;
exports.getActiveTab = getActiveTab;
exports.getActiveFunctionText = getActiveFunctionText;
exports.findContainingFunction = findContainingFunction;
exports.getSelectedText = getSelectedText;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const valid_extensions_1 = require("./valid-extensions");
const exclude_list_1 = require("./exclude-list");
const git_1 = require("./git");
function isValidExtension(uri) {
    const filename = path.basename(uri.path);
    if (!filename) {
        return false; // Empty filename is invalid
    }
    // Special cases: no extension or dot files
    if (!filename.includes(".")) {
        return true; // e.g., "README"
    }
    if (filename.startsWith(".")) {
        return true; // e.g., ".gitignore"
    }
    // Extract extension
    const extension = path.extname(filename).toLowerCase();
    if (!extension) {
        return false;
    }
    return valid_extensions_1.VALID_EXTENSIONS.has(extension);
}
function notOnExcludeList(uri) {
    const filename = path.basename(uri.path);
    if (!filename) {
        return false;
    }
    return !exclude_list_1.EXCLUDE_LIST.has(filename);
}
async function readFileAsUtf8(uri) {
    const fileContent = await vscode.workspace.fs.readFile(uri);
    // Convert Uint8Array to string with UTF-8 encoding
    return new TextDecoder("utf-8").decode(fileContent);
}
async function getFilesList() {
    const gitFiles = await (0, git_1.getGitLsFilesOutputAsArray)();
    return gitFiles.filter(isValidExtension).filter(notOnExcludeList);
}
function getActiveTab() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage("No active tab found!");
        throw new Error("No editor");
    }
    const path = editor.document.uri.path;
    const content = editor.document.getText();
    if (!content) {
        vscode.window.showErrorMessage("Active tab appears to be empty!");
        throw new Error("Empty tab");
    }
    return { path, content };
}
async function getActiveFunctionText() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage("No active tab found!");
        throw new Error("No editor");
    }
    const document = editor.document;
    const position = editor.selection.active;
    const symbols = await vscode.commands.executeCommand("vscode.executeDocumentSymbolProvider", document.uri);
    if (!symbols || symbols.length === 0) {
        vscode.window.showErrorMessage("No symbols found!");
        throw new Error("No symbols");
    }
    const activeFunction = findContainingFunction(symbols, position);
    if (!activeFunction) {
        vscode.window.showErrorMessage("Unable to determine function!");
        throw new Error("No function");
    }
    return document.getText(activeFunction.range);
}
function findContainingFunction(symbols, position) {
    for (const symbol of symbols) {
        if (symbol.kind === vscode.SymbolKind.Function ||
            symbol.kind === vscode.SymbolKind.Method) {
            if (symbol.range.contains(position)) {
                return symbol;
            }
        }
        if (symbol.children?.length) {
            const childResult = findContainingFunction(symbol.children, position);
            if (childResult) {
                return childResult;
            }
        }
    }
}
async function getSelectedText() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        vscode.window.showErrorMessage("No active tab found!");
        throw new Error("No editor");
    }
    const selection = editor.selection;
    if (!selection) {
        vscode.window.showErrorMessage("No selection available!");
        throw new Error("No selection");
    }
    const selectedText = editor.document.getText(selection);
    if (!selectedText) {
        vscode.window.showErrorMessage("No selected text found!");
        throw new Error("No selected text");
    }
    return selectedText;
}
//# sourceMappingURL=editor.js.map