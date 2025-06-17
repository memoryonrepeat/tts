Minimalistic API for text to LLM to speech processing.

How to run:
- Add OpenAI key to `.env` file, similar to `.env.example`
- Install dependencies using `npm install`
- Test using [Postman](https://learning.postman.com/docs/sending-requests/websocket/listen-to-socketio-events/), listen to `ws://localhost:3000/`. Remember to set Postman to listen to `tts_response` events (server side) and emit `tts_request` event type before sending the input.
