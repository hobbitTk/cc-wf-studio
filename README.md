# Claude Code Workflow Studio

Visual workflow editor for Claude Code - Create, edit, and export workflows using Sub-Agents and AskUserQuestion nodes.

## Overview

Claude Code Workflow Studio is a VSCode extension that provides a visual, drag-and-drop interface for creating Claude Code workflows. Design complex automation workflows by connecting Sub-Agent nodes and decision points (AskUserQuestion), then export them to `.claude` format for immediate use with Claude Code.

## Features

- **Visual Workflow Editor**: Drag-and-drop interface inspired by AWS Step Functions
- **Sub-Agent Nodes**: Configure Claude Code Sub-Agents with custom prompts, tools, and model selection
- **AskUserQuestion Nodes**: Create conditional branches with 2-4 user-selectable options
- **Real-time Validation**: Instant feedback on workflow structure and node configuration
- **Save & Load**: Persist workflows as JSON in `.vscode/workflows/`
- **Export to .claude Format**: Generate `.claude/agents/*.md` and `.claude/commands/*.md` files ready for Claude Code
- **File Conflict Handling**: Automatic detection and confirmation dialog for overwriting existing files
- **Node Property Editing**: Intuitive right-panel editor for configuring node properties

## Installation

### From VSCode Marketplace (Coming Soon)

1. Open VSCode
2. Go to Extensions (`Ctrl+Shift+X` / `Cmd+Shift+X`)
3. Search for "Claude Code Workflow Studio"
4. Click Install

### From Source

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd cc-wf-studio
   ```

2. Install dependencies:
   ```bash
   npm install
   cd src/webview && npm install && cd ../..
   ```

3. Build the extension:
   ```bash
   npm run build
   ```

4. Press F5 in VSCode to launch the Extension Development Host

## Usage

### Opening the Editor

1. Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`)
2. Type "Claude Code Workflow Studio: Open Editor"
3. Press Enter

The visual workflow editor will open in a new panel.

### Creating a Workflow

#### Step 1: Add Nodes

**Sub-Agent Node:**
1. From the left panel (Node Palette), drag "Sub-Agent" onto the canvas
2. Click the node to select it
3. In the right panel (Property Panel), configure:
   - **Node Name**: Unique identifier for the agent (e.g., "data-analysis")
   - **Description**: Purpose of the Sub-Agent
   - **Prompt**: System prompt for the Sub-Agent
   - **Model**: Choose between Sonnet, Opus, or Haiku
   - **Tools**: Comma-separated list of allowed tools (leave empty for all tools)

**AskUserQuestion Node:**
1. Drag "AskUserQuestion" from the Node Palette
2. Click to select
3. Configure in Property Panel:
   - **Node Name**: Identifier for this decision point
   - **Question**: The question to ask the user
   - **Options (2-4)**: Each option has:
     - Label: Short option name
     - Description: Detailed explanation

#### Step 2: Connect Nodes

1. Click and drag from a node's output port (right side)
2. Drop on another node's input port (left side)
3. For AskUserQuestion nodes, each option has its own output port

#### Step 3: Save Workflow

1. Enter a workflow name in the top toolbar input field
2. Click "Save" button
3. The workflow is saved to `.vscode/workflows/<workflow-name>.json`

#### Step 4: Export to .claude Format

1. Click "Export" button in the toolbar
2. If files already exist, you'll be prompted to confirm overwrite
3. Generated files:
   - `.claude/agents/<node-name>.md` - One file per Sub-Agent node
   - `.claude/commands/<workflow-name>.md` - SlashCommand to execute the workflow

### Loading an Existing Workflow

1. Click the refresh button (↻) to update the workflow list
2. Select a workflow from the dropdown
3. Click "Load" button
4. The workflow will be displayed on the canvas

## Exported File Format

### Sub-Agent Configuration (`.claude/agents/*.md`)

```markdown
---
name: data-analysis
description: Analyze data and generate insights
tools: Read,Write,Bash
model: sonnet
---

Your system prompt content here...
```

### SlashCommand (`.claude/commands/*.md`)

```markdown
---
description: Sample workflow
allowed-tools: Task,AskUserQuestion
---

Taskツールを使用して「data-analysis」Sub-Agentを実行してください。

AskUserQuestionツールを使用して以下の質問をユーザーに行ってください:
- 質問: "次のステップを選択してください"
- 選択肢:
  - "レポート作成" → Taskツールで「report-generation」Sub-Agentを実行
  - "データ可視化" → Taskツールで「data-visualization」Sub-Agentを実行

ユーザーの選択に応じて、対応するSub-Agentを実行してください。
```

## Technical Stack

### Extension Host (Backend)
- TypeScript 5.x
- VSCode Extension API
- Node.js file system operations

### Webview (Frontend)
- React 18.x
- React Flow - Visual node editor
- Zustand - State management
- Vite - Build tool

## Development

### Project Structure

```
cc-wf-studio/
├── src/
│   ├── extension/          # Extension Host code
│   │   ├── commands/       # Command handlers
│   │   └── services/       # Business logic
│   ├── webview/            # React UI
│   │   └── src/
│   │       ├── components/ # React components
│   │       ├── services/   # Client-side services
│   │       └── stores/     # Zustand stores
│   └── shared/             # Shared types
├── specs/                  # Design documents
└── tests/                  # Test files
```

### Build Commands

```bash
# Build everything
npm run build

# Build webview only
npm run build:webview

# Build extension only
npm run build:extension

# Watch mode for webview (dev server)
npm run watch:webview

# Watch mode for extension
npm run watch
```

### Running Tests

```bash
npm test
npm run lint
```

## Validation Rules

### Workflow
- Name: 1-100 characters, alphanumeric + hyphens/underscores only
- Version: Semantic versioning (e.g., "1.0.0")
- Nodes: Maximum 50 nodes per workflow

### Sub-Agent Node
- Node Name: 1-50 characters, alphanumeric + hyphens/underscores
- Description: Required, 1-200 characters
- Prompt: Required, 1-10000 characters
- Model: sonnet, opus, or haiku
- Tools: Optional, comma-separated string

### AskUserQuestion Node
- Node Name: 1-50 characters, alphanumeric + hyphens/underscores
- Question Text: Required, 1-500 characters
- Options: 2-4 options required
  - Each option label: 1-50 characters
  - Each option description: 1-200 characters

## Troubleshooting

### Workflow not saving
- Check that the workflow name contains only alphanumeric characters, hyphens, and underscores
- Ensure all required fields are filled in
- Check the VSCode notification area for error messages

### Export fails
- Verify that all nodes have valid configurations
- Check that node names are unique
- Ensure you have write permissions to the `.claude` directory

### Load button doesn't work
- Click the refresh button (↻) to reload the workflow list
- Verify that the workflow file exists in `.vscode/workflows/`
- Check that the JSON file is not corrupted

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

[Specify License Here]

## Acknowledgments

- Built with [React Flow](https://reactflow.dev/)
- Powered by [Claude Code](https://claude.com/claude-code)
- Inspired by AWS Step Functions visual workflow editor

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check the [documentation](./docs/)

---

**Made with Claude Code Workflow Studio** 🤖
