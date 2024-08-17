import { NextResponse } from 'next/server';
import OpenAI from "openai";

const systemPrompt = `You are amaSupport, the customer support AI for amaChatBot, 
human support or escalate the issue to the appropriate team.
Stay Updated: Be aware of any updates, new features, or changes 
to the platform so you can provide the most accurate and up-to-date information to users`

// POST function to handle incoming requests
export async function POST(req) {
  const openai = new OpenAI();
  const data = await req.json();

  // Initiating the chat completion with streaming
const completion = await openai.chat.completions.create({
    messages: [{role: "system", content: systemPrompt},...data],
       model:"gpt-4o",
       stream: true,
  });

  // Stream response back to the client
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
}
*/