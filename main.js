const express = require('express');
const { Server } = require('socket.io');
const { OpenAI } = require('openai');
const http = require('http');

require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

async function TTSHandler(socket, message) {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            messages: [{ role: "user", content: message }]
        });

        const textResponse = completion.choices[0].message.content;

        const speechResponse = await openai.audio.speech.create({
            model: "tts-1",
            voice: "alloy",
            input: textResponse
        });

        const audioBuffer = Buffer.from(await speechResponse.arrayBuffer());
        const audioBase64 = audioBuffer.toString('base64');

        console.log('LLM Response:', textResponse);
        console.log('Audio Base64 Length:', audioBase64.length);

        socket.emit('tts_response', {
            audio: audioBase64
        });

    } catch (error) {
        console.error('Error:', error);
        socket.emit('error', { message: 'Error processing request' });
    }
}

io.on('connection', (socket) => {
    console.log('Client connected');

    socket.on('tts_request', (message) => TTSHandler(socket, message));

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});