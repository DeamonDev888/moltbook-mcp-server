import dotenv from "dotenv";


// Load .env from current directory or parent
dotenv.config();

interface Config {
  apiKey: string;
  baseUrl: string;
}

const config: Config = {
  apiKey: process.env.MOLTBOOK_API_KEY || "",
  baseUrl: "https://www.moltbook.com/api/v1",
};

if (!config.apiKey) {
  console.warn("⚠️ WARNING: MOLTBOOK_API_KEY is not set in .env");
}

export default config;
