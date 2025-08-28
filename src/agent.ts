#!/usr/bin/env node
import 'dotenv/config';
import { AutomationAgent } from './automation-agent.js';
import readline from 'readline';

async function main() {
  console.log('🤖 Browser Automation Agent CLI');
  console.log('================================\n');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false
  });

  const agent = new AutomationAgent();
  
  try {
    await agent.initialize();
    console.log('✅ Browser initialized successfully!\n');

    // Get task from user
    console.log('Enter your automation task (e.g., "Fill the form at https://example.com"):');
    rl.question('> ', async (task) => {
      if (!task.trim()) {
        console.log('❌ Please provide a valid task');
        process.exit(1);
      }

      console.log(`\n🚀 Starting task: ${task}\n`);

      try {
        await agent.executeTask(task);
      } catch (error) {
        console.error('❌ Error:', error);
      } finally {
        await agent.close();
        rl.close();
        process.exit(0);
      }
    });

  } catch (error) {
    console.error('❌ Failed to initialize browser:', error);
    await agent.close();
    rl.close();
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n👋 Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n👋 Shutting down gracefully...');
  process.exit(0);
});

main().catch(console.error);
