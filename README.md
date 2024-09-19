# WebRTC Peer-to-Peer Connection Project

This project implements a WebRTC-based peer-to-peer connection system, allowing two users to connect directly. It uses Socket.IO for initial room creation and signaling, and PeerJS for establishing WebRTC connections.

## Technologies Used

- Backend:
  - Node.js
  - Express.js
  - Socket.IO

- Frontend:
  - React
  - Vite (as build tool)
  - PeerJS
  - Socket.IO (client)
  - shadcn UI

## Features

- Room creation using Socket.IO
- Peer-to-peer connection using WebRTC (via PeerJS)
- Real-time communication between users
- Modern UI built with React and shadcn UI components

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/Ryomensukuna2003/webRTC
   cd webRTC
   ```

2. Install backend dependencies:
   ```
   cd Server
   npm install
   ```

3. Install frontend dependencies:
   ```
   cd ../Client
   npm install
   ```


## Running the Application

1. Start the backend server:
   ```
   cd server
   npm start
   ```

2. In a new terminal, start the frontend development server:
   ```
   cd client
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173` (or the port Vite is using).


## Project Structure

```
webrtc-p2p-project/
├── server/
│   ├── src/
│   │   ├── server.js
│   │   └── socket.js
│   ├── package.json
│   └── .env
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── .env
└── README.md
```
