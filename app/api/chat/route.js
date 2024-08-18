import { NextResponse } from 'next/server';
import OpenAI from "openai";

const systemPrompt = `how are you?`

// POST function to handle incoming requests
export async function POST(req) {
  const openai = new OpenAI(    
    { apiKey:"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",}
  );

  const data = await req.json();
  // Initiating the chat completion with streaming
const completion = await openai.chat.completions.create({
    messages: [{role: "user", content: systemPrompt},...data],
       model:"gpt-4o",
       stream: true,
  });
  
  // Stream response back to the client
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
        try {
            for await (const chunk of completion) {
                const content = chunk.choices[0]?.delta?.content;
                if (content) {
                    const text = encoder.encode(content);
                    controller.enqueue(text);
                }
            }
        } catch (err) {
            controller.error(err);
        } finally {
            controller.close();
        }
    }
});


return new NextResponse(stream);

    }
 

/*
//Response stream: method 2
const stream = new ReadableStream ({
  start(controller) {
    completion.on('data', (chunk) => {
    const text = new TextDecoder().decode(chunk)
    controller.enqueue(text)
    })
 
    completion.on('end', () =>{
      controller.close ()
    })
    controller.on('error', (err) => {
      controller.error(err)
    })
  },
 })

*/

/*
//Response stream: method 2
const stream = new ReadableStream({
    async start(controller) {
        try {
            for await (const chunk of completion) {
                const content = chunk.choices[0]?.delta?.content;
                if (content) {
                    const text = encoder.encode(content);
                    controller.enqueue(text);
                }
            }
        } catch (err) {
            controller.error(err);
        } finally {
            controller.close();
        }
    }
});
*/

