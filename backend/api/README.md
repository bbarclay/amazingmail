# AmazingMail Backend API

![AmazingMail Logo](../../readme_files/logo.png)

[![NestJS](https://img.shields.io/badge/NestJS-9.0+-E0234E.svg)](https://nestjs.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.5+-3178C6.svg)](https://www.typescriptlang.org/)
[![Supabase](https://img.shields.io/badge/Supabase-1.0+-3ECF8E.svg)](https://supabase.io/)
[![Docker](https://img.shields.io/badge/Docker-20.10+-2496ED.svg)](https://www.docker.com/)

Welcome to the backend API repository of AmazingMail, a powerful cold email system built with NestJS. This repository contains the server-side logic, database interactions, and API endpoints that power our email marketing platform.

## 🚀 Features

- 📧 **Email Campaign Management**: Create, update, and manage email campaigns.
- 📋 **Template Management**: Store and retrieve email templates.
- 📈 **Analytics Processing**: Collect and process campaign performance data.
- 🔒 **Authentication & Authorization**: Secure user authentication and role-based access control.
- 🌐 **Integration with Email Services**: Connect with various email sending providers.
- 💾 **Database Management**: Efficient data storage and retrieval using Supabase.
- 💬 **Webhook Handling**: Process incoming webhooks for email events.

## 🛠 Tech Stack

- **Framework**: [NestJS](https://nestjs.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [Supabase](https://supabase.io/) (PostgreSQL)
- **ORM**: [TypeORM](https://typeorm.io/)
- **Authentication**: [Passport.js](http://www.passportjs.org/)
- **Testing**: [Jest](https://jestjs.io/)
- **Documentation**: [Swagger](https://swagger.io/)
- **Containerization**: [Docker](https://www.docker.com/)

## 🚦 Getting Started

### Prerequisites

- Node.js 14.0 or later
- npm or yarn
- Docker (optional, for containerization)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/amazingmail/backend-api.git
   cd backend-api
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:
   ```env
   DATABASE_URL=your_supabase_database_url
   JWT_SECRET=your_jwt_secret
   SMTP_HOST=your_smtp_host
   SMTP_PORT=your_smtp_port
   SMTP_USER=your_smtp_username
   SMTP_PASS=your_smtp_password
   ```

4. Run the development server:
   ```bash
   npm run start:dev
   # or
   yarn start:dev
   ```

5. The API will be available at `http://localhost:3000`.

## 📁 Project Structure

```
/
├── src/
│   ├── campaigns/     # Campaign-related modules and services
│   ├── templates/     # Email template management
│   ├── analytics/     # Analytics processing and reporting
│   ├── auth/          # Authentication and authorization
│   ├── integrations/  # Third-party service integrations
│   ├── database/      # Database configurations and migrations
│   └── common/        # Shared utilities and interfaces
├── test/             # Test files
├── docs/             # API documentation
└── docker/           # Docker configurations
```

## 🧪 Running Tests

To run the test suite:

```bash
npm run test
# or
yarn test
```

For e2e tests:

```bash
npm run test:e2e
# or
yarn test:e2e
```

## 📊 API Documentation

API documentation is automatically generated using Swagger. After starting the development server, you can access the Swagger UI at:

```
http://localhost:3000/api
```

## 📦 Deployment

### Using Docker

1. Build the Docker image:
   ```bash
   docker build -t amazingmail-api .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 amazingmail-api
   ```

### Traditional Deployment

1. Build the project:
   ```bash
   npm run build
   # or
   yarn build
   ```

2. Start the production server:
   ```bash
   npm run start:prod
   # or
   yarn start:prod
   ```

## 🤝 Contributing

We welcome contributions to AmazingMail's backend API! Please see our [Contributing Guide](CONTRIBUTING.md) for more details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [NestJS Documentation](https://docs.nestjs.com/)
- [Supabase Documentation](https://supabase.io/docs)
- [TypeORM Documentation](https://typeorm.io/)

---

Built with ❤️ by the AmazingMail Team
