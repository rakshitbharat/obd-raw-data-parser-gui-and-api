# OBD Raw Data Parser GUI and API

A web application for parsing and analyzing OBD (On-Board Diagnostics) raw data with a modern user interface built using Next.js 14.

## Features

- 🚗 Parse OBD raw data in real-time
- 🎨 Modern UI with Radix UI components
- 📊 Data visualization with Recharts
- 🌙 Dark/Light mode support
- 📱 Fully responsive design

## Prerequisites

- Node.js >= 18.0.0
- Bun (recommended) or npm/yarn/pnpm

## Getting Started

1. Clone the repository:
```bash
git clone [your-repo-url]
cd obd-raw-data-parser-gui-and-api
```

2. Install dependencies:
```bash
bun install
# or npm install
```

3. Run the development server:
```bash
bun dev
# or npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Project Structure

- `/src/app` - Next.js 14 app router pages and API routes
- `/src/components` - Reusable UI components
- `/src/lib` - Core functionality and utilities
- `/src/hooks` - Custom React hooks

## Technologies Used

- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Radix UI Components
- Recharts for data visualization
- obd-raw-data-parser library

## Development

The project uses modern development tools and practices:

- TypeScript for type safety
- ESLint for code linting
- Tailwind CSS for styling
- Next.js App Router for routing
- Radix UI for accessible components

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
