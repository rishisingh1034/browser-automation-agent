import { chromium } from 'playwright';
export class BrowserManager {
    browser = null;
    page = null;
    async initialize() {
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
    async navigateToUrl(url) {
        if (!this.page) {
            throw new Error('Browser not initialized');
        }
        await this.page.goto(url);
    }
    async takeScreenshot() {
        if (!this.page) {
            throw new Error('Browser not initialized');
        }
        const screenshot = await this.page.screenshot();
        return screenshot.toString('base64');
    }
    async clickElement(selector) {
        if (!this.page) {
            throw new Error('Browser not initialized');
        }
        // Wait for element to be visible and clickable
        await this.page.waitForSelector(selector, { timeout: 10000 });
        await this.page.click(selector);
    }
    async clickCoordinates(x, y) {
        if (!this.page) {
            throw new Error('Browser not initialized');
        }
        await this.page.mouse.click(x, y);
    }
    async typeText(selector, text) {
        if (!this.page) {
            throw new Error('Browser not initialized');
        }
        try {
            // Wait for the element to be available
            await this.page.waitForSelector(selector, { timeout: 10000 });
            // Focus on the element
            await this.page.focus(selector);
            // Clear the field first
            await this.page.keyboard.press('Control+a');
            await this.page.keyboard.press('Delete');
            // Type the text
            await this.page.keyboard.type(text, { delay: 50 });
            // Verify the text was entered
            const value = await this.page.inputValue(selector).catch(() => this.page?.textContent(selector) || '');
            console.log(`✅ Successfully typed "${text}" into field (current value: "${value || 'unknown'}")`);
        }
        catch (error) {
            console.error(`❌ Failed to type into selector "${selector}":`, error instanceof Error ? error.message : String(error));
            throw error;
        }
    }
    async selectOption(selector, value) {
        if (!this.page) {
            throw new Error('Browser not initialized');
        }
        await this.page.selectOption(selector, value);
    }
    async submitForm(selector) {
        if (!this.page) {
            throw new Error('Browser not initialized');
        }
        await this.page.click(selector);
    }
    async getFormFields() {
        if (!this.page) {
            throw new Error('Browser not initialized');
        }
        return await this.page.evaluate(() => {
            const inputs = Array.from(document.querySelectorAll('input, textarea, select'));
            return inputs.map(input => {
                const element = input;
                return {
                    tagName: element.tagName.toLowerCase(),
                    type: element.type || 'text',
                    name: element.name || '',
                    id: element.id || '',
                    placeholder: element.placeholder || '',
                    required: element.required || false,
                    label: element.labels?.[0]?.textContent || ''
                };
            });
        });
    }
    async close() {
        if (this.browser) {
            await this.browser.close();
        }
    }
    getPage() {
        return this.page;
    }
}
//# sourceMappingURL=browser-manager.js.map