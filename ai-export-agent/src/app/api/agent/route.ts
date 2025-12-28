import { NextResponse } from "next/server";
import { generateAgentReply, type AgentMessage, type AgentProfile } from "@/lib/agent";

export async function POST(request: Request) {
  try {
    const payload = await request.json();

    const messages = Array.isArray(payload?.messages)
      ? (payload.messages as AgentMessage[])
      : [];

    const profile =
      typeof payload?.profile === "object" && payload?.profile !== null
        ? (payload.profile as AgentProfile)
        : ({
            product: "Export product",
            targetMarkets: ["Global"],
            pricePoint: "To be discussed",
            incoterm: "FOB",
            uniqueSellingPoint:
              "reliable supply chain, consistent quality, and competitive pricing",
          } satisfies AgentProfile);

    const text = generateAgentReply(messages, profile);

    return NextResponse.json({
      success: true,
      message: text,
    });
  } catch (error) {
    console.error("Agent API error:", error);
    return NextResponse.json(
      {
        success: false,
        message:
          "Unable to generate a response right now. Please retry in a moment.",
      },
      { status: 500 },
    );
  }
}
