# WebRTC Peer-to-Peer Connection Project

This project implements a WebRTC-based peer-to-peer connection system, allowing two users to connect directly. It uses Socket.IO for initial room creation and signaling, and PeerJS for establishing WebRTC connections.

# About WebRTC

## Overview

WebRTC (Web Real-Time Communication) is a powerful technology with several key features:

- Stands for Web Real-Time Communication
- Provides a standardized API (Simple to use)
- Offers low latency communication
- Enables peer-to-peer connections

## How WebRTC Works

The process of establishing a WebRTC connection between two peers (let's call them A and B) can be broken down into these steps:

1. **Connection Initiation**
   - A wants to connect to B

2. **Route Discovery**
   - A finds every possible route to B
   - B finds every possible route to A

3. **Signaling**
   - A and B signal each other their session information
   - This can be done via various methods:
     - WhatsApp
     - QR code
     - WebSocket
     - Any other suitable method
   - This step is known as "Offering"

4. **Connection Establishment**
   - A connects to B via the most optimal path

5. **Capability Exchange**
   - A and B share their supported media types and security protocols

6. **Connection Complete**
   - The WebRTC connection is established and ready for use
     
7. **And happy ever after 😊**

This peer-to-peer approach allows for direct, efficient communication between users without requiring intermediary servers for data exchange.

![webRTC](https://github.com/user-attachments/assets/d965b0f7-317c-4ce8-9b84-f7d60e583843)

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
