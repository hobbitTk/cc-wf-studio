/**
 * Claude Code Workflow Studio - Save Workflow Command
 *
 * Handles saving workflow definitions to .vscode/workflows/
 * Based on: /specs/001-cc-wf-studio/contracts/extension-webview-api.md
 */

import * as vscode from 'vscode';
import { FileService } from '../services/file-service';
import type { Workflow } from '../../shared/types/workflow-definition';
import type { SaveWorkflowPayload } from '../../shared/types/messages';

/**
 * Register the save workflow command
 *
 * @param context - VSCode extension context
 * @param fileService - File service instance
 */
export function registerSaveWorkflowCommand(
  context: vscode.ExtensionContext,
  fileService: FileService
): void {
  // This command will be called internally by the message handler
  // Not exposed as a user-facing command
  const saveWorkflowCommand = vscode.commands.registerCommand(
    'cc-wf-studio.saveWorkflow',
    async (payload: SaveWorkflowPayload, webview?: vscode.Webview) => {
      try {
        const { workflow } = payload;

        // Ensure workflows directory exists
        await fileService.ensureWorkflowsDirectory();

        // Validate workflow (basic checks)
        validateWorkflow(workflow);

        // Get file path
        const filePath = fileService.getWorkflowFilePath(workflow.name);

        // Serialize workflow to JSON with 2-space indentation
        const content = JSON.stringify(workflow, null, 2);

        // Write to file
        await fileService.writeFile(filePath, content);

        // Send success message back to webview
        if (webview) {
          webview.postMessage({
            type: 'SAVE_SUCCESS',
            payload: {
              filePath,
              timestamp: new Date().toISOString(),
            },
          });
        }

        // Show success notification
        vscode.window.showInformationMessage(
          `Workflow "${workflow.name}" saved successfully!`
        );
      } catch (error) {
        // Send error message back to webview
        if (webview) {
          webview.postMessage({
            type: 'ERROR',
            payload: {
              code: 'SAVE_FAILED',
              message: error instanceof Error ? error.message : 'Failed to save workflow',
              details: error,
            },
          });
        }

        // Show error notification
        vscode.window.showErrorMessage(
          `Failed to save workflow: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    }
  );

  context.subscriptions.push(saveWorkflowCommand);
}

/**
 * Validate workflow before saving
 *
 * @param workflow - Workflow to validate
 * @throws Error if validation fails
 */
function validateWorkflow(workflow: Workflow): void {
  // Check required fields
  if (!workflow.id) {
    throw new Error('Workflow ID is required');
  }

  if (!workflow.name) {
    throw new Error('Workflow name is required');
  }

  // Validate name format (alphanumeric, hyphen, underscore only)
  const namePattern = /^[a-zA-Z0-9_-]+$/;
  if (!namePattern.test(workflow.name)) {
    throw new Error(
      'Workflow name must contain only alphanumeric characters, hyphens, and underscores'
    );
  }

  // Check name length (1-100 characters)
  if (workflow.name.length < 1 || workflow.name.length > 100) {
    throw new Error('Workflow name must be between 1 and 100 characters');
  }

  // Validate version format (semantic versioning)
  const versionPattern = /^\d+\.\d+\.\d+$/;
  if (!workflow.version || !versionPattern.test(workflow.version)) {
    throw new Error('Workflow version must follow semantic versioning (e.g., 1.0.0)');
  }

  // Check max nodes (50)
  if (workflow.nodes.length > 50) {
    throw new Error('Workflow cannot have more than 50 nodes');
  }
}
