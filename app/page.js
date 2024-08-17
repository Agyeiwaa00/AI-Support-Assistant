"use client";
import { Box, Stack, TextField, Button} from "@mui/material";
import { useState } from "react";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hello. I am amaChatbot support, how may help you`,
    },
  ]);

  const sendMessage = async () => {
    setMessage('')
    setMessages((messages) => [...messages, {role:'user', content:message}])
    const response = fetch("/api/chat", {
      method: "POST",
      headers: {"Content-Type": "application/json",},
      body: JSON.stringify([...message, { role: "user", content: message }]),
    }).then(async (res) => {
      
    })
  }
   
  const [message, setMessage] = useState("");
  return (
    <Box
      width="500vw"
      height="100vh"
      //bgcolor={}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <Stack
        direction={"column"}
        width="500px"
        height="700px"
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