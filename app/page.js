"use client";
import { Box, Stack, TextField, Button } from "@mui/material";
import { useState } from "react";


   export default function Home() {
    const [messages, setMessages] = useState([
      {
        role: "assistant",
        content: `Hello. I am AmaChatbot, how may I help you?`,
      },
    ]);
  
    const [message, setMessage] = useState('');
  
    const sendMessage = async () => {
      // Append the user's message and an empty assistant message to the state
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'user', content: message },
        { role: 'assistant', content: '' },
      ]);
  
      // Clear the input message after sending
      setMessage('');
  
      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify([...messages, { role: 'user', content: message }]),
        });
  
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let result = '';
  
        const processText = async ({ done, value }) => {
          if (done) {
            return result;
          }
  
          const text = decoder.decode(value || new Uint8Array(), { stream: true });
          result += text;
  
          setMessages((prevMessages) => {
            const lastMessageIndex = prevMessages.length - 1;
            const lastMessage = prevMessages[lastMessageIndex];
  
            return [
              ...prevMessages.slice(0, lastMessageIndex),
              { ...lastMessage, content: lastMessage.content + text },
            ];
          });
  
          return reader.read().then(processText);
        };
  
        await reader.read().then(processText);
      } catch (error) {
        console.error('Error:', error);
        // Handle error appropriately
      }
    };
  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        direction={"column"}
        width="500px"
        height="500px"
        border="1px solid black"
        p={2}
        spacing={3}
      >
        <Stack
          direction={"column"}
          spacing={2}
          flexGrow={1}
          overflow="auto"
          maxHeight="100%"
        >
          {messages.map((message, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={
                message.role === "assistant" ? "flex-start" : "flex-end"
              }
            >
              <Box
                bgcolor={
                  message.role === "assistant"
                    ? "primary.main"
                    : "secondary.main"
                }
                color="white"
                borderRadius={16}
                p={3}
              >
                {message.content}
              </Box>
            </Box>
          ))}
        </Stack>
        <Stack direction={"row"} spacing={2}>
          <TextField
            label="Message"
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button variant="contained" onClick={sendMessage}>
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
     /* method 2
     
     export default function Home() {

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hello. I am amaChatbot, how may help you?`,
    },
  ]);

  const [message, setMessage] = useState('');
  const sendMessage = async () => {
    setMessage('')
    setMessages((messages) => [...messages,{role:'user', content:message},
    {role:'assistant', content:''}
   ])
   
    const response = fetch('/api/chat', {
      method: 'POST',
      headers: {'Content-Type':'application/json',},
      body: JSON.stringify([...messages, { role: 'user', content: message}]),
    }).then(async (res) => {
      
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
      let result = ''
      return reader.read().then(function processText({done, value}){
      if (done) {
        return result
      }

      const text = decoder.decode(value || new Uint8Array(), {stream:true})
      setMessages((messages) =>{
        let lastMessage = messages.slice(messages.length-1)

        let otherMessage = messages.slice(0, messages.length-1)
      
      return [
        ...otherMessage, {...lastMessage, content:lastMessage.content + text},
      ]
    })
  
       return reader.read().then(processText)
      })
   })
  } */
