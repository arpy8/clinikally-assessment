# Frontend - Demo Application

A modern React/Next.js frontend application for connecting patients with dermatologists. This application provides an interactive interface for browsing doctors, booking appointments, and managing user accounts.

Deployed Link: [clinikally-demo.arpy8.com](https://clinikally-demo.arpy8.com)

> [!NOTE]
> Sample downloadable and shareable patient report: [View Report](https://clinikally-demo.arpy8.com/recommendation/2b0a8a26-c041-4f95-a2bc-b01d52968937)

## Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/arpy8/clinikally-assessment
   cd assessment/frontend
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Run the development server**
   ```bash
   bun run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Available Scripts

- `bun run dev` - Start development server with NODE_ENV=development
- `bun run build` - Build for production with NODE_ENV=production
- `bun start` - Start production server
- `bun run lint` - Run ESLint for code quality

## Project Structure

```
frontend/
├── app/                   # Next.js app directory
│   ├── bits/              # Reusable components from reactbits
│   ├── doctors/           # Doctor browsing pages
│   ├── register/          # Registration pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout component
│   └── page.tsx           # Home page
├── components/            # Shared UI components
│   ├── ui/                # Base UI components (Button, etc.)
│   ├── navbar.tsx         # Navigation component
│   └── auth-provider.tsx  # Authentication context
├── public/                # Static assets
├── tailwind.config.ts     # Tailwind CSS configuration
├── next.config.mjs        # Next.js configuration
└── package.json           # Dependencies and scripts
```

## Environment Setup

The application is configured to work in both development and production environments:

## Integration

This frontend is designed to work with a backend API for:
- User authentication
- Doctor profiles and ratings
- Appointment scheduling
- Product recommendations
