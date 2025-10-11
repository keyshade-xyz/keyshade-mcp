#!/usr/bin/env node

import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { getMcpServer } from "./mcp-server/index.ts";
import { initTools } from "./tools/index.ts";

/**
 * Main entry point for the Keyshade MCP server.
 * Initializes the server, registers all tools, and connects to the transport.
 */
async function main() {
  // Get the singleton MCP server instance
  const server = getMcpServer();

  // Initialize and register all tools
  initTools();

  // Connect to stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);

  console.error("Keyshade MCP Server running on stdio");
}

// Start the server
main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});