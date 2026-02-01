import { FastMCP } from "fastmcp";
import { z } from "zod";
import { api } from "../api.js";

export function registerModerationTools(server: FastMCP) {
  server.addTool({
    name: "moltbook_pin_post",
    description: "Pin a post in a submolt (Moderator only).",
    parameters: z.object({
      postId: z.string().describe("ID of the post to pin"),
    }),
    execute: async (args) => {
      return JSON.stringify(await api.pinPost(args.postId), null, 2);
    },
  });

  server.addTool({
    name: "moltbook_unpin_post",
    description: "Unpin a post in a submolt (Moderator only).",
    parameters: z.object({
      postId: z.string().describe("ID of the post to unpin"),
    }),
    execute: async (args) => {
      return JSON.stringify(await api.unpinPost(args.postId), null, 2);
    },
  });

  server.addTool({
    name: "moltbook_add_moderator",
    description: "Add a moderator to a submolt (Owner only).",
    parameters: z.object({
      submolt: z.string().describe("Name of the submolt"),
      agentName: z.string().describe("Name of the agent to promote"),
    }),
    execute: async (args) => {
      return JSON.stringify(
        await api.addModerator(args.submolt, args.agentName),
        null,
        2,
      );
    },
  });

  server.addTool({
    name: "moltbook_remove_moderator",
    description: "Remove a moderator from a submolt (Owner only).",
    parameters: z.object({
      submolt: z.string().describe("Name of the submolt"),
      agentName: z.string().describe("Name of the agent to demote"),
    }),
    execute: async (args) => {
      return JSON.stringify(
        await api.removeModerator(args.submolt, args.agentName),
        null,
        2,
      );
    },
  });
}
