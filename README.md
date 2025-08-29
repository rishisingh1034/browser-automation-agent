# 🤖 Browser Automation Agent

> **Watch the Demo**: [YouTube Video](https://youtu.be/6kzdiYDvqCQ)

A powerful AI-driven browser automation agent that intelligently fills out forms, interacts with web pages, posts on social media, and performs complex web tasks using natural language commands. Built with OpenAI's latest Agent SDK and Playwright for reliable browser automation.

## ✨ Key Features

### 🎯 **Intelligent Form Filling**

- Automatically detects form fields on any website
- Asks users for input one field at a time for accuracy
- Handles complex multi-step forms with validation
- Supports various input types (text, email, select, checkboxes)

### 🐦 **Social Media Automation**

- **Twitter/X Integration**: Post tweets with intelligent element detection
- Multiple selector fallbacks for reliability
- Handles dynamic content loading

### 🧠 **AI-Powered Interactions**

- Uses OpenAI's GPT-4 models for intelligent decision making
- Natural language command processing
- Context-aware element selection
- Smart error recovery and retry mechanisms

### 🛠️ **Advanced Browser Control**

- Screenshot capabilities for visual feedback
- Coordinate-based clicking for complex elements
- CSS selector and XPath support
- Realistic user agent simulation
- Chrome browser automation via Playwright

### 🔧 **Developer-Friendly**

- TypeScript for type safety and better development experience
- RESTful API for integration with other applications
- Comprehensive error handling and logging
- Configurable turn limits for complex tasks

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** - [Download here](https://nodejs.org/)
- **OpenAI API Key** - [Get one here](https://platform.openai.com/api-keys)

### 📦 Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/rishisingh1034/browser-automation-agent.git
   cd browser-automation-agent
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` file and add your OpenAI API key:

   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Build the project:**

   ```bash
   npm run build
   ```

5. **Install browser dependencies:**
   ```bash
   npx playwright install chromium
   ```

## 🎮 Usage

### 🖥️ CLI Mode (Recommended)

Start the interactive agent:

```bash
npm run agent
```

**Example Commands:**

- `"Fill out the contact form on https://example.com"`
- `"Post a tweet saying 'Hello from my automation agent!'"`
- `"Navigate to LinkedIn and take a screenshot"`

### 🌐 API Mode

Start the REST API server:

```bash
npm start
```

The API will be available at `http://localhost:3000`

**API Endpoints:**

- `POST /automate` - Execute automation tasks
- `GET /health` - Health check

**Example API Request:**

```bash
curl -X POST http://localhost:3000/automate \
  -H "Content-Type: application/json" \
  -d '{"task": "Fill out the form on https://example.com"}'
```

## 🎯 How It Works

### 1. **Form Filling Workflow**

```
1. Navigate to target URL
2. Analyze page structure and detect form fields
3. Ask user for input one field at a time
4. Fill each field immediately after receiving input
5. Confirm before submission
```

### 2. **Twitter Posting Workflow**

```
1. Open Twitter/X.com
2. Find and click compose button
3. Enter tweet content
4. Click tweet button to post
```

### 3. **Error Recovery**

- Multiple selector fallbacks for reliability
- Automatic retries for failed operations
- Intelligent wait conditions for dynamic content
- Graceful handling of rate limits and API errors

## 🛠️ Available Tools

The agent has access to these powerful tools:

| Tool                 | Description                   | Use Case                      |
| -------------------- | ----------------------------- | ----------------------------- |
| `take_screenshot`    | Captures page screenshots     | Visual feedback and debugging |
| `navigate_to_url`    | Navigate to any URL           | Opening websites              |
| `click_element`      | Click using CSS selectors     | Button clicks, links          |
| `click_coordinates`  | Click at specific coordinates | Complex UI elements           |
| `type_text`          | Type text into input fields   | Form filling                  |
| `get_form_fields`    | Analyze form structure        | Understanding page layout     |
| `ask_user_for_input` | Interactive user prompts      | Collecting user data          |
| `open_twitter`       | Quick Twitter navigation      | Social media tasks            |
| `post_tweet`         | Compose and post tweets       | Twitter automation            |
| `click_tweet_button` | Submit tweets                 | Finalizing posts              |

## ⚙️ Configuration

### Environment Variables

```env
# Required
OPENAI_API_KEY=your_openai_api_key_here

# Optional
PORT=3000
DEBUG=false
```

### Agent Settings

- **Model**: `gpt-4o-mini` (optimal performance/cost ratio)
- **Max Turns**: `25` (handles complex multi-step tasks)
- **Browser**: Chromium with realistic user agent
- **Timeout**: `30 seconds` for page loads
- **Screenshots**: Optimized for context window efficiency

## 🔧 Development

### Development Mode

```bash
npm run dev
```

### Debug Mode

```bash
DEBUG=* npm run agent
```

### Build for Production

```bash
npm run build
npm start
```

## 🚨 Troubleshooting

### Common Issues

| Error                   | Cause                        | Solution                     |
| ----------------------- | ---------------------------- | ---------------------------- |
| `MaxTurnsExceededError` | Task too complex (>25 steps) | Break into smaller tasks     |
| `Element not found`     | Page still loading           | Agent retries automatically  |
| `OpenAI API Error`      | Invalid/expired API key      | Check API key and credits    |
| `Browser launch failed` | Missing Playwright browsers  | Run `npx playwright install` |

### Performance Tips

- Use specific CSS selectors when possible
- Break complex forms into smaller sections
- Ensure stable internet connection for API calls
- Monitor OpenAI API usage and rate limits

## 📈 Recent Updates

### v1.0.0 (Latest)

- ✅ **Fixed MaxTurnsExceededError**: Increased turn limit to 25
- ✅ **Enhanced Twitter Integration**: Multiple selector fallbacks
- ✅ **Improved Error Handling**: Better user guidance
- ✅ **TypeScript Support**: Full type safety
- ✅ **Optimized Screenshots**: Context window friendly

## 🤝 Contributing

We welcome contributions! Here's how to get started:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Add tests for new features
- Update documentation
- Ensure backward compatibility

## 📄 License

ISC License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [OpenAI](https://openai.com/) for the powerful Agent SDK
- [Playwright](https://playwright.dev/) for reliable browser automation
- [TypeScript](https://www.typescriptlang.org/) for type safety

---

**⭐ If this project helped you, please give it a star on GitHub!**
