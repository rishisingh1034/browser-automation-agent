import 'dotenv/config';
import { Agent, run, tool } from '@openai/agents';
import { z } from 'zod';
import { BrowserManager } from './browser-manager.js';
import readline from 'readline';

export class AutomationAgent {
  private browserManager: BrowserManager;
  private agent: Agent;
  private rl: readline.Interface;

  constructor() {
    this.browserManager = new BrowserManager();
    this.rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    const takeScreenshot = tool({
      name: 'take_screenshot',
      description: 'Takes a screenshot of the current page and returns a compressed base64 image',
      parameters: z.object({}),
      execute: async () => {
        const screenshot = await this.browserManager.takeScreenshot();
        return 'Screenshot taken successfully. Page is visible and ready for interaction.';
      }
    });

    const navigateToUrl = tool({
      name: 'navigate_to_url',
      description: 'Navigates to a specific URL',
      parameters: z.object({
        url: z.string().describe('The URL to navigate to')
      }),
      execute: async (input) => {
        await this.browserManager.navigateToUrl(input.url);
        return `Navigated to ${input.url}`;
      }
    });

    const clickElement = tool({
      name: 'click_element',
      description: 'Clicks on an element using CSS selector',
      parameters: z.object({
        selector: z.string().describe('CSS selector of the element to click')
      }),
      execute: async (input) => {
        await this.browserManager.clickElement(input.selector);
        return `Clicked element with selector: ${input.selector}`;
      }
    });

    const clickCoordinates = tool({
      name: 'click_coordinates',
      description: 'Clicks on specific coordinates on the screen',
      parameters: z.object({
        x: z.number().describe('X coordinate'),
        y: z.number().describe('Y coordinate')
      }),
      execute: async (input) => {
        await this.browserManager.clickCoordinates(input.x, input.y);
        return `Clicked at coordinates (${input.x}, ${input.y})`;
      }
    });

    const typeText = tool({
      name: 'type_text',
      description: 'Types text into an input field',
      parameters: z.object({
        selector: z.string().describe('CSS selector of the input field'),
        text: z.string().describe('Text to type')
      }),
      execute: async (input) => {
        await this.browserManager.typeText(input.selector, input.text);
        return `Typed "${input.text}" into ${input.selector}`;
      }
    });

    const getFormFields = tool({
      name: 'get_form_fields',
      description: 'Gets all form fields on the current page',
      parameters: z.object({}),
      execute: async () => {
        const fields = await this.browserManager.getFormFields();
        return JSON.stringify(fields, null, 2);
      }
    });

    const askUserForInput = tool({
      name: 'ask_user_for_input',
      description: 'Asks the user for input via CLI and waits for response',
      parameters: z.object({
        prompt: z.string().describe('The prompt to show to the user'),
        fieldName: z.string().describe('Name of the field being requested')
      }),
      execute: async (input) => {
        console.log(`\n📝 ${input.prompt}`);
        return new Promise<string>((resolve) => {
          const askQuestion = () => {
            this.rl.question('> ', (answer: string) => {
              const trimmedAnswer = answer.trim();
              if (trimmedAnswer) {
                console.log(`✅ Received: ${trimmedAnswer}`);
                resolve(trimmedAnswer);
              } else {
                console.log('⚠️  Please enter a valid response.');
                askQuestion();
              }
            });
          };
          askQuestion();
        });
      }
    });

    const openTwitter = tool({
      name: 'open_twitter',
      description: 'Opens Twitter/X.com in the browser',
      parameters: z.object({}),
      execute: async () => {
        await this.browserManager.navigateToUrl('https://x.com');
        return 'Navigated to Twitter/X.com';
      }
    });

    const postTweet = tool({
      name: 'post_tweet',
      description: 'Posts a tweet by finding the compose button and text area',
      parameters: z.object({
        content: z.string().describe('The content of the tweet to post')
      }),
      execute: async (input) => {
        try {
          const composeSelectors = [
            '[data-testid="SideNav_NewTweet_Button"]',
            '[aria-label="Tweet"]',
            '[data-testid="tweetButtonInline"]',
            'a[href="/compose/tweet"]',
            '[role="button"][aria-label="Tweet"]'
          ];

          let clicked = false;
          for (const selector of composeSelectors) {
            try {
              await this.browserManager.clickElement(selector);
              clicked = true;
              break;
            } catch (e) {
              // Next error steps
            }
          }

          if (!clicked) {
            return 'Could not find tweet compose button. Please make sure you are logged in to Twitter.';
          }

          await new Promise(resolve => setTimeout(resolve, 1000));

          const textAreaSelectors = [
            '[data-testid="tweetTextarea_0"]',
            '[role="textbox"][aria-label*="Tweet"]',
            '[role="textbox"][placeholder*="What"]',
            '.public-DraftEditor-content',
            '[contenteditable="true"][role="textbox"]'
          ];

          let typed = false;
          for (const selector of textAreaSelectors) {
            try {
              await this.browserManager.typeText(selector, input.content);
              typed = true;
              break;
            } catch (e) {
              // Next error steps
            }
          }

          if (!typed) {
            return 'Could not find tweet text area. Please try manually.';
          }

          return `Tweet content "${input.content}" has been entered. You can now click the Tweet button to post.`;
        } catch (error) {
          return `Error posting tweet: ${error instanceof Error ? error.message : String(error)}`;
        }
      }
    });

    const clickTweetButton = tool({
      name: 'click_tweet_button',
      description: 'Clicks the final Tweet button to post the tweet',
      parameters: z.object({}),
      execute: async () => {
        try {
          const tweetButtonSelectors = [
            '[data-testid="tweetButtonInline"]',
            '[data-testid="tweetButton"]',
            '[role="button"][aria-label="Tweet"]',
            'button[data-testid="tweetButtonInline"]'
          ];

          for (const selector of tweetButtonSelectors) {
            try {
              await this.browserManager.clickElement(selector);
              return 'Tweet posted successfully!';
            } catch (e) {
              // Next error steps
            }
          }

          return 'Could not find the Tweet button to post. Please click it manually.';
        } catch (error) {
          return `Error clicking tweet button: ${error instanceof Error ? error.message : String(error)}`;
        }
      }
    });

    this.agent = new Agent({
      name: 'Browser Automation Agent',
      model: 'gpt-4o-mini',
      tools: [
        takeScreenshot,
        navigateToUrl,
        clickElement,
        clickCoordinates,
        typeText,
        getFormFields,
        askUserForInput,
        openTwitter,
        postTweet,
        clickTweetButton
      ],
      instructions: `
        You are a browser automation agent that helps users fill out forms, perform web tasks, and post on social media.
        
        CRITICAL WORKFLOW FOR FORMS:
        1. Navigate to the requested URL
        2. Get form fields to understand what information is needed
        3. For EACH field, ask the user for input ONE AT A TIME
        4. IMMEDIATELY after getting user input, fill that specific field
        5. Move to the next field only after the previous one is filled
        6. After all fields are filled, submit the form
        
        For Twitter/social media tasks:
        1. Open Twitter using the open_twitter tool
        2. Ask user for tweet content using ask_user_for_input
        3. Use post_tweet tool with the content
        4. Use click_tweet_button to post
        
        IMPORTANT RULES:
        - Ask for ONE piece of information at a time
        - Fill the field IMMEDIATELY after getting the input
        - Wait for user response before proceeding
        - Use specific prompts like "Please enter your first name"
        - Always confirm before submitting forms
        - If a field fails to fill, try alternative selectors
      `
    });
  }

  async initialize(): Promise<void> {
    await this.browserManager.initialize();
  }

  async executeTask(task: string): Promise<void> {
    console.log(`\n🤖 Starting automation task: ${task}\n`);

    try {
      const result = await run(this.agent, [
        { role: 'user', content: task }
      ], {
        maxTurns: 25
      });

      console.log('\n✅ Task completed successfully!');
      console.log('Final response:', result.finalOutput);
    } catch (error) {
      if (error && typeof error === 'object' && 'name' in error && error.name === 'MaxTurnsExceededError') {
        console.error('❌ The task exceeded the maximum number of turns (25).');
        console.error('💡 This usually happens with very complex forms. Try breaking the task into smaller parts.');
        console.error('📝 You can also try submitting the form manually after the agent has filled the available fields.');
      } else {
        console.error('❌ Error executing task:', error);
      }
    }
  }

  async close(): Promise<void> {
    await this.browserManager.close();
    this.rl.close();
  }
}
