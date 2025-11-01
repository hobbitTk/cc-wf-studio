/**
 * Claude Code Workflow Studio - Extension Entry Point
 *
 * Main activation and deactivation logic for the VSCode extension.
 */

import * as vscode from 'vscode';
import { registerOpenEditorCommand } from './commands/open-editor';
import { registerSaveWorkflowCommand } from './commands/save-workflow';
import { FileService } from './services/file-service';

/**
 * Extension activation function
 * Called when the extension is activated (when the command is first invoked)
 */
export function activate(context: vscode.ExtensionContext): void {
  console.log('Claude Code Workflow Studio is now active');

  // Initialize services
  let fileService: FileService;
  try {
    fileService = new FileService();
  } catch (error) {
    vscode.window.showErrorMessage(
      `Failed to initialize File Service: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
    return;
  }

  // Register commands
  registerOpenEditorCommand(context);
  registerSaveWorkflowCommand(context, fileService);

  console.log('Claude Code Workflow Studio: All commands registered');
}

/**
 * Extension deactivation function
 * Called when the extension is deactivated
 */
export function deactivate(): void {
  console.log('Claude Code Workflow Studio is now deactivated');
  // Cleanup if needed
}
