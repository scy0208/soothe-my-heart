'use client';

import { useState } from 'react';

import callGptApi from './api/openaiAPI';
// import callGptApiStream from './api/openaiAPI';

export default function Home() {
  const [text, setText] = useState('');
  const [inputText, setInputText] = useState('');
  const [displayText, setDisplayText] = useState('');

  const handleSubmitClient = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (typeof text === "undefined" || text === "") {
      return;
    }
    setInputText(text);
    const answer = await callGptApi(text);
    setDisplayText(answer);
    setText('');
  };

  const handleSubmitTest = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (typeof text === "undefined" || text === "") {
      return;
    }
    setInputText(text);
    const answer = "Dear friend, I am sorry to hear that you lost your job. I know it can be a difficult and uncertain time, but please remember that you are not alone. In the Bible, we see many stories of people facing difficult times and overcoming them with faith and perseverance. One of my favorite stories is that of Joseph in the book of Genesis. Joseph was sold into slavery by his own brothers and faced many trials and hardships, including being falsely accused and thrown into prison. But through it all, he remained faithful to God and trusted in His plan. Eventually, Joseph was able to interpret Pharaoh's dreams and was appointed as second in command of all of Egypt. Through his faith and perseverance, Joseph was able to overcome his difficult circumstances and thrive. I encourage you to take heart in this story and in the many other examples of perseverance and faith in the Bible. Remember that God is with you always, and He has a plan for your life. Trust in Him, and He will guide you through this difficult time.";
    setDisplayText(answer);
    setText('');
  };


  // const handleSubmitStream = async (event) => {
  //   event.preventDefault();

  //   // Call OpenAI's GPT-3.5 API with a streaming response
  //   const response = callGptApiStream(text);

  //   // Create a stream reader to read the response as a stream
  //   const reader = response.body.getReader();
  //   let chunks = '';

  //   // Read the response as a stream and concatenate the chunks
  //   while (true) {
  //     const { done, value } = await reader.read();
  //     if (done) break;
  //     chunks += new TextDecoder().decode(value);
  //     setDisplayText(chunks); // Update the displayText state with the concatenated chunks
  //   }
  // };


  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-gradient-to-r rounded-lg
                from-yellow-400 via-green-500 to-blue-500')">
      
      <div className="flex items-center bg-black/50 flex-col p-8 py-3 rounded-lg text-white" >          
        <form onSubmit={handleSubmitClient} className="w-full max-w-screen-2xl">
          <div className="flex items-center border-b border-b-2 border-teal-500 py-2">
            <input type="text" value={text} onChange={(event) => setText(event.target.value)} className="appearance-none bg-transparent border-none w-full py-1 px-2 leading-tight focus:outline-none resize-none overflow-hidden break-all"
  placeholder="Enter text here"
  size={Math.max(90, text.length + 1)} />
            <button type="submit" className="flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded">Submit</button>
          </div>
        </form>
        {inputText &&
        <div className="flex items-center justify-center border-b-2 border-teal-500 w-full max-w-screen-xl">
           <p>{inputText} </p>
        </div>}
        {displayText && 
        <div className="flex items-center justify-center border-b-2 border-teal-500 w-full max-w-screen-xl text-2xl italic">
          <p>{displayText}</p>
        </div>}
      </div>
    </div>
  );
}