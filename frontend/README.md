# AmazingMail Frontend - Next.js Powered Email Marketing Platform

![AmazingMail Logo](../readme_files/logo.png)

[![Next.js](https://img.shields.io/badge/Next.js-13.0+-blueviolet.svg)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.0+-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.5+-blue.svg)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.0+-38B2AC.svg)](https://tailwindcss.com/)

Welcome to the frontend repository of AmazingMail, a cutting-edge email marketing platform built with Next.js. This repository contains the user interface and client-side logic for our powerful cold email system.

## 🚀 Features

- 📊 **Interactive Dashboard**: Real-time overview of campaign performance and key metrics.
- 📧 **Email Campaign Manager**: Intuitive interface for creating, editing, and managing email campaigns.
- 🎨 **Email Template Designer**: Drag-and-drop editor for creating stunning, responsive email templates.
- 📈 **Analytics Visualization**: Beautiful charts and graphs for in-depth campaign analysis.
- 🔒 **User Authentication**: Secure login and user management system.
- 🌓 **Dark Mode Support**: Eye-friendly dark theme for comfortable usage in low-light environments.
- 📱 **Responsive Design**: Seamless experience across desktop, tablet, and mobile devices.

## 🛠 Tech Stack

- **Framework**: [Next.js 13+](https://nextjs.org/) (with App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management**: [React Context API](https://reactjs.org/docs/context.html) & [SWR](https://swr.vercel.app/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **API Integration**: [Axios](https://axios-http.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/)
- **Testing**: [Jest](https://jestjs.io/) & [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

## 🚦 Getting Started

### Prerequisites

- Node.js 14.0 or later
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/amazingmail/frontend.git
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 📁 Project Structure

```
/
├── app/                # Next.js 13 App Router
│   ├── api/            # API routes
│   ├── (auth)/         # Authentication pages
│   ├── dashboard/      # Dashboard pages
│   ├── campaigns/      # Campaign management pages
│   └── templates/      # Email template pages
├── components/         # Reusable React components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions and services
├── styles/             # Global styles and Tailwind config
├── types/              # TypeScript type definitions
└── tests/              # Test files
```

## 🧪 Running Tests

To run the test suite:

```bash
npm test
# or
yarn test
```

## 🔧 Scripts

- `npm run dev`: Start the development server
- `npm run build`: Build the production application
- `npm start`: Start the production server
- `npm run lint`: Run ESLint
- `npm run type-check`: Run TypeScript compiler check

## 🤝 Contributing

We welcome contributions to AmazingMail! Please see our [Contributing Guide](CONTRIBUTING.md) for more details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Supabase Documentation](https://supabase.io/docs)

---

Built with ❤️ by the AmazingMail Team
