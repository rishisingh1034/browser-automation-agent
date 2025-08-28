import 'dotenv/config';
export declare class AutomationAgent {
    private browserManager;
    private agent;
    private rl;
    constructor();
    initialize(): Promise<void>;
    executeTask(task: string): Promise<void>;
    close(): Promise<void>;
}
//# sourceMappingURL=automation-agent.d.ts.map