import { chromium, Browser, Page } from 'playwright';

export class BrowserManager {
  private browser: Browser | null = null;
  private page: Page | null = null;

  async initialize(): Promise<void> {
    this.browser = await chromium.launch({
      headless: false,
      channel: 'chrome', // Use system Chrome
      args: [
        '--disable-extensions',
        '--disable-web-security',
        '--no-sandbox',
        '--disable-setuid-sandbox'
      ],
    });
    this.page = await this.browser.newPage();

    // Set a realistic user agent
    await this.page.setExtraHTTPHeaders({
      'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
  }

  async navigateToUrl(url: string): Promise<void> {
    if (!this.page) {
      throw new Error('Browser not initialized');
    }
    await this.page.goto(url);
  }

  async takeScreenshot(): Promise<string> {
    if (!this.page) {
      throw new Error('Browser not initialized');
    }
    const screenshot = await this.page.screenshot();
    return screenshot.toString('base64');
  }

  async clickElement(selector: string): Promise<void> {
    if (!this.page) {
      throw new Error('Browser not initialized');
    }

    // Wait for element to be visible and clickable
    await this.page.waitForSelector(selector, { timeout: 10000 });
    await this.page.click(selector);
  }

  async clickCoordinates(x: number, y: number): Promise<void> {
    if (!this.page) {
      throw new Error('Browser not initialized');
    }
    await this.page.mouse.click(x, y);
  }

  async typeText(selector: string, text: string): Promise<void> {
    if (!this.page) {
      throw new Error('Browser not initialized');
    }

    try {
      await this.page.waitForSelector(selector, { timeout: 10000 });
      await this.page.focus(selector);

      await this.page.keyboard.press('Control+a');
      await this.page.keyboard.press('Delete');

      await this.page.keyboard.type(text, { delay: 50 });

      const value = await this.page.inputValue(selector).catch(() =>
        this.page?.textContent(selector) || ''
      );

      console.log(`✅ Successfully typed "${text}" into field (current value: "${value || 'unknown'}")`);

    } catch (error) {
      console.error(`❌ Failed to type into selector "${selector}":`, error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  async selectOption(selector: string, value: string): Promise<void> {
    if (!this.page) {
      throw new Error('Browser not initialized');
    }
    await this.page.selectOption(selector, value);
  }

  async submitForm(selector: string): Promise<void> {
    if (!this.page) {
      throw new Error('Browser not initialized');
    }
    await this.page.click(selector);
  }

  async getFormFields(): Promise<any[]> {
    if (!this.page) {
      throw new Error('Browser not initialized');
    }

    return await this.page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input, textarea, select'));
      return inputs.map(input => {
        const element = input as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        return {
          tagName: element.tagName.toLowerCase(),
          type: element.type || 'text',
          name: element.name || '',
          id: element.id || '',
          placeholder: (element as HTMLInputElement).placeholder || '',
          required: element.required || false,
          label: element.labels?.[0]?.textContent || ''
        };
      });
    });
  }

  async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
    }
  }

  getPage(): Page | null {
    return this.page;
  }
}
