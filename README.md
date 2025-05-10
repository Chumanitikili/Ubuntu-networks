# Ubuntu Networks - Smart Call Center Management System

## Overview

Ubuntu Networks is a modern call center management system built with cutting-edge web technologies. The application provides comprehensive tools for managing call center operations, including real-time call monitoring, agent performance tracking, and detailed analytics.

**Live Demo**: [https://smart-call-nexus.windsurf.build](https://smart-call-nexus.windsurf.build)

## Features

- **Real-time Call Monitoring**: Track active calls and agent status in real-time
- **Analytics Dashboard**: Comprehensive analytics and reporting tools
- **Agent Management**: Track and manage agent performance and availability
- **Ticket System**: Integrated ticket management system
- **AI Assistant**: Smart AI-powered assistant for enhanced customer service
- **Responsive Design**: Full mobile and desktop support

## Technology Stack

This project is built with modern web technologies:

- **Frontend Framework**: React with TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS
- **State Management**: React Context
- **Authentication**: Supabase Auth

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd ubuntu-networks

# Install dependencies
npm install

# Start development server
npm run dev
```

The development server will start at `http://localhost:5173`

## Build and Deployment

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

The application is deployed on Netlify. Each commit to the main branch triggers an automatic deployment.

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
