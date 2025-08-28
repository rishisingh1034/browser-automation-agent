import { Page } from 'playwright';
export declare class BrowserManager {
    private browser;
    private page;
    initialize(): Promise<void>;
    navigateToUrl(url: string): Promise<void>;
    takeScreenshot(): Promise<string>;
    clickElement(selector: string): Promise<void>;
    clickCoordinates(x: number, y: number): Promise<void>;
    typeText(selector: string, text: string): Promise<void>;
    selectOption(selector: string, value: string): Promise<void>;
    submitForm(selector: string): Promise<void>;
    getFormFields(): Promise<any[]>;
    close(): Promise<void>;
    getPage(): Page | null;
}
//# sourceMappingURL=browser-manager.d.ts.map