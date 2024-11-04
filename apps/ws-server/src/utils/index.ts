import { redisManager } from "../lib/RedisManager";

export async function processRequests() {
  while (true) {
    try {
      await redisManager.getRequestFromQueue();
    } catch (error: any) {
      console.error("Error while processing request:", error.message);
    }
  }
}
