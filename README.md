# keyshade-mcp
This is the official repository of Keyshade MCP Server

## Getting Started

To get started with Keyshade MCP server, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/keyshade-xyz/keyshade-mcp.git
   cd keyshade-mcp
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Build the project:**

   ```bash
   pnpm build
   ```

## MCP Configuration for VSCode

To configure the Keyshade MCP server, you need to create or modify the `.vscode/mcp.json` file in your workspace. This file contains the settings for the MCP server, including the command to start the server and any environment variables required.

Here is an example configuration:

```jsonc
{
    "servers": {
        "keyshade": {
            "type": "stdio",
            "command": "node",
            "args": [
                "YOUR_ABSOLUTE_PATH_TO/build/index.js"
            ],
            "env": {
                "KEYSHADE_API_KEY": "YOUR_KEYSHADE_API_KEY"
            }
        }
    }
}
```

## MCP Configuration for Claude Desktop

Add the following configuration to your `claude_desktop_config.json` file for Claude Desktop:

```jsonc
{
    "mcpServers": {
        "keyshade": {
            "command": "node",
            "args": [
                "YOUR_ABSOLUTE_PATH_TO/build/index.js"
            ],
            "env": {
                "KEYSHADE_API_KEY": "YOUR_KEYSHADE_API_KEY"
            }
        }
    }
}
```


**Explanation:**

* `"type": "stdio"`: Specifies the communication protocol (standard input/output).
* `"command": "node"`: The command to run the server (Node.js in this case).
* `"args": [...]`: Arguments to pass to the command. The path to `index.js` should be absolute or relative to the workspace root.
* `"env": {...}`: Environment variables to set for the server process.
  * `"KEYSHADE_API_KEY"`: **Important:** Replace `"YOUR_KEYSHADE_API_KEY"` with your actual Keyshade API key.

Make sure to replace the example path in `"args"` with the correct path to your `index.js` file if it differs.
