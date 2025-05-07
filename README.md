# Brarista Chat Frontend Task

## Overview
You are tasked with improving and extending an existing chat interface for a bra fitting consultation service. The current implementation includes a basic chat system and the start of a quiz feature, as well as translation and page navigation logic.

## Your Tasks

### 1. Quiz Implementation (Figma Design)
Implement the quiz system in the chat interface, following the provided Figma design. The logic to trigger the quiz is already started (see the chat service and how 'start quiz' is handled). Your job is to:
- Build a user-friendly quiz UI inside the chat, matching the Figma design
- Display questions, options, and handle user answers
- Show quiz progress and results
- Make the quiz experience seamless and engaging

### 2. Translations
Ensure that translations work throughout the chat and quiz experience. The language selection modal is already present. Your job is to:
- Make sure all labels, buttons, and quiz content are translated according to the selected language
- Handle language switching gracefully

### 3. Chatbot Open/Close Logic
Add logic to control when the chatbot is open or closed. This should include:
- A button to manually open/close the chatbot
- The ability to configure on which pages the chatbot should open or close automatically (for example, a customer may want it to open on pages 2 and 4, but not 1 and 3; this should be easily configurable)
- The chat should respond to both manual and automatic open/close triggers

### 4. General Styling Improvements
Improve the overall styling of the chatbot:
- Make the chat visually appealing and modern
- Ensure good spacing, colors, and typography
- Make the chat interface responsive and accessible

### Bonus: Code Quality
There are intentional bad practices and code smells throughout the codebase. Fixing these is a bonus task, but the main focus should be on the features above. If you have time, feel free to:
- Refactor for better code quality
- Improve type safety, state management, and component organization
- Remove anti-patterns and improve maintainability

## Getting Started
1. Clone this repository
2. Install dependencies: `npm install`
3. Start development server: `npm start`
4. Review the code in:
   - `src/services/chat.ts`
   - `src/components/Chat/ChatWindow.tsx`

## Requirements
- Use TypeScript effectively
- Follow React best practices
- Ensure accessibility
- Write clean, maintainable code
- Add proper documentation
- Include tests for critical functionality


## Submission
1. Fork this repository
2. Make your improvements
3. Submit a pull request
4. Include in your PR description:
   - List of issues you found and fixed
   - Explanation of your improvements
   - Any trade-offs you made
   - Future improvement suggestions

## Time Expectation
- Expected time: 3-4 hours
- Maximum time: 4 hours

## Notes
- The chat service includes a quiz system that can be triggered by typing 'start quiz'
- Quiz questions are provided through the chat service
- Focus on making the quiz experience seamless within the chat interface
- Think about error handling and edge cases
- Consider accessibility for both chat and quiz interactions
- There are intentional bad practices in the codebase; fixing them is a bonus 