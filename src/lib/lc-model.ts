import { ChatOpenAI } from "@langchain/openai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatGroq } from "@langchain/groq";

export function createChatModel() {
  const forced = (process.env.PROVIDER || "").toLowerCase();

  const base = { temperature: 0 };

  if (forced === "openai" && process.env.OPENAI_API_KEY) {
    return {
      provider: "openai",
      model: new ChatOpenAI({ ...base, model: "gpt-4o-mini" }),
    };
  }

  if (forced === "gemini" && process.env.GOOGLE_API_KEY) {
    return {
      provider: "gemini",
      model: new ChatGoogleGenerativeAI({ ...base, model: "gemini-2.0-flash-lite" }),
    };
  }

  if (forced === "groq" && process.env.GROQ_API_KEY) {
    return {
      provider: "groq",
      model: new ChatGroq({ ...base, model: "llama-3.1-8b-instant" }),
    };
  }

  // fallback
  return {
    provider: "openai",
    model: new ChatOpenAI({ ...base, model: "gpt-4o-mini" }),
  };
}
