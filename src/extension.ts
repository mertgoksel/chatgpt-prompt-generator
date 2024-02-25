import * as vscode from 'vscode';
import { generateProjectPrompt } from './promptGenerator';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.generateProjectPrompt', () => {
        const projectPrompt = generateProjectPrompt(vscode.workspace.rootPath);
        vscode.window.showInformationMessage(projectPrompt);
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
