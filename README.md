# AmazingMail - Revolutionary Cold Email System

![AmazingMail Logo](readme_files/logo.png)

[![GitHub stars](https://img.shields.io/github/stars/amazingmail/amazingmail.svg?style=social&label=Star)](https://github.com/amazingmail/amazingmail)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](http://makeapullrequest.com)

AmazingMail is a cutting-edge cold email system built with Next.js and NestJS, designed to revolutionize the way businesses manage and automate their email outreach campaigns. With its powerful features and user-friendly interface, AmazingMail empowers users to create stunning email templates, integrate seamlessly with popular email service providers, and even set up their own email servers.

## 🚀 Features

### Existing Features
- 📧 **Intuitive Email Campaign Manager**: Create, manage, and track email campaigns with ease.
- 🎨 **Advanced Email Template Designer**: Craft beautiful, responsive email templates with our drag-and-drop editor.
- 📊 **Real-time Analytics Dashboard**: Monitor campaign performance with detailed, actionable insights.
- 🔗 **Seamless Integrations**: Connect with popular email services and tools to streamline your workflow.
- 🔒 **Robust Security**: Enterprise-grade security measures to protect your data and ensure compliance.
- 🌐 **Custom Domain & Server Setup**: Easily configure your own domains and email servers for improved deliverability.
- 🧪 **A/B Testing**: Optimize your campaigns with powerful split testing capabilities.
- 🤖 **Basic AI-Powered Suggestions**: Initial implementation of machine learning for content optimization.

### Backlog (To-Do)
- [ ] **Advanced AI-powered content suggestions**: Enhance the AI capabilities for more sophisticated content recommendations.
- [ ] **Enhanced A/B testing capabilities**: Implement more advanced A/B testing features and analytics.
- [ ] **Mobile app development**: Create a mobile application for on-the-go campaign management.
- [ ] **Blockchain-based email verification system**: Implement a cutting-edge verification system using blockchain technology.
- [ ] **Integration with Kamtara Email Service**: Develop a seamless integration with Kamtara for advanced email management.
- [ ] **Namecheap API integration**: Automate domain registration and email setup process through Namecheap API.
- [ ] **Multi-language support**: Implement internationalization for global user base.
- [ ] **Advanced user role management**: Develop more granular access control and team collaboration features.
- [ ] **Email deliverability optimization**: Implement advanced techniques to improve email deliverability rates.
- [ ] **Custom reporting and export features**: Allow users to create and export customized reports.

## 🖥 Screenshots

![Dashboard](readme_files/dashboard.png)
*Comprehensive Dashboard for Campaign Overview*

![Email Designer](readme_files/email_designer.png)
*Intuitive Drag-and-Drop Email Template Designer*

![Analytics](readme_files/analytics.png)
*Detailed Analytics for Data-Driven Decision Making*

## 🛠 Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: NestJS, TypeScript, Supabase (PostgreSQL)
- **Authentication**: NextAuth.js, Passport.js
- **Email Services**: Integration with various SMTP providers
- **Testing**: Jest, React Testing Library
- **CI/CD**: GitHub Actions
- **Containerization**: Docker

## 🚦 Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Supabase account
- Docker (optional, for containerization)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/amazingmail/amazingmail.git
   cd amazingmail
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   - For frontend (in `/frontend/.env`):
     ```env
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```
   - For backend (in `/backend/.env`):
     ```env
     SUPABASE_URL=your_supabase_project_url
     SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
     ```

4. Run database migrations:
   ```bash
   npm run migrate
   # or
   yarn migrate
   ```

5. Start the development servers:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the frontend application.
   The backend API will be available at [http://localhost:3001](http://localhost:3001).

## 📚 Documentation

For detailed documentation on how to use AmazingMail, please refer to our [Wiki](https://github.com/amazingmail/amazingmail/wiki).

## 🗺 Roadmap

Our current roadmap focuses on enhancing existing features and implementing new capabilities:

1. Improve AI-powered content suggestions
2. Develop mobile application
3. Implement blockchain-based email verification
4. Enhance A/B testing capabilities
5. Integrate with Kamtara Email Service and Namecheap API
6. Implement multi-language support
7. Develop advanced user role management
8. Optimize email deliverability
9. Create custom reporting and export features

See our [project board](https://github.com/amazingmail/amazingmail/projects) for the full roadmap and progress updates.

## 🤝 Contributing

We welcome contributions from the community! Please check out our [Contributing Guidelines](CONTRIBUTING.md) for more information on how to get started.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgements

- [Next.js](https://nextjs.org/) - The React Framework for Production
- [NestJS](https://nestjs.com/) - A progressive Node.js framework
- [Supabase](https://supabase.io/) - The Open Source Firebase Alternative
- [Kamtara Email Service](https://kamtara.com/) - Advanced Email Management and Automation
- [Namecheap](https://www.namecheap.com/) - Domain Registration and Management

## 📞 Contact

For support or inquiries, please reach out to us at support@amazingmail.com or join our [community Discord](https://discord.gg/amazingmail).

---

<p align="center">Made with ❤️ by the AmazingMail Team</p>

