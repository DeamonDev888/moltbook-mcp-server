import axios, { AxiosInstance, AxiosError } from "axios";
import config from "./config.js";

class MoltbookAPI {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: config.baseUrl,
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
    });

    // Interceptor to handle errors gracefully
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response) {
          console.error(
            `[Moltbook API Error] ${error.response.status}: ${JSON.stringify(error.response.data)}`,
          );
          throw new Error(
            `Moltbook API Error: ${error.response.status} - ${JSON.stringify(error.response.data)}`,
          );
        } else {
          console.error(`[Moltbook Network Error] ${error.message}`);
          throw new Error(`Moltbook Network Error: ${error.message}`);
        }
      },
    );
  }

  // --- FEED & POSTS ---

  async getFeed(sort: "hot" | "new" | "top" = "new", limit: number = 25) {
    const response = await this.client.get(`/feed?sort=${sort}&limit=${limit}`);
    // If personalized feed is empty (new user), fallback to global
    if (response.data.posts && response.data.posts.length === 0) {
      return this.client
        .get(`/posts?sort=${sort}&limit=${limit}`)
        .then((r) => r.data);
    }
    return response.data;
  }

  async getGlobalPosts(
    sort: "hot" | "new" | "top" = "new",
    limit: number = 25,
  ) {
    return (await this.client.get(`/posts?sort=${sort}&limit=${limit}`)).data;
  }

  async getPost(postId: string) {
    return (await this.client.get(`/posts/${postId}`)).data;
  }

  async createPost(
    title: string,
    content?: string,
    url?: string,
    submolt: string = "general",
  ) {
    const payload: any = { title, submolt };
    if (content) payload.content = content;
    if (url) payload.url = url;
    return (await this.client.post("/posts", payload)).data;
  }

  async deletePost(postId: string) {
    return (await this.client.delete(`/posts/${postId}`)).data;
  }

  // --- INTERACTIONS ---

  async createComment(postId: string, content: string, parentId?: string) {
    const payload: any = { content };
    if (parentId) payload.parent_id = parentId;
    return (await this.client.post(`/posts/${postId}/comments`, payload)).data;
  }

  async upvotePost(postId: string) {
    return (await this.client.post(`/posts/${postId}/upvote`)).data;
  }

  async downvotePost(postId: string) {
    return (await this.client.post(`/posts/${postId}/downvote`)).data;
  }

  async upvoteComment(commentId: string) {
    return (await this.client.post(`/comments/${commentId}/upvote`)).data;
  }

  // --- SEARCH ---

  async search(
    query: string,
    type: "posts" | "comments" | "all" = "all",
    limit: number = 20,
  ) {
    return (
      await this.client.get(`/search`, { params: { q: query, type, limit } })
    ).data;
  }

  // --- AGENT & PROFILE ---

  async getMyProfile() {
    return (await this.client.get("/agents/me")).data;
  }

  async getProfile(name: string) {
    return (await this.client.get("/agents/profile", { params: { name } }))
      .data;
  }

  async getStatus() {
    return (await this.client.get("/agents/status")).data;
  }

  async checkDms() {
    return (await this.client.get("/agents/dm/check")).data;
  }

  async follow(agentName: string) {
    return (await this.client.post(`/agents/${agentName}/follow`)).data;
  }

  async unfollow(agentName: string) {
    return (await this.client.delete(`/agents/${agentName}/follow`)).data;
  }

  async registerAgent(name: string, description: string) {
    return (await this.client.post("/agents/register", { name, description }))
      .data;
  }

  // --- MODERATION ---

  async pinPost(postId: string) {
    return (await this.client.post(`/posts/${postId}/pin`)).data;
  }

  async unpinPost(postId: string) {
    return (await this.client.delete(`/posts/${postId}/pin`)).data;
  }

  async addModerator(submolt: string, agent_name: string) {
    return (
      await this.client.post(`/submolts/${submolt}/moderators`, {
        agent_name,
        role: "moderator",
      })
    ).data;
  }

  async removeModerator(submolt: string, agent_name: string) {
    return (
      await this.client.delete(`/submolts/${submolt}/moderators`, {
        data: { agent_name },
      })
    ).data;
  }
  // ============================================================================
  // 🌍 MOLTIVERSE ECOSYSTEM
  // ============================================================================

  /**
   * Generic helper for external ecosystem requests
   */
  private async ecosystemRequest(baseUrl: string, endpoint: string, method: 'GET' | 'POST' = 'GET', data?: any) {
    try {
      const response = await axios({
        method,
        url: `${baseUrl}${endpoint}`,
        headers: {
          'Authorization': `Bearer ${config.apiKey}`,
          'Content-Type': 'application/json',
        },
        data
      });
      return response.data;
    } catch (error: any) {
      console.error(`Ecosystem API Error (${baseUrl}):`, error.response?.data || error.message);
      return { 
        success: false, 
        error: error.response?.data?.error || error.message,
        hint: "This API might not be live or public yet." 
      };
    }
  }

  // --- Moltiverse Hub ---
  async getMoltiverseStatus() {
    return this.ecosystemRequest(config.moltiverseUrl, '/status');
  }

  // --- Molt Place (Pixel Art) ---
  async getCanvasStatus() {
    return this.ecosystemRequest(config.matchPlaceUrl, '/status');
  }

  // --- Molt Market ---
  async searchMarket(query: string) {
    return this.ecosystemRequest(config.marketPlaceUrl, `/search?q=${encodeURIComponent(query)}`);
  }

  // --- Craber News ---
  async getNews(limit: number = 5) {
    return this.ecosystemRequest(config.craberNewsUrl, `/news?limit=${limit}`);
  }
}

export const api = new MoltbookAPI();
