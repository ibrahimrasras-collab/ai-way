import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export interface LLMResponse {
  content: string;
  tokens: number;
}

export async function generateResponse(
  messages: { role: 'user' | 'assistant' | 'system'; content: string }[],
  options: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
    systemPrompt?: string;
  } = {}
): Promise<LLMResponse> {
  const model = genAI.getGenerativeModel({
    model: options.model || 'gemini-1.5-flash',
    systemInstruction: options.systemPrompt || 'You are a helpful assistant.',
  });

  const chat = model.startChat({
    history: messages.slice(0, -1).map((m) => ({
      role: m.role === 'system' ? 'user' : m.role,
      parts: [{ text: m.content }],
    })),
    generationConfig: {
      temperature: options.temperature ?? 0.7,
      maxOutputTokens: options.maxTokens ?? 1024,
    },
  });

  const lastMessage = messages[messages.length - 1];
  const result = await chat.sendMessage(lastMessage.content);
  const response = result.response;

  return {
    content: response.text(),
    tokens: response.usageMetadata?.totalTokenCount || 0,
  };
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
  const result = await model.embedContent(texts.join('\n'));
  return [result.embedding.values];
}

export async function generateSingleEmbedding(text: string): Promise<number[]> {
  const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
  const result = await model.embedContent(text);
  return result.embedding.values;
}
