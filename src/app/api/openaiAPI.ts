
import { SSE } from 'sse';

export async function callGptApi(text: string) {

  const prompt = "Please use the language of the following content and generate a very gental and mild response to soothe the content provider by using stories or words from the Holy Bible "


  const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` // Make sure to set OPENAI_API_KEY environment variable
      },
      body: JSON.stringify({
        "model": "gpt-3.5-turbo-0301",
        "messages": [{"role": "user", "content": prompt}, {"role": "user", "content": text}],
        "max_tokens": 1000,
        "temperature": 0.9,
        "n": 1,
      }),
    });
  console.log(response);
  const { choices } = await response.json();
  const answer = choices && choices[0] ? choices[0].message.content.trim() : 'God loves you, no matter what. Your failures, your brokenness, and your sin can never diminish his love';
  return answer;
}

export function getAPIkey() {
  return process.env.OPENAI_API_KEY;
}