# HeyThere
## Description
A real-time chat application built with **Node.js**, **Socket.IO**, **React**, and **Zustand**, using **JWT** for user authentication and **MongoDB** for data storage. Features include online/offline user status, text/image messaging, and persistent WebSocket connections.

## Features
- **User Authentication**: Secured with JWT.
- **Real-Time Messaging**: Instant text and image messaging powered by Socket.IO.
- **User Status**: Shows online/offline status of users.
- **Persistent Connections**: WebSocket remains active during sessions.
- **Scalable Backend**: Built with Node.js and MongoDB.

## Technologies Used
- **Frontend**: React, Zustand, Vite
- **Backend**: Node.js, Express, Socket.IO
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)

## Installation and Setup

### Prerequisites
- Node.js
- MongoDB

### Steps
1. Clone the repository:
```
   git clone <repository-url>
```
2. Navigate to the backend directory:
```
cd backend
```
3. Install dependencies and start the backend:
```
npm install
npm run dev
```
4.Navigate to the frontend directory:
```
cd ../frontend
```
5.Install dependencies and start the frontend:
```
npm install
npm run dev
```
6.Environment Variables
Create a .env file in the backend directory with the following:

```

MONGODB_URI=...
PORT=....
JWT_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
NODE_ENV=development
```
## Usage
1. Start both the backend and frontend.
2. access the app at http://localhost:PORT.


