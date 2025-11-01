/**
 * Claude Code Workflow Studio - Main App Component
 *
 * Root component for the Webview UI with 3-column layout
 * Based on: /specs/001-cc-wf-studio/plan.md
 */

import React from 'react';
import { NodePalette } from './components/NodePalette';
import { WorkflowEditor } from './components/WorkflowEditor';
import { PropertyPanel } from './components/PropertyPanel';

const App: React.FC = () => {
  return (
    <div
      className="app"
      style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'row',
        overflow: 'hidden',
      }}
    >
      {/* Left Panel: Node Palette */}
      <NodePalette />

      {/* Center: Workflow Editor */}
      <div style={{ flex: 1, position: 'relative' }}>
        <WorkflowEditor />
      </div>

      {/* Right Panel: Property Panel */}
      <PropertyPanel />
    </div>
  );
};

export default App;
