GitHub Repository Description for Voting App Backend

Voting App Backend
A robust RESTful API and WebSocket-powered backend for a real-time voting application, built with NestJS, MongoDB, and TypeScript. This backend enables users to create polls, join them with unique codes, add options, and cast votes, with live updates delivered via WebSockets. It features secure user authentication using JWT, Passport, and Bcrypt, ensuring protected access to poll management and voting actions.  

Key Features:  
- Poll Management: Create polls with customizable options, start/close voting, and track results.  
- Real-Time Updates: Utilizes Socket.IO to broadcast vote updates instantly to all participants.  
- Authentication: Secure user registration and login with JWT-based authorization.  
- Vote Integrity: Prevents duplicate voting by tracking user votes per option.  
- Data Persistence:  Stores polls, options, and user data in MongoDB with Mongoose for schema management.  

Tech Stack:  
- NestJS: Modular framework for building scalable server-side applications.  
- MongoDB & Mongoose: NoSQL database with schema validation for flexible data storage.  
- Socket.IO: Enables real-time bidirectional communication.  
- JWT & Passport: Authentication and authorization middleware.  
- Bcrypt: Password hashing for secure user credentials.  

How It Works:  
The backend exposes RESTful endpoints (e.g., `POST /polls`, `POST /polls/:id/vote`) for poll creation, management, and voting, secured with JWT guards. A WebSocket gateway handles real-time vote updates, ensuring all participants see changes instantly. MongoDB stores poll data, with logic to enforce rules like preventing owners from voting or participants from re-voting.



Setup:  
1. Clone the repo: `git clone <repo-url>`  
2. Install dependencies: `npm install`  
3. Configure MongoDB connection in `app.module.ts`.  
4. Run: `npm run start:dev`  

This backend is designed for extensibility and serves as the core for a full-stack voting application. Contributions and feedback welcome!
