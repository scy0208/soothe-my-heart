'use client';

import { useState, useRef, useEffect} from 'react';
import { SSE } from 'sse';

import {callGptApi, getAPIkey} from './api/openaiAPI';

export default function Home() {
  const [text, setText] = useState('');
  const [displayText, setDisplayText] = useState('');

  const resultRef = useRef<string | undefined>();

  useEffect(() => {
    resultRef.current = displayText;
  }, [displayText]);

  const handleSubmitStatic = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (typeof text === "undefined" || text === "") {
      return;
    }
    const answer = await callGptApi(text);
    setDisplayText(answer);
    setText('');
  };

  const handleSubmitStream = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDisplayText('');

    // Call OpenAI's GPT-3.5 API with a streaming response
    const prompt = "Please use the language of the following content to generate a very gental and mild response to soothe the content provider by using stories or words from the Holy Bible"
    let url = "https://api.openai.com/v1/chat/completions";
    let key = getAPIkey();
    let source = new SSE(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`
      },
      payload: JSON.stringify({
        model: "gpt-3.5-turbo-0301",
        messages: [{"role": "user", "content": prompt}, {"role": "user", "content": text}],
        stream: true,
        max_tokens: 1000,
        temperature: 0.9,
        n: 1
      })
    });
    source.addEventListener("message", (e: MessageEvent) => {
          if (e.data != "[DONE]") {
            let payload = JSON.parse(e.data);
            let text = payload.choices[0].delta.content;
            if (typeof text != "undefined" && text != "\n") {
              resultRef.current = resultRef.current + text;
              if (typeof resultRef.current !== 'undefined') {
                setDisplayText(resultRef.current);
              }
            }
          } else {
            source.close();
          }
        });
    source.stream();
  };


  return (
  <div className="w-full h-screen flex flex-col items-center bg-vision bg-no-repeat bg-center bg-cover grid grid-cols-10">
    <div className="flex bg-black/50 flex-col p-3 py-3 rounded-lg text-white col-start-2 col-span-8  xl:col-start-3 xl:col-span-6">
      <form onSubmit={handleSubmitStream} className="w-full max-w-screen-lg">
        <div className="flex items-center border-b border-b-2 border-teal-500 py-1">
          <input
            type="text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            className="appearance-none bg-transparent border-none w-full py-1 px-2 sm:px-0 leading-tight focus:outline-none resize-none overflow-hidden break-all text-xs md:text-s lg:text-base xl:text-xl"
            placeholder="Write down the burden here. 在此放下你心中的重担吧"
          />
          <button
            type="submit"
            className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-xs md:text-s lg:text-base xl:text-xl border-4 text-white py-1 px-2 rounded"
          >
            Let go
          </button>
        </div>
      </form>
      {displayText && (
        <div className="flex items-center justify-center border-b-2 border-teal-500 w-full max-w-screen-lg text-s lg:text-xl xl:text-2xl italic">
          <p>{displayText}</p>
        </div>
      )}
    </div>
  </div>
);
}