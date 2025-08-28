# Basic Usage Examples

## CLI Usage

1. **Set up your environment:**

   ```bash
   # Copy and edit the environment file
   cp .env.example .env
   # Add your OpenAI API key to .env
   ```

2. **Run the agent:**

   ```bash
   npm run agent
   ```

3. **Example tasks you can try:**
   ```
   Fill the form at https://ui.chaicode.com/auth/signup
   Navigate to https://example.com and take a screenshot
   Go to https://google.com and search for "AI automation"
   ```

## API Usage

1. **Start the server:**

   ```bash
   npm run dev
   ```

2. **Create a task:**

   ```bash
   curl -X POST http://localhost:3000/tasks \
     -H "Content-Type: application/json" \
     -d '{
       "url": "https://ui.chaicode.com/auth/signup",
       "description": "fill the contact form with my details"
     }'
   ```

3. **Execute the task:**
   ```bash
   curl -X POST http://localhost:3000/tasks/1/execute
   ```

## How It Works

1. **Agent analyzes the page** - Takes screenshots and identifies form fields
2. **Asks for user input** - Prompts you for required information (name, email, etc.)
3. **Fills the form automatically** - Uses the provided information to complete the form
4. **Provides feedback** - Shows screenshots and confirms completion

## Supported Form Fields

- Text inputs (name, address, etc.)
- Email inputs
- Phone number inputs
- Textareas (messages, comments)
- Select dropdowns
- Checkboxes and radio buttons

## Tips

- Be specific in your task descriptions
- The agent works best with standard HTML forms
- You can interrupt the process with Ctrl+C
- Check the screenshots to verify the agent's actions
