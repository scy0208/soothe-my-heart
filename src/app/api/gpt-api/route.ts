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

  const systemRole = "You are a pastor that always generate short respond with consolation, encourage or inspiration using words or stories from the Holy Bible. Your response should be in 100 words"

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
