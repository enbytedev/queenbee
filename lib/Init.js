import fs from 'fs';
import path from 'path';

const workerPath = path.join(process.cwd(), "workerbees");

export default function initCommand(args) {
    if (args.length === 0) {
        console.log("No worker name provided. Please use 'queenbee init <bee name>' to initialize a new worker bee.");
        process.exit(0);
    }

    const beeInit = {
        "name": args[0],
        "description": "New worker bee from template.",
        "glyph": "🐝",
        "delay": 1000,
        "enableControls": true,
        "commands": ['echo "Hello, I am your new worker bee!"', 'echo \"These commands will be executed in order.\" > ./worker-bee.txt', 'cat ./worker-bee.txt', 'rm ./worker-bee.txt', '>&2 echo \"Logs to stderr will appear red!\"'],
        "logSettings": {
            "commands": true,
            "stdout": true,
            "stderr": true
        }
    }

    if (!fs.existsSync(workerPath)) {
        fs.mkdirSync(workerPath);
    }

    const beePath = path.join(workerPath, "bee_" + args[0] + ".json");
    if (!fs.existsSync(beePath)) {
        fs.writeFileSync(beePath, JSON.stringify(beeInit, null, 2));
        console.log("Worker bee initialized successfully.");
    } else {
        console.log("Worker bee already exists. Please use a different name.");
        process.exit(0);
    }
}