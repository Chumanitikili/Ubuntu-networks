# Smart Call Nexus - B2B2C Call Center Automation

A comprehensive call center automation solution built with React, TypeScript, and modern AI tools. This system handles both B2B and B2C calls with intelligent routing, AI-powered voice interactions, and CRM integration.

## Features

- 🤖 AI-Powered Voice Interactions
- 📞 Inbound/Outbound Call Handling
- 🔄 B2B/B2C Call Routing
- 📊 CRM Integration
- 🎯 Lead Management
- 📝 Call Transcription
- 📈 Analytics Dashboard

## Tech Stack

- React + TypeScript
- Twilio for Telephony
- OpenAI (GPT-4 + Whisper) for AI
- TailwindCSS for Styling
- Radix UI for Components
- Vite for Build Tooling

## Prerequisites

- Node.js 18+
- Twilio Account
- OpenAI API Key
- CRM System (HubSpot/Zoho)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Twilio Configuration
VITE_TWILIO_ACCOUNT_SID=your_account_sid
VITE_TWILIO_AUTH_TOKEN=your_auth_token
VITE_TWILIO_APPLICATION_SID=your_application_sid

# OpenAI Configuration
VITE_OPENAI_API_KEY=your_openai_api_key
VITE_OPENAI_MODEL=gpt-4
VITE_OPENAI_TEMPERATURE=0.7
VITE_OPENAI_MAX_TOKENS=150

# CRM Configuration
VITE_CRM_API_URL=your_crm_api_url
VITE_CRM_API_KEY=your_crm_api_key

# Application Configuration
VITE_APP_NAME=Smart Call Nexus
VITE_APP_ENV=development
VITE_APP_URL=http://localhost:5173
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/smart-call-nexus.git
cd smart-call-nexus
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/
│   └── call-center/
│       ├── CallHandler.tsx
│       ├── CallControls.tsx
│       └── CallAnalytics.tsx
├── hooks/
│   ├── useTwilio.ts
│   ├── useAIVoice.ts
│   ├── useLLM.ts
│   ├── useWhisper.ts
│   └── useCRM.ts
├── contexts/
│   └── CallContext.tsx
├── utils/
│   ├── twilio.ts
│   └── ai.ts
└── types/
    └── index.ts
```

## Usage

### B2B Call Handling

```typescript
import { CallHandler } from './components/call-center/CallHandler';

function B2BCallCenter() {
  return (
    <CallHandler
      callerType="B2B"
      onCallEnd={(callData) => {
        console.log('Call ended:', callData);
      }}
    />
  );
}
```

### B2C Call Handling

```typescript
import { CallHandler } from './components/call-center/CallHandler';

function B2CCallCenter() {
  return (
    <CallHandler
      callerType="B2C"
      onCallEnd={(callData) => {
        console.log('Call ended:', callData);
      }}
    />
  );
}
```

## AI Integration

The system uses OpenAI's GPT-4 for natural language understanding and Whisper for speech-to-text conversion. The AI components are designed to:

1. Understand caller intent
2. Determine if human intervention is needed
3. Provide contextual responses
4. Handle both B2B and B2C scenarios

## CRM Integration

The system integrates with your CRM to:

1. Track caller history
2. Update customer information
3. Log interactions
4. Manage leads and opportunities

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support, email support@smartcallnexus.com or open an issue in the repository.
