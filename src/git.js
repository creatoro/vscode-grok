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
exports.ammendGitCommitMessage = exports.getOutputOfGitDiffStaged = exports.getGitLsFilesOutputAsArray = void 0;
const vscode = __importStar(require("vscode"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const execPromise = (0, util_1.promisify)(child_process_1.exec);
async function getGitLsFilesOutputAsArray() {
    // Get workspace folder
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    // Path to the workspace root
    const cwd = workspaceFolder.uri.fsPath;
    // Run the git command
    const { stdout, stderr } = await execPromise("git ls-files --cached --others --exclude-standard", { cwd });
    if (stderr) {
        vscode.window.showErrorMessage(`Unable to read workspace git repository!`);
        throw new Error("No git repository");
    }
    // Split the output into an array, remove empty lines, and convert to vscode.Uri
    const filesArray = stdout
        .trim()
        .split("\n")
        .filter((line) => line.length > 0)
        .map((relativePath) => vscode.Uri.file(`${cwd}/${relativePath}`));
    return filesArray;
}
exports.getGitLsFilesOutputAsArray = getGitLsFilesOutputAsArray;
async function getOutputOfGitDiffStaged() {
    // Get workspace folder
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    // Path to the workspace root
    const cwd = workspaceFolder.uri.fsPath;
    // Run the git command
    const { stdout, stderr } = await execPromise("git diff --staged", { cwd });
    if (stderr) {
        vscode.window.showErrorMessage(`Unable to read workspace git repository!`);
        throw new Error("No git repository");
    }
    return stdout;
}
exports.getOutputOfGitDiffStaged = getOutputOfGitDiffStaged;
async function ammendGitCommitMessage(newMessage) {
    // Get workspace folder
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    // Path to the workspace root
    const cwd = workspaceFolder.uri.fsPath;
    // Run the git command
    const { stderr } = await execPromise(`git commit --amend -m "${newMessage}"`, { cwd });
    if (stderr) {
        vscode.window.showErrorMessage(`Unable to read workspace git repository!`);
        throw new Error("No git repository");
    }
}
exports.ammendGitCommitMessage = ammendGitCommitMessage;
//# sourceMappingURL=git.js.map