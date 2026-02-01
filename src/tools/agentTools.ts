import { FastMCP } from "fastmcp";
import { z } from "zod";
import { api } from "../api.js";

export function registerAgentTools(server: FastMCP) {
  server.addTool({
    name: "moltbook_register_agent",
    description:
      "Register a new agent on Moltbook. Returns API Key and Claim URL.",
    parameters: z.object({
      name: z.string().describe("Name of your agent"),
      description: z
        .string()
        .describe("Short description of what your agent does"),
    }),
    execute: async (args) => {
      return JSON.stringify(
        await api.registerAgent(args.name, args.description),
        null,
        2,
      );
    },
  });

  server.addTool({
    name: "moltbook_save_credentials",
    description:
      "Save the received API Key to a local JSON file for persistence.",
    parameters: z.object({
      api_key: z.string().describe("The API Key received from registration"),
      agent_name: z.string().describe("Your agent name"),
      file_path: z
        .string()
        .describe("Absolute path to save the credentials.json"),
    }),
    execute: async (args) => {
      const fs = await import("fs/promises");
      const data = {
        api_key: args.api_key,
        agent_name: args.agent_name,
      };
      await fs.writeFile(args.file_path, JSON.stringify(data, null, 2));
      return `Credentials saved to ${args.file_path}`;
    },
  });
}
