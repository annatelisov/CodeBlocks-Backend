# Code Blocks App - Backend

This repository contains the backend code for the Code Blocks App, an online coding platform that allows a JS lecturer to follow his student's progress in real-time as they work on various code blocks.

## Features

- **Real-time Communication**: Uses Socket.IO to synchronize code changes across users.
- **Role Management**: Automatically assigns mentor and student roles based on user entry.
- **Database**: Stores code blocks and solutions in a MongoDB Atlas database.

## Tech Stack

- **Node.js**: JavaScript runtime for the server.
- **Express**: Web framework for building the API.
- **Socket.IO**: For real-time communication.
- **Mongoose**: MongoDB object modeling tool.
- **MongoDB Atlas**: Cloud database service.
- **Heroku**: Deployment platform for the live API.

## API Endpoints

- `GET /api/blocks`: Retrieves the list of code blocks.
- `GET /api/blocks/:id`: Retrieves a specific code block by ID.
- `PUT /api/blocks/:id`: Updates a code block with new code.

## Getting Started

### Prerequisites

- Node.js and npm installed on local machine.

### Runing app localy

- node server.js
- Runing localy at http://localhost:5000

### Deployment 

- Deploy at Heroku platform.
- App's Frontend url: https://frontendcodeblocksapp-d21f3e724ed4.herokuapp.com/
- App's Backend url: https://backendcodeblocksapp-02d7e23a5120.herokuapp.com/

  ### DataBase 

- DataBase using MongoDB Atlas.
- URL: mongodb+srv://annatelisov:<password>@codeblocks-cluster.ovvx9.mongodb.net/codeblocks?retryWrites=true&w=majority

#  Thanks for interesting my app! #

