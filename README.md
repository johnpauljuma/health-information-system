# Health Information System (HIS)
## About the System
HIS is a basic health information system built to help doctors manage health programs (e.g., TB, Malaria, HIV) and register clients into these programs.
It allows a doctor to create programs, register clients, enroll them into programs, and view their profiles.
The system also exposes client profiles through an API so that other systems can fetch the data.

## Features
🏥 Create Health Programs (e.g., TB, Malaria, HIV)

👤 Register New Clients into the system

➡️ Enroll Clients into one or more health programs

🔎 Search for Clients easily

📄 View Client Profiles with a list of enrolled programs

🔗 Expose Client Profiles via API for integration with other systems

## Technology Stack
Frontend: Next.js (React framework)

Backend: Supabase (PostgreSQL)

Styling: Tailwind CSS

Authentication: Supabase Auth

Deployment: Vercel

## How to Access the System
### Option 1: Live Link
Access the live site via https://cema-health-information-system.vercel.app/

To interact with the site prototype, use these credentials to log in:

Email: jp0829673@gmail.com
Password: 123456

### Option 2: Running Locally
Clone the repository

git clone https://github.com/johnpauljuma/health-information-system.git

cd health-information-system

#### Install dependencies
npm install

#### Run the development server
npm run dev

Open http://localhost:3000 to access the system or the URL indicated on the terminal after running.
The database is hosted in the cloud on Superbase, so you don't need to set it up. Just ensure you have internet access while running the system locally to enable access.
Use the same credentials to log in and interact with the site:

Email: jp0829673@gmail.com
Password: 123456

## Usage
Login: Start from the login page using the given credentials.

Dashboard: View summary statistics and quick links.

Programs: Create and manage health programs.

Clients: Register new clients and manage client records.

Enrollments: Enroll clients into selected programs.

Profile Viewing: Click on a client to see their profile and enrolled programs.

API: Retrieve a client’s profile using the exposed API endpoint.

API Documentation
Get Client Profile:
GET /api/clients/:id
Returns the client’s full profile, including enrolled programs.

Sample response:


{
  "id": "client-id",
  
  "name": "John Doe",
  
  "phone": "0700000000",
  
  "programs": ["TB", "Malaria"]
}

## Future Enhancements
Add role-based access (Doctor, Admin, Nurse)

Add appointment and visit scheduling

Implement better search and filter capabilities

Improve security with JWT tokens for API access



This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
