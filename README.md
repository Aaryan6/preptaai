# PreptaAI - AI Interview Experience

## Overview

PreptaAI is a modern Next.js application that provides an interactive AI interview experience. Users can practice interviews with an AI interviewer that responds to their answers, providing a realistic interview experience to help prepare for real job interviews.

## Features

- **Live AI Interviews**: Experience real-time interviews with an AI interviewer
- **Video and Audio Controls**: Toggle camera and microphone as needed
- **Live Transcript**: View a transcript of the interview in real-time
- **Beautiful UI**: Modern, professional interface with smooth animations
- **Performance Metrics**: Get feedback on your interview performance

## Tech Stack

- **Next.js**: React framework for building the application
- **Vercel AI SDK**: For AI capabilities
- **Deepgram**: For speech-to-text processing
- **Shadcn UI**: Component library for consistent design
- **Tailwind CSS**: For styling
- **Supabase**: For database management
- **Clerk**: For authentication
- **Zustand**: For state management

## Getting Started

1. Install dependencies:

```bash
# On Unix/Linux/macOS
sh install-dependencies.sh

# On Windows
install-dependencies.bat
```

2. Run the development server:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Interview Components

The AI interview experience is built with modular components:

- `InterviewLayout`: The main container orchestrating all components
- `InterviewHeader`: Header with interview info and timer
- `InterviewVideoArea`: Video displays for both AI and user
- `InterviewControls`: Controls for microphone, camera, and other settings
- `InterviewSidebar`: Details and metadata about the current interview
- `TranscriptSidebar`: Real-time transcript of the conversation

## Contributing

1. Follow the component-based architecture
2. Create new components in the appropriate folders
3. Use the existing styling patterns for consistency
4. Test thoroughly before submitting changes

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Interviewers Feature

The application now fetches interviewers from the `interviewers_info` table in Supabase with the following structure:

- `id`: Unique identifier for the interviewer
- `name`: Display name of the interviewer
- `avatar`: URL to the interviewer's avatar image
- `voice_id`: ID of the voice used by the interviewer
- `gender`: Gender of the interviewer
- `language`: Language supported by the interviewer
- `voice_url`: URL to a sample of the interviewer's voice

Since the `behavior` field isn't in the database table yet, we're using dummy behavior descriptions based on the `voice_id`.

### Implementation Details

1. **Data Fetching**: Using Zustand for state management, we fetch the interviewers from Supabase using a server action.
2. **Component Structure**: The interviewers are displayed in two groups:
   - Main interviewers (first 3) shown on the main selection screen
   - Additional interviewers shown in a dialog when "More options" is selected
3. **User Experience**: Loading states, error handling, and voice samples are provided for a smooth experience.

## Stack

- NextJS
- Vercel AI SDK
- Deepgram
- Shadcn
- Tailwind CSS
- Supabase for Database
- Clerk for Auth
- Zustand for state management

## Development

To run the project locally:

```bash
npm install
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).
