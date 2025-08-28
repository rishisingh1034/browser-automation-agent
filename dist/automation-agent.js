import 'dotenv/config';
import { Agent, run, tool } from '@openai/agents';
import { z } from 'zod';
import { BrowserManager } from './browser-manager.js';
import readline from 'readline';
export class AutomationAgent {
    browserManager;
    agent;
    rl;
    constructor() {
        this.browserManager = new BrowserManager();
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        // Define tools for the agent
        const takeScreenshot = tool({
            name: 'take_screenshot',
            description: 'Takes a screenshot of the current page and returns a compressed base64 image',
            parameters: z.object({}),
            execute: async () => {
                const screenshot = await this.browserManager.takeScreenshot();
                // Return a summary instead of full image to avoid context window issues
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
                return new Promise((resolve) => {
                    const askQuestion = () => {
                        this.rl.question('> ', (answer) => {
                            const trimmedAnswer = answer.trim();
                            if (trimmedAnswer) {
                                console.log(`✅ Received: ${trimmedAnswer}`);
                                resolve(trimmedAnswer);
                            }
                            else {
                                console.log('⚠️  Please enter a valid response.');
                                askQuestion(); // Ask again if empty
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
                    // Try different selectors for the tweet compose button
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
                        }
                        catch (e) {
                            // Try next selector
                        }
                    }
                    if (!clicked) {
                        return 'Could not find tweet compose button. Please make sure you are logged in to Twitter.';
                    }
                    // Wait a moment for the compose dialog to open
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    // Try different selectors for the tweet text area
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
                        }
                        catch (e) {
                            // Try next selector
                        }
                    }
                    if (!typed) {
                        return 'Could not find tweet text area. Please try manually.';
                    }
                    return `Tweet content "${input.content}" has been entered. You can now click the Tweet button to post.`;
                }
                catch (error) {
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
                        }
                        catch (e) {
                            // Try next selector
                        }
                    }
                    return 'Could not find the Tweet button to post. Please click it manually.';
                }
                catch (error) {
                    return `Error clicking tweet button: ${error instanceof Error ? error.message : String(error)}`;
                }
            }
        });
        const submitForm = tool({
            name: 'submit_form',
            description: 'Submits a form by finding and clicking the submit button',
            parameters: z.object({}),
            execute: async () => {
                try {
                    const submitSelectors = [
                        'button[type="submit"]',
                        'input[type="submit"]',
                        'button:contains("Submit")',
                        'button:contains("Sign Up")',
                        'button:contains("Register")',
                        'button:contains("Create Account")',
                        '.submit-btn',
                        '.btn-submit',
                        '#submit'
                    ];
                    for (const selector of submitSelectors) {
                        try {
                            await this.browserManager.clickElement(selector);
                            return 'Form submitted successfully!';
                        }
                        catch (e) {
                            // Try next selector
                        }
                    }
                    return 'Could not find submit button. Form may need manual submission.';
                }
                catch (error) {
                    return `Error submitting form: ${error instanceof Error ? error.message : String(error)}`;
                }
            }
        });
        // Create the automation agent
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
                clickTweetButton,
                submitForm
            ],
            instructions: `
        You are a browser automation agent. Be EFFICIENT and complete tasks in minimal turns.
        
        FORM FILLING WORKFLOW:
        1. Navigate to URL
        2. Get form fields (use get_form_fields tool)
        3. For each required field:
           - Ask user for input with ask_user_for_input
           - Immediately fill field with type_text
           - Move to next field
        4. After ALL fields filled, ask user to confirm submission
        5. If confirmed, submit the form
        6. STOP - say "Form completed successfully"
        
        TWITTER WORKFLOW:
        1. Use open_twitter tool
        2. Ask user for tweet content
        3. Use post_tweet tool
        4. Use click_tweet_button
        5. STOP - say "Tweet posted successfully"
        
        EFFICIENCY RULES:
        - Complete task in under 20 turns
        - Don't take unnecessary screenshots
        - Don't repeat actions
        - Stop when task is complete
        - If field filling fails, try once more then move on
        - Be concise in responses
      `
        });
    }
    async initialize() {
        await this.browserManager.initialize();
    }
    async executeTask(task) {
        console.log(`\n🤖 Starting automation task: ${task}\n`);
        try {
            const result = await run(this.agent, [
                { role: 'user', content: task }
            ], {
                maxTurns: 25 // Increase max turns for complex form filling
            });
            console.log('\n✅ Task completed successfully!');
            console.log('Final response:', result.finalOutput);
        }
        catch (error) {
            if (error?.name === 'MaxTurnsExceededError') {
                console.log('\n⚠️  Task reached maximum turns limit. The form may have been partially filled.');
                console.log('💡 You can check the browser to see what was completed and manually finish if needed.');
            }
            else {
                console.error('❌ Error executing task:', error);
            }
        }
    }
    async close() {
        await this.browserManager.close();
        this.rl.close();
    }
}
//# sourceMappingURL=automation-agent.js.map