import * as fs from 'fs';
import * as dotenv from 'dotenv';
import * as path from 'path';

// Load environment variables from .env file
dotenv.config();



let currentLogLevel: number = parseInt(process.env.LOG_LEVEL || '0');


// Function to write log based on the log level
export function log(message: string, level:number,type:string) {
    if (currentLogLevel >= level) {
        const logFilePath = process.env.LOG_FILE || 'project.log'; // Default to 'app.log' if not set
        const logMessage = `[${type}] ${new Date().toISOString()} - ${message}\n`;

        // Ensure directory exists before writing the log
        const directory = path.dirname(logFilePath);
        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }

        fs.appendFileSync(logFilePath, logMessage, 'utf8');

    }
}

export function emptyLogFile() {
    const logFilePath = process.env.LOG_FILE || 'project.log'; // Default log file path

    try {
        // Write an empty string to the log file
        fs.writeFileSync(logFilePath, '', 'utf8');
        // console.log(`Log file '${logFilePath}' has been emptied.`);
    } catch (error) {
        console.error(`Error emptying the log file`);
    }
}

// Example usage of dynamic logging