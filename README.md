# Local Development Setup

For the project's features, business logic, database relationships, and technical architecture, see the [Backend README](https://github.com/iarafathossain/messmate-backend).

This guide covers running the backend and frontend locally for development and testing.

## Backend Setup

1. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/iarafathossain/messmate-backend.git
   cd messmate-backend
   npm install
   ```

2. Create a `.env` file and configure the environment variables:

   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/mydb?schema=public"
   PORT=8000
   NODE_ENV=development
   ACCESS_TOKEN_SECRET=your_secret_key
   ACCESS_TOKEN_EXPIRES_IN=1d
   ACCESS_TOKEN_COOKIE_MAX_AGE=1d
   FRONTEND_URL=http://localhost:3000
   ```

   Ensure PostgreSQL is running and the database exists.

3. Generate the Prisma client and start the development server:

   ```bash
   npx prisma generate
   npm run dev
   ```

   Backend URL: `http://localhost:8000`

## Frontend Setup

1. Clone the repository and install dependencies:

   ```bash
   git clone https://github.com/iarafathossain/messmate-frontend.git
   cd messmate-frontend
   npm install
   ```

2. Create a `.env` file:

   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
   ACCESS_TOKEN_SECRET=your_secret_key
   ```

   Use the same secret as the backend if the frontend requires it for token handling.

3. Start the frontend:

   ```bash
   npm start
   ```

   Frontend URL: `http://localhost:3000`

**Prerequisites:** Node.js, npm, and PostgreSQL.
