/**
 * Claude Code Workflow Studio - Webview Entry Point
 *
 * React 18 root initialization and VSCode API acquisition
 * Based on: /specs/001-cc-wf-studio/plan.md
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'reactflow/dist/style.css';
import './styles/main.css';

// ============================================================================
// VSCode API
// ============================================================================

/**
 * VSCode API type definition
 * Reference: https://code.visualstudio.com/api/extension-guides/webview
 */
interface VSCodeAPI {
  postMessage(message: unknown): void;
  getState(): unknown;
  setState(state: unknown): void;
}

declare global {
  interface Window {
    acquireVsCodeApi?: () => VSCodeAPI;
  }
}

// Acquire VSCode API (only available in VSCode Webview context)
export const vscode = window.acquireVsCodeApi?.() ?? {
  postMessage: (message: unknown) => {
    console.log('[Dev Mode] postMessage:', message);
  },
  getState: () => {
    console.log('[Dev Mode] getState');
    return null;
  },
  setState: (state: unknown) => {
    console.log('[Dev Mode] setState:', state);
  },
};

// ============================================================================
// React 18 Root Initialization
// ============================================================================

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element not found');
}

const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
