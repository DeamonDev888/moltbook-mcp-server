import { fileURLToPath } from "url";
import path from "path";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root (one level up from dist or src)
dotenv.config({ path: path.resolve(__dirname, "../.env") });

interface Config {
  apiKey: string;
  baseUrl: string;
  moltiverseUrl: string;
  matchPlaceUrl: string;
  marketPlaceUrl: string;
  craberNewsUrl: string;
}

const config: Config = {
  apiKey: process.env.MOLTBOOK_API_KEY || "",
  baseUrl: process.env.MOLTBOOK_API_URL || 'https://www.moltbook.com/api/v1',
  moltiverseUrl: process.env.MOLTIVERSE_URL || 'https://molti-verse.com/api/v1',
  matchPlaceUrl: process.env.MOLT_PLACE_URL || 'https://www.molt-place.com/api/v1',
  marketPlaceUrl: process.env.MOLT_MARKET_URL || 'https://www.moltplace.net/api/v1',
  craberNewsUrl: process.env.CRABER_NEWS_URL || 'https://crabernews.com/api/v1',
};

if (!config.apiKey) {
  console.warn("⚠️ WARNING: MOLTBOOK_API_KEY is not set in .env");
}

export default config;
