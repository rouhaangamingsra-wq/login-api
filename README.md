# Login API

Simple login/signup API built with Node.js, Express, bcrypt, and MongoDB.

## Setup

1. Install dependencies:
```
npm install
```

2. Create a `.env` file (see `.env.example`):
```
MONGODB_URI="your-mongodb-connection-string"
```

3. Run the server:
```
node index.js
```

Server runs on `http://localhost:3000`.

## Endpoints

### POST /signup
- Body: `{ "email": "...", "password": "..." }`
- Checks if email already exists
- Hashes password with bcrypt
- Creates user in MongoDB

### POST /login
- Body: `{ "email": "...", "password": "..." }`
- Finds user by email
- Compares password with bcrypt
- Returns success or error
