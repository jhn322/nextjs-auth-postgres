# Next.js Auth MongoDB Template

A full-stack authentication template built with Next.js, MongoDB, and NextAuth.js. This template provides a complete authentication system with email/password authentication, OAuth providers (Google and GitHub), email verification, and password reset functionality.

## Features

- 🔐 **Multiple Authentication Methods**
  - Email/password authentication
  - Google OAuth
  - GitHub OAuth
- ✉️ **Email Functionality**
  - Email verification on registration
  - Password reset via email
  - Transactional emails via Brevo
- 🗄️ **Database**
  - MongoDB with Prisma ORM
  - User management with roles (USER, ADMIN)
  - Session and account management
- 🎨 **Modern UI**
  - Built with React 19 and Next.js 15
  - Tailwind CSS v4 for styling
  - Shadcn/ui components
  - Responsive design
- 🔒 **Security**
  - Password hashing with bcryptjs
  - Secure session management
  - Protected routes with middleware
  - Email verification required for login

## Prerequisites

Before you begin, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/) or [pnpm](https://pnpm.io/)
- A MongoDB database (local or cloud)
- A Google Cloud Console account (for Google OAuth)
- A GitHub account (for GitHub OAuth)
- A Brevo account (for email sending)

## Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd nextjs-auth-mongo-template
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
   - For development/testing, you can temporarily allow access from anywhere by adding `0.0.0.0/0` (⚠️ **Not recommended for production**)
   - Click **"Confirm"**

#### Option B: Local MongoDB

1. Install MongoDB locally following the [official installation guide](https://www.mongodb.com/docs/manual/installation/)
2. Start your MongoDB service
3. Your connection string will be: `mongodb://localhost:27017/<database-name>`

### 4. Set Up Environment Variables

Create a `.env.local` file in the root directory of the project:

```bash
# Database
DATABASE_URL="your-mongodb-connection-string"

# NextAuth Configuration
NEXTAUTH_URL="https://your-production-domain.com"
NEXTAUTH_SECRET="your-generated-secret-here"

# Application URL
NEXT_PUBLIC_APP_URL="https://your-production-domain.com"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# GitHub OAuth
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# Brevo Email Service
BREVO_API_KEY="your-brevo-api-key"
EMAIL_FROM_NAME="Your App Name"
EMAIL_FROM_ADDRESS="noreply@yourdomain.com"
```

#### Generate NEXTAUTH_SECRET

You can generate a secure secret using one of these methods:

**Using OpenSSL (recommended):**

```bash
openssl rand -base64 32
```

**Using Node.js:**

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Online generator:**
Visit [https://generate-secret.vercel.app/32](https://generate-secret.vercel.app/32)

### 5. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **"Create Credentials"** > **"OAuth client ID"**
5. If prompted, configure the OAuth consent screen:
   - Choose **"External"** (unless you have a Google Workspace)
   - Fill in the required information (App name, User support email, Developer contact)
   - Add scopes: `email`, `profile`
   - Add test users if needed
6. Create OAuth client ID:
   - Application type: **"Web application"**
   - Name: Your application name
   - Authorized JavaScript origins:
     - For production: `https://your-production-domain.com`
     - For development: `http://localhost:3000`
   - Authorized redirect URIs:
     - For production: `https://your-production-domain.com/api/auth/callback/google`
     - For development: `http://localhost:3000/api/auth/callback/google`
7. Copy the **Client ID** and **Client Secret** to your `.env.local` file

### 6. Set Up GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **"New OAuth App"**
3. Fill in the application details:
   - **Application name**: Your application name
   - **Homepage URL**:
     - For production: `https://your-production-domain.com`
     - For development: `http://localhost:3000`
   - **Authorization callback URL**:
     - For production: `https://your-production-domain.com/api/auth/callback/github`
     - For development: `http://localhost:3000/api/auth/callback/github`
4. Click **"Register application"**
5. Copy the **Client ID**
6. Click **"Generate a new client secret"** and copy the secret
7. Add both to your `.env.local` file

### 7. Set Up Brevo (Email Service)

1. Go to [Brevo](https://www.brevo.com/) and create an account
2. Navigate to **Settings** > **SMTP & API**
3. Click on **"API Keys"** tab
4. Click **"Generate a new API key"**
5. Give it a name (e.g., "Next.js Auth Template")
6. Copy the API key to your `.env.local` file as `BREVO_API_KEY`
7. Set `EMAIL_FROM_NAME` to your desired sender name (e.g., "My App")
8. Set `EMAIL_FROM_ADDRESS` to a verified sender email address in Brevo:
   - Go to **Settings** > **Senders**
   - Add and verify your sender email address
   - Use this verified email in `EMAIL_FROM_ADDRESS`

### 8. Generate Prisma Client

```bash
npx prisma generate
```

### 9. Run Database Migrations

```bash
npx prisma db push
```

Or if you prefer to use migrations:

```bash
npx prisma migrate dev
```

### 10. Start the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Environment Variables Reference

### Required Variables

| Variable               | Description                                            | Example                                              |
| ---------------------- | ------------------------------------------------------ | ---------------------------------------------------- |
| `DATABASE_URL`         | MongoDB connection string                              | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `NEXTAUTH_URL`         | Base URL of your application (production)              | `https://yourdomain.com`                             |
| `NEXTAUTH_SECRET`      | Secret key for NextAuth (generate securely)            | `base64-encoded-random-string`                       |
| `NEXT_PUBLIC_APP_URL`  | Public URL of your application                         | `https://yourdomain.com`                             |
| `GOOGLE_CLIENT_ID`     | Google OAuth Client ID                                 | `123456789-abc.apps.googleusercontent.com`           |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret                             | `GOCSPX-xxxxxxxxxxxxx`                               |
| `GITHUB_CLIENT_ID`     | GitHub OAuth Client ID                                 | `Iv1.xxxxxxxxxxxxx`                                  |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth Client Secret                             | `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`                   |
| `BREVO_API_KEY`        | Brevo API key for sending emails                       | `xkeysib-xxxxxxxxxxxxx`                              |
| `EMAIL_FROM_NAME`      | Name displayed in email sender                         | `My App`                                             |
| `EMAIL_FROM_ADDRESS`   | Email address to send from (must be verified in Brevo) | `noreply@yourdomain.com`                             |

### Development vs Production

#### Development (`.env.local`)

```bash
DATABASE_URL="mongodb+srv://user:pass@cluster.mongodb.net/dbname"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"
BREVO_API_KEY="your-brevo-api-key"
EMAIL_FROM_NAME="My App"
EMAIL_FROM_ADDRESS="noreply@yourdomain.com"
```

#### Production (Set in your hosting platform)

When deploying to production (Vercel, Netlify, etc.), set these environment variables in your platform's dashboard:

- Use your production domain for `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL`
- Ensure MongoDB network access allows your production server's IP
- Update OAuth redirect URIs to use your production domain
- Use a strong, randomly generated `NEXTAUTH_SECRET`

## Project Structure

```
nextjs-auth-mongo-template/
├── prisma/
│   └── schema.prisma          # Prisma schema for MongoDB
├── src/
│   ├── app/                   # Next.js App Router pages
│   │   ├── api/               # API routes
│   │   │   └── auth/          # Authentication API routes
│   │   └── auth/              # Authentication pages
│   ├── components/            # React components
│   │   ├── auth/              # Authentication components
│   │   └── ui/                # shadcn/ui components
│   ├── lib/                   # Utility functions and configurations
│   │   ├── auth/              # NextAuth configuration
│   │   ├── constants/         # Application constants
│   │   ├── email/             # Email service (Brevo)
│   │   └── validations/       # Zod validation schemas
│   └── middleware.ts          # Next.js middleware for route protection
└── public/                    # Static assets
```

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npx prisma generate` - Generate Prisma Client
- `npx prisma db push` - Push schema changes to database
- `npx prisma studio` - Open Prisma Studio (database GUI)

## Authentication Flow

1. **Registration**: Users can register with email/password or OAuth (Google/GitHub)
2. **Email Verification**: Email/password users receive a verification email
3. **Login**: Users can log in with email/password (after verification) or OAuth
4. **Password Reset**: Users can request a password reset via email
5. **Session Management**: Sessions are managed via NextAuth.js with JWT strategy

## Security Considerations

- ⚠️ **MongoDB Network Access**: For production, restrict MongoDB access to specific IP addresses rather than `0.0.0.0/0`
- 🔐 **NEXTAUTH_SECRET**: Always use a strong, randomly generated secret
- 🔒 **Environment Variables**: Never commit `.env.local` to version control
- ✅ **Email Verification**: Email verification is required before users can log in with email/password
- 🛡️ **Password Hashing**: Passwords are hashed using bcryptjs before storage

## Troubleshooting

### MongoDB Connection Issues

- Verify your `DATABASE_URL` is correct
- Check that your IP address is whitelisted in MongoDB Atlas
- Ensure your MongoDB user has the correct permissions

### OAuth Not Working

- Verify redirect URIs match exactly (including protocol and trailing slashes)
- Check that client IDs and secrets are correct
- Ensure OAuth consent screen is properly configured (Google)

### Email Not Sending

- Verify your Brevo API key is correct
- Check that `EMAIL_FROM_ADDRESS` is verified in Brevo
- Review Brevo dashboard for any errors or rate limits

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository in [Vercel](https://vercel.com)
3. Add all environment variables in the Vercel dashboard
4. Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Netlify
- AWS Amplify
- Railway
- Render

Make sure to:

- Set all required environment variables
- Configure MongoDB network access for your server's IP
- Update OAuth redirect URIs to your production domain

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

**Note**: This is a template project. Make sure to customize it according to your needs, especially:

- Update `APP_NAME` in `src/lib/constants/site.ts`
- Customize email templates in `src/lib/email/brevo.ts`
- Adjust authentication flows and user roles as needed
- Review and update security settings for production use
