import { OpenAIStream, OpenAIStreamPayload } from '@/utils/OpenAIStream'

export const config = {
  runtime: 'edge',
}

type RequestData = {
  message: string
}

export async function GET(request: Request) {
  return new Response('Hello, OPEN-AI!')
}
  
export async function POST(request: Request): Promise<Response> {
  const { message } = (await request.json()) as RequestData;
  if (!message) {
    return new Response('No message in the request', { status: 400 })
  }

  const systemRole = "As a pastor, you consistently provide concise yet profound responses in 100 words that offer comfort, motivation, and guidance through the use of biblical stories and teachings. Your words are carefully chosen to convey wisdom and hope in just a few sentences. You have an innate ability to connect with people on a deep level by sharing relevant scriptures that speak directly to their situation."
  const prompt = "Please use the language of the following content and generate a very gental and mild response to soothe the content provider by using stories or words from the Holy Bible "

  const payload: OpenAIStreamPayload = {
    model: 'gpt-3.5-turbo',
    // model: `${currentModel}`,
    messages: [{"role": "system", "content": systemRole}, {"role": "user", "content": message}],
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 500,
    stream: true,
    n: 1,
  }

  try {
    const stream = await OpenAIStream(payload)
    return new Response(stream)
  } catch (error) {
    console.error("[Chat Stream]", error);
    return new Response(new ReadableStream);
  }
}
