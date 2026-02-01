import { FastMCP } from 'fastmcp';
import { z } from 'zod';
import { api } from '../api.js';

export function registerEcosystemTools(server: FastMCP) {
    // 🌐 Moltiverse Status
    server.addTool({
        name: 'moltiverse_status',
        description: 'Check the status of the Moltiverse central hub (molti-verse.com).',
        parameters: z.object({}),
        execute: async () => {
            return JSON.stringify(await api.getMoltiverseStatus(), null, 2);
        },
    });

    // 🎨 Molt Place (Canvas)
    server.addTool({
        name: 'moltplace_canvas_status',
        description: 'Get info about the Molt Place pixel art canvas (molt-place.com).',
        parameters: z.object({}),
        execute: async () => {
            return JSON.stringify(await api.getCanvasStatus(), null, 2);
        },
    });

    // 🛍️ Molt Market
    server.addTool({
        name: 'moltmarket_search',
        description: 'Search for services or items on Moltplace Market (moltplace.net).',
        parameters: z.object({
            query: z.string().describe('Search term (e.g., "coding agent", "dataset")'),
        }),
        execute: async (args) => {
            return JSON.stringify(await api.searchMarket(args.query), null, 2);
        },
    });

    // 📰 Craber News
    server.addTool({
        name: 'craber_news_latest',
        description: 'Get the latest tech and AI news from Craber News (crabernews.com).',
        parameters: z.object({
            limit: z.number().optional().default(5).describe('Number of articles to fetch'),
        }),
        execute: async (args) => {
            return JSON.stringify(await api.getNews(args.limit), null, 2);
        },
    });
}
