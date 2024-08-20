import { NextResponse } from 'next/server';
import OpenAI from "openai";
//import {OpenAIStream, StreamingTextResponse} from 'ai'

const systemPrompt = `You are a customer support assistant for amaChatbot,
 a platform that allows users to practice technical interviews in real-time with AI.
  Your role is to assist users with any issues or questions they may have regarding 
  their experience on the platform. You should provide clear, concise, and friendly 
  responses, ensuring that users feel supported and understood. If a user asks about 
  interview tips, troubleshooting issues, subscription details, or any other platform-related
  queries, guide them with accurate information. If an issue requires human intervention,
   reassure the user and escalate the issue as needed. Always strive to make the user’s
    experience smooth and positive`

// POST function to handle incoming requests
export async function POST(req) {
  const openai = new OpenAI(process.env.OPENAI_API_KEY);
  const data = await req.json()

  // Initiating the chat completion with streaming
const completion = await openai.chat.completions.create({
    messages: [{role: "system",content:systemPrompt},...data],
       model:"gpt-3.5-turbo",
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

// pages/api/stream-chat.js

/* method 2

export async function POST(req) {
  try {
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Invalid or missing messages' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const openai = new OpenAI(process.env.OPENAI_API_KEY);

    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: messages,
      stream: true,
    });

    const stream = new ReadableStream({
      start(controller) {
        response.on('data', (data) => {
          const payload = JSON.parse(data);
          if (payload.choices && payload.choices.length > 0) {
            const text = payload.choices[0].delta?.content;
            if (text) {
              controller.enqueue(`data: ${text}\n\n`);
            }
          }
        });

        response.on('end', () => {
          controller.close();
        });

        response.on('error', (error) => {
          console.error(error);
          controller.error('An error occurred while streaming');
        });
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Server Error:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
*/
 

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

