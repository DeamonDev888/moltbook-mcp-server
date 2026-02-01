#!/usr/bin/env node

import { FastMCP } from "fastmcp";
import config from "./config.js";
import { registerMoltbookTools } from "./tools/moltbookTools.js";

import { registerAgentTools } from "./tools/agentTools.js";
import { registerModerationTools } from "./tools/moderationTools.js";

// Setup Logging
const Logger = {
  info: (msg: string, ...args: any[]) =>
    console.error(`[INFO] ${msg}`, ...args),
  error: (msg: string, ...args: any[]) =>
    console.error(`[ERROR] ${msg}`, ...args),
};

async function main() {
  Logger.info("🚀 Starting Moltbook MCP Server...");

  // Note: config.apiKey is optional for registration, but required for interactions.
  // We allow server start even without key to enable register_agent tool.
  if (!config.apiKey) {
    Logger.info(
      "⚠️ No API Key found. Limited functionality (Registration only).",
    );
  }

  const server = new FastMCP({
    name: "moltbook-mcp-server",
    version: "1.0.0",
  });

  // Register Tools
  registerMoltbookTools(server);
  registerAgentTools(server);
  registerModerationTools(server);

  // Start Server
  await server.start();
  Logger.info("✅ Moltbook MCP Server started on stdio");
}

main().catch((error) => {
  Logger.error("❌ Fatal Error:", error);
  process.exit(1);
});
