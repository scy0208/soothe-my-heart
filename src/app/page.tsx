'use client';

import { useState, useRef, useEffect} from 'react';
import { SSE } from 'sse';

export default function Home() {
  const [text, setText] = useState('');
  const [displayText, setDisplayText] = useState('');

  const resultRef = useRef<string | undefined>();

  useEffect(() => {
    resultRef.current = displayText;
  }, [displayText]);

  const handleSubmitStream = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setDisplayText('');

    if (!text) {
      return;
    }

    const response = await fetch('/api/gpt-api', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: text
      }),
    });

    console.log(response);

    if (!response.ok) {
      throw new Error(response.statusText);
    }

    const data = response.body
    if (!data) {
      return;
    }

    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    let currentResponse: string[] = [];
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      resultRef.current = resultRef.current + chunkValue;
      if (typeof resultRef.current !== 'undefined') {
        setDisplayText(resultRef.current);
      }
    }
  }


  return (
  <div className="bg-vision bg-no-repeat bg-center bg-cover">
    <div className="w-full h-screen flex flex-col items-center grid grid-cols-10">
      <div className="flex bg-black/50 flex-col p-3 py-3 rounded-lg text-white col-start-2 col-span-8  xl:col-start-3 xl:col-span-6">
        <form onSubmit={handleSubmitStream}>
          <div className="flex items-center border-b border-b-2 border-teal-500 py-1">
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              className="appearance-none bg-transparent border-none w-full py-1 px-2 sm:px-0 leading-tight focus:outline-none resize-none overflow-hidden break-normal text-xs md:text-s lg:text-base xl:text-xl"
              placeholder="Write down your burden here."
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
    <div className="flex flex-col items-center absolute bottom-1 right-2">
        <div className="items-right">
          <img src="/qrcode.png" alt="My profile" className="w-24 h-24 rounded-half order-1"/>
        </div>
        <div className="text-white text-xs font-bold">
          <p>calm-me-lord.com</p>
        </div>
    </div>
  </div>
);
}