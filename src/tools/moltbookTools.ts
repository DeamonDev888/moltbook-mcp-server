import { FastMCP } from "fastmcp";
import { z } from "zod";
import { api } from "../api.js";

export function registerMoltbookTools(server: FastMCP) {
  // --- POSTING ---

  server.addTool({
    name: "moltbook_post",
    description: "Create a new post on Moltbook. Can be text or a link.",
    parameters: z.object({
      title: z.string().describe("Title of the post"),
      content: z.string().optional().describe("Text content of the post"),
      url: z.string().optional().describe("URL if it is a link post"),
      submolt: z
        .string()
        .default("general")
        .describe("Submolt (community) to post in. Defaults to general."),
    }),
    execute: async (args) => {
      return JSON.stringify(
        await api.createPost(args.title, args.content, args.url, args.submolt),
        null,
        2,
      );
    },
  });

  server.addTool({
    name: "moltbook_delete_post",
    description: "Delete one of your own posts by ID.",
    parameters: z.object({
      postId: z.string().describe("The ID of the post to delete"),
    }),
    execute: async (args) => {
      return JSON.stringify(await api.deletePost(args.postId), null, 2);
    },
  });

  // --- READING ---

  server.addTool({
    name: "moltbook_read_feed",
    description:
      "Read the Moltbook feed. Prioritizes your personalized feed (follows/subs), falls back to global.",
    parameters: z.object({
      sort: z.enum(["new", "hot", "top"]).default("new"),
      limit: z.number().min(1).max(50).default(10),
      scope: z
        .enum(["personalized", "global"])
        .default("personalized")
        .describe("Whether to fetch your personalized feed or the global feed"),
    }),
    execute: async (args) => {
      if (args.scope === "global") {
        return JSON.stringify(
          await api.getGlobalPosts(args.sort, args.limit),
          null,
          2,
        );
      }
      return JSON.stringify(await api.getFeed(args.sort, args.limit), null, 2);
    },
  });

  server.addTool({
    name: "moltbook_get_post",
    description: "Get details of a specific post, including its comments.",
    parameters: z.object({
      postId: z.string().describe("The ID of the post"),
    }),
    execute: async (args) => {
      return JSON.stringify(await api.getPost(args.postId), null, 2);
    },
  });

  // --- INTERACTION ---

  server.addTool({
    name: "moltbook_comment",
    description: "Add a comment to a post.",
    parameters: z.object({
      postId: z.string().describe("ID of the post to comment on"),
      content: z.string().describe("The content of your comment"),
      parentId: z
        .string()
        .optional()
        .describe("If replying to a comment, the ID of that comment"),
    }),
    execute: async (args) => {
      return JSON.stringify(
        await api.createComment(args.postId, args.content, args.parentId),
        null,
        2,
      );
    },
  });

  server.addTool({
    name: "moltbook_upvote",
    description: "Upvote a post or a comment.",
    parameters: z.object({
      type: z.enum(["post", "comment"]).describe("Type of item to upvote"),
      id: z.string().describe("ID of the post or comment"),
    }),
    execute: async (args) => {
      if (args.type === "post") {
        return JSON.stringify(await api.upvotePost(args.id), null, 2);
      } else {
        return JSON.stringify(await api.upvoteComment(args.id), null, 2);
      }
    },
  });

  // --- SEARCH ---

  server.addTool({
    name: "moltbook_search",
    description:
      "Perform a semantic search on Moltbook. Finds content by meaning.",
    parameters: z.object({
      query: z.string().describe("Natural language search query"),
      type: z.enum(["posts", "comments", "all"]).default("all"),
      limit: z.number().default(10),
    }),
    execute: async (args) => {
      return JSON.stringify(
        await api.search(args.query, args.type, args.limit),
        null,
        2,
      );
    },
  });

  // --- AGENT MGMT ---

  server.addTool({
    name: "moltbook_my_status",
    description: "Check your agent status, DMs, and profile info.",
    parameters: z.object({}),
    execute: async (_args) => {
      const [status, dms, profile] = await Promise.all([
        api.getStatus(),
        api.checkDms(),
        api.getMyProfile(),
      ]);
      return JSON.stringify({ status, dms, profile }, null, 2);
    },
  });

  server.addTool({
    name: "moltbook_profile",
    description: "View another agent's profile.",
    parameters: z.object({
      name: z.string().describe("Name of the agent (e.g., SniperBot)"),
    }),
    execute: async (args) => {
      return JSON.stringify(await api.getProfile(args.name), null, 2);
    },
  });

  server.addTool({
    name: "moltbook_follow",
    description: "Follow another agent.",
    parameters: z.object({
      agentName: z.string().describe("Name of the agent to follow"),
    }),
    execute: async (args) => {
      return JSON.stringify(await api.follow(args.agentName), null, 2);
    },
  });
}
