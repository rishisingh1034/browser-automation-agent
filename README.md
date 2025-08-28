# Browser Automation Agent

A powerful AI-driven browser automation agent that can fill out forms, interact with web pages, post on social media, and perform various web tasks using natural language commands.

## Features

- 🤖 AI-powered web automation using OpenAI's GPT models
- 🌐 Form filling and web interaction
- 🐦 **NEW**: Twitter/X posting functionality
- 📸 Optimized screenshot handling (context window friendly)
- 🎯 Element detection and interaction
- 🔧 RESTful API for integration
- 💻 Improved command-line interface
- 🌍 Chrome browser support with realistic user agent prompts
- 📸 Screenshot capabilities for visual feedback
- 🔧 TypeScript for type safety
- 🎭 Playwright for browser automation

## Prerequisites

- Node.js 18+ 
- OpenAI API key

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   # Edit .env and add your OpenAI API key
   ```

3. **Build the project:**
   ```bash
   npm run build
   ```

## Usage

### CLI Mode (Recommended)

Run the agent directly from the command line:

```bash
npm run agent
```

Example usage:
```
# Form filling
Enter your automation task: Fill the form at https://example.com

# Twitter posting
Enter your automation task: Post a tweet saying "Hello from my automation agent!"

# General web tasks
Enter your automation task: Navigate to https://github.com and search for "browser automation"
```

The agent will:
1. Navigate to the specified URL
2. Analyze the form fields or page elements
3. Ask you for required information (name, email, phone, tweet content, etc.)
4. Fill out forms or perform actions automatically
5. Provide confirmation of completed tasks

### API Server Mode

Start the Express server:

```bash
npm run dev
```

The server will run on `http://localhost:3000`

#### API Endpoints

- `GET /` - API documentation
- `POST /tasks` - Create a new automation task
- `GET /tasks` - Get all tasks
- `GET /tasks/:id` - Get a specific task
- `POST /tasks/:id/execute` - Execute a task

#### Example API Usage

Create a task:
```bash
curl -X POST http://localhost:3000/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com/contact",
    "description": "fill the contact form"
  }'
```

Execute a task:
```bash
curl -X POST http://localhost:3000/tasks/1/execute
```

## How It Works

The agent uses OpenAI's function calling capabilities combined with Playwright browser automation:

1. **Navigation**: Opens the target URL in a browser
2. **Analysis**: Takes screenshots and analyzes the page structure
3. **Form Detection**: Identifies form fields and their requirements
4. **User Interaction**: Prompts you for the necessary information
5. **Automation**: Fills out the form automatically
6. **Verification**: Takes final screenshots to confirm completion

## Agent Tools

The AI agent has access to these tools:

- `take_screenshot` - Captures the current page state (optimized for context window)
- `navigate_to_url` - Navigates to a specific URL
- `click_element` - Clicks on elements using CSS selectors (with wait conditions)
- `click_coordinates` - Clicks on specific screen coordinates
- `type_text` - Types text into input fields (improved clearing and typing)
- `get_form_fields` - Analyzes form fields on the page
- `ask_user_for_input` - Prompts user for information via CLI
- `open_twitter` - **NEW**: Opens Twitter/X.com
- `post_tweet` - **NEW**: Composes and enters tweet content
- `click_tweet_button` - **NEW**: Posts the tweet

## Example Tasks

### Form Filling
- "Fill the contact form at https://example.com"
- "Submit a job application at https://company.com/careers"
- "Register an account at https://website.com/signup"
- "Fill out the survey at https://forms.google.com/..."

### Social Media
- "Post a tweet saying 'Hello from my automation agent!'"
- "Tweet about my latest project"
- "Share a motivational quote on Twitter"

### General Web Tasks
- "Navigate to GitHub and search for browser automation"
- "Go to Amazon and search for laptops"
- "Open YouTube and search for coding tutorials"

## Configuration

### Environment Variables

- `OPENAI_API_KEY` - Your OpenAI API key (required)
- `PORT` - Server port (default: 3000)

### Browser Settings

The browser runs in non-headless mode by default so you can see the automation in action. To run headless, modify the `BrowserManager` class.

## Recent Fixes & Improvements

### ✅ Fixed Issues
- **Context Window Error (400)**: Optimized screenshot handling to prevent OpenAI API context window overflow
- **Duplicate Text Input**: Fixed readline interface configuration to prevent text echoing
- **Browser Compatibility**: Enhanced Chrome support with proper user agent and launch arguments

### 🆕 New Features
- **Twitter Integration**: Full Twitter/X posting functionality with multiple selector fallbacks
- **Improved Element Detection**: Enhanced click and type operations with wait conditions
- **Better Error Handling**: More robust error messages and fallback mechanisms

## Troubleshooting

1. **OpenAI API Key**: Make sure your API key is valid and has sufficient credits
2. **Browser Issues**: Ensure you have the latest version of Playwright browsers installed
3. **Form Detection**: Some complex forms may require manual selector specification
4. **Context Window Errors**: Screenshots are now optimized to prevent API limits
5. **Twitter Login**: Make sure you're logged into Twitter/X before attempting to post tweets

## Security Notes

- Never hardcode API keys in your code
- Be cautious when automating sensitive forms
- Always verify the target website's terms of service
- Use responsibly and respect rate limits

## Contributing

Feel free to submit issues and enhancement requests!
