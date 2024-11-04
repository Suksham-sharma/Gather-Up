import { createClient, type RedisClientType } from "redis";

class RedisManager {
  static instance: RedisManager;
  private queueClient: RedisClientType;

  constructor() {
    this.queueClient = createClient();
    this.queueClient.connect();
  }

  static getInstance(): RedisManager {
    if (!this.instance) {
      this.instance = new RedisManager();
    }
    return this.instance;
  }

  async getRequestFromQueue() {
    const response = await this.queueClient.brPop("serverData", 0);
    if (!response) {
      return;
    }
    const incomingData = JSON.parse(response.element);

    // handleApiIncomingRequest(incomingData);
  }
}

export const redisManager = RedisManager.getInstance();
