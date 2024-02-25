import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';

let promptList: vscode.Uri[] = [];

export function activate(context: vscode.ExtensionContext) {
    let addToPromptList = vscode.commands.registerCommand('extension.addToPromptList', (fileUri: vscode.Uri) => {
        if (fileUri) {
            promptList.push(fileUri);
            vscode.window.showInformationMessage(`Added ${fileUri.fsPath} to prompt list.`);
        }
    });

    let createPromptFromList = vscode.commands.registerCommand('extension.createPromptFromList', () => {
        if (promptList.length > 0) {
            generatePromptFromFiles(promptList);
        } else {
            vscode.window.showWarningMessage('No files added to prompt list.');
        }
    });

    let removeFromPromptList = vscode.commands.registerCommand('extension.removeFromPromptList', async () => {
        const fileToRemove = await vscode.window.showQuickPick(promptList.map(fileUri => ({
            label: path.basename(fileUri.fsPath),
            description: fileUri.fsPath,
            uri: fileUri
        })), {
            placeHolder: 'Select a file to remove from the prompt list',
        });

        if (fileToRemove) {
            promptList = promptList.filter(fileUri => fileUri.fsPath !== fileToRemove.uri.fsPath);
            vscode.window.showInformationMessage(`Removed ${fileToRemove.description} from prompt list.`);
        }
    });

    let showPromptList = vscode.commands.registerCommand('extension.showPromptList', () => {
        if (promptList.length > 0) {
            const fileList = promptList.map(fileUri => path.basename(fileUri.fsPath)).join('\n');
            vscode.window.showInformationMessage(`Files in prompt list:\n${fileList}`);
        } else {
            vscode.window.showInformationMessage('The prompt list is currently empty.');
        }
    });

    context.subscriptions.push(addToPromptList, createPromptFromList, removeFromPromptList, showPromptList);
}

function generatePromptFromFiles(files: vscode.Uri[]) {
    const projectRoot = vscode.workspace.rootPath || '';
    let prompt = 'Prompt based on project:\n\n';

    files.forEach(fileUri => {
        const filePath = fileUri.fsPath.replace(projectRoot, '');
        const fileContents = fs.readFileSync(fileUri.fsPath, 'utf8');
        prompt += `### ${filePath}\n\`\`\`\n${fileContents}\n\`\`\`\n\n`;
    });

    vscode.workspace.openTextDocument({ content: prompt, language: 'markdown' })
        .then(doc => vscode.window.showTextDocument(doc));
}

export function deactivate() {}
