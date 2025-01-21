import { ConvexHttpClient } from "convex/browser";

// Create a singleton instance of the Convex HTTP client
export const getConvexClient = () => {
  if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
    throw new Error('NEXT_PUBLIC_CONVEX_URL environment variable is not set');
  }
  
  const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;
  return new ConvexHttpClient(convexUrl);
};