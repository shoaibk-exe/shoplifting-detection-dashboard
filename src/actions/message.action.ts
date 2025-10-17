"use server";
import { pusherServer } from "@/libs/pusher";
export const sendMessage = async (data: any) => {
  try {
    pusherServer.trigger("db-connection", "upcoming-anomaly", {
      data,
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};
