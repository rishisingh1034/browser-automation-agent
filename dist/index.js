import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { AutomationAgent } from './automation-agent.js';
const app = express();
const port = process.env.PORT || 3000;
// Middleware
app.use(cors());
app.use(express.json());
// In-memory storage for tasks (in production, use a database)
const tasks = new Map();
// Routes
app.get('/', (req, res) => {
    res.json({
        message: 'Browser Automation Agent API',
        version: '1.0.0',
        endpoints: {
            'POST /tasks': 'Create a new automation task',
            'GET /tasks': 'Get all tasks',
            'GET /tasks/:id': 'Get a specific task',
            'POST /tasks/:id/execute': 'Execute a task'
        }
    });
});
app.post('/tasks', (req, res) => {
    const { url, description } = req.body;
    if (!url || !description) {
        return res.status(400).json({
            error: 'URL and description are required'
        });
    }
    const task = {
        id: Date.now().toString(),
        url,
        description,
        fields: [],
        status: 'pending',
        createdAt: new Date()
    };
    tasks.set(task.id, task);
    res.status(201).json(task);
});
app.get('/tasks', (req, res) => {
    const allTasks = Array.from(tasks.values());
    res.json(allTasks);
});
app.get('/tasks/:id', (req, res) => {
    const task = tasks.get(req.params.id);
    if (!task) {
        return res.status(404).json({
            error: 'Task not found'
        });
    }
    res.json(task);
});
app.post('/tasks/:id/execute', async (req, res) => {
    const task = tasks.get(req.params.id);
    if (!task) {
        return res.status(404).json({
            error: 'Task not found'
        });
    }
    if (task.status === 'in_progress') {
        return res.status(400).json({
            error: 'Task is already in progress'
        });
    }
    // Update task status
    task.status = 'in_progress';
    tasks.set(task.id, task);
    res.json({
        message: 'Task execution started',
        task
    });
    // Execute the task asynchronously
    try {
        const agent = new AutomationAgent();
        await agent.initialize();
        const taskDescription = `Navigate to ${task.url} and ${task.description}`;
        await agent.executeTask(taskDescription);
        task.status = 'completed';
        await agent.close();
    }
    catch (error) {
        console.error('Task execution failed:', error);
        task.status = 'failed';
    }
    tasks.set(task.id, task);
});
app.listen(port, () => {
    console.log(`🚀 Browser Automation Agent server running on port ${port}`);
    console.log(`📖 API documentation available at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map