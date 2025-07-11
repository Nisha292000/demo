# Lead Form with Neon PostgreSQL Integration

This project uses Netlify Functions with Neon PostgreSQL database for storing contact form submissions and sending emails.

## Features

- Contact form with name, email, phone, services, and message fields
- Email notifications using Nodemailer
- Data storage in Neon PostgreSQL database
- Netlify Functions for serverless backend

## Setup Instructions

### 1. Netlify CLI Installation

```bash
npm install -g netlify-cli
```

### 2. Netlify Login

```bash
netlify login
```

### 3. Database Setup

#### Initialize Database
```bash
netlify db:init
```

#### Run Migrations
```bash
netlify db:migrate
```

#### Check Database Status
```bash
netlify db:status
```

### 4. Environment Variables

Set these environment variables in your Netlify dashboard:

- `EMAIL_USER`: Your Gmail address
- `EMAIL_PASS`: Your Gmail app password
- `RECEIVER_EMAIL`: Email address to receive notifications

### 5. Local Development

```bash
# Install dependencies
npm install

# Start local development server
netlify dev
```

### 6. Deploy to Production

```bash
netlify deploy --prod
```

## Database Schema

The `contact_submissions` table has the following structure:

```sql
CREATE TABLE contact_submissions (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    services TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## API Endpoint

- **POST** `/api/submit-form`
- **Body**: JSON with `name`, `email`, `phone`, `services`, `message`
- **Response**: Success message with submission ID

## Security Notes

1. Email credentials are stored as environment variables
2. Database connection is handled securely by Netlify
3. Input validation is implemented
4. Error handling for both email and database operations

## Migration from MongoDB

This project was migrated from MongoDB to Neon PostgreSQL. Key changes:

- Replaced MongoDB client with Netlify's `getDatabase()`
- Updated queries from MongoDB syntax to SQL
- Added proper database migrations
- Improved error handling and logging 