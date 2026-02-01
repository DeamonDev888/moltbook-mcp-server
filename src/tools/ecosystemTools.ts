import { FastMCP } from "fastmcp";
import { z } from "zod";
import { api } from "../api.js";

export function registerEcosystemTools(server: FastMCP) {
  // 🌐 Moltiverse Status
  server.addTool({
    name: "moltiverse_status",
    description:
      "Check the status of the Moltiverse central hub (molti-verse.com).",
    parameters: z.object({}),
    execute: async () => {
      return JSON.stringify(await api.getMoltiverseStatus(), null, 2);
    },
  });

  // 🎨 Molt Place (Canvas)
  server.addTool({
    name: "moltplace_canvas_status",
    description:
      "Get info about the Molt Place pixel art canvas (molt-place.com).",
    parameters: z.object({}),
    execute: async () => {
      return JSON.stringify(await api.getCanvasStatus(), null, 2);
    },
  });

  // 🛍️ Molt Market
  server.addTool({
    name: "moltmarket_search",
    description:
      "Search for services or items on Moltplace Market (moltplace.net).",
    parameters: z.object({
      query: z
        .string()
        .describe('Search term (e.g., "coding agent", "dataset")'),
    }),
    execute: async (args) => {
      return JSON.stringify(await api.searchMarket(args.query), null, 2);
    },
  });

  // 📰 Craber News - Registration
  server.addTool({
    name: "craber_register",
    description: "Register a new agent account on Craber News.",
    parameters: z.object({
      name: z.string().describe("Agent Name"),
      bio: z.string().optional().describe("Short bio"),
    }),
    execute: async (args) => {
      return JSON.stringify(
        await api.registerCraberAgent(args.name, args.bio),
        null,
        2,
      );
    },
  });

  // 📰 Craber News - Submit Link
  server.addTool({
    name: "craber_submit",
    description: "Submit a new link post to Craber News.",
    parameters: z.object({
      title: z.string().describe("Title of the post"),
      url: z.string().url().describe("URL of the content"),
    }),
    execute: async (args) => {
      return JSON.stringify(await api.submitCraberLink(args.title, args.url), null, 2);
    },
  });

  // 📰 Craber News - Feed
  server.addTool({
    name: "craber_feed",
    description: "Read the latest posts from Craber News (AI Hacker News).",
    parameters: z.object({
      sort: z.enum(["hot", "new", "top"]).optional().default("new"),
      limit: z.number().optional().default(10),
    }),
    execute: async (args) => {
      return JSON.stringify(
        await api.getCraberFeed(args.sort, args.limit),
        null,
        2,
      );
    },
  });

  // 📰 Craber News - Vote
  server.addTool({
    name: "craber_vote",
    description: "Upvote a post or comment on Craber News.",
    parameters: z.object({
      id: z.string().describe("ID of the post or comment"),
      type: z.enum(["post", "comment"]).default("post"),
    }),
    execute: async (args) => {
      return JSON.stringify(
        await api.voteCraberItem(args.id, args.type),
        null,
        2,
      );
    },
  });

  // 📰 Craber News - Comment
  server.addTool({
    name: "craber_comment",
    description: "Comment on a post or reply to a comment on Craber News.",
    parameters: z.object({
      postId: z.string().describe("ID of the post"),
      content: z.string().describe("Your comment"),
      parentId: z
        .string()
        .optional()
        .describe("ID of parent comment (if reply)"),
    }),
    execute: async (args) => {
      return JSON.stringify(
        await api.commentCraber(args.content, args.postId, args.parentId),
        null,
        2,
      );
    },
  });

  // 📰 Craber News - Notifications
  server.addTool({
    name: "craber_notifications",
    description: "Check your Craber News notifications (replies).",
    parameters: z.object({}),
    execute: async () => {
      return JSON.stringify(await api.getCraberNotifications(), null, 2);
    },
  });
}
