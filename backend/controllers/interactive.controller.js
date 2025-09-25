const Docker = require('dockerode');
const fs = require('fs');
const path = require('path');
const os = require('os');

const docker = new Docker();

const convertPathForDocker = (windowsPath) => {
    if (os.platform() === 'win32') {
        return '/' + windowsPath.replace(/\\/g, '/').replace(/:/, '').toLowerCase();
    }
    return windowsPath;
};

const languageConfigs = {
    'python': {
        image: 'python:3.9-slim',
        command: (filePath) => ['/bin/bash', '-c', `stty echo && python -u ${filePath}`], // -u for unbuffered output
        extension: '.py'
    },
    'c': {
        image: 'gcc',
        command: (filePath) => ['/bin/bash', '-c', `stty echo && gcc ${filePath} -o /tmp/out && /tmp/out`],
        extension: '.c'
    },
    'java': {
        image: 'openjdk',
        command: (filePath) => ['/bin/bash', '-c', `stty echo && java ${filePath}`],
        extension: '.java'
    }
};

const handleInteractiveExecution = (ws) => {
    let container = null;
    let tempDir = null;
    let stream = null;
    const stdinQueue = []; // Queue for early stdin

    // Function to process queued stdin messages
    const processStdinQueue = () => {
        if (stream && stdinQueue.length > 0) {
            stdinQueue.forEach(data => stream.write(data));
            stdinQueue.length = 0; // Clear the queue
        }
    };

    ws.on('message', async (message) => {
        const msg = JSON.parse(message.toString());

        if (msg.type === 'execute') {
            const { language, code } = msg;

            if (!languageConfigs[language]) {
                ws.send(JSON.stringify({ type: 'stderr', data: 'Unsupported language' }));
                return;
            }

            const { image, command, extension } = languageConfigs[language];
            try {
                tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'code-'));
            } catch (error) {
                ws.send(JSON.stringify({ type: 'stderr', data: `Failed to create temp directory: ${error.message}` }));
                return;
            }
            
            const tempFilePath = path.join(tempDir, `code${extension}`);
            fs.writeFileSync(tempFilePath, code);

            const dockerTempDir = convertPathForDocker(tempDir);
            const containerTempFilePath = path.join(dockerTempDir, `code${extension}`).replace(/\\/g, '/');

            try {
                await docker.ping();
            } catch (error) {
                ws.send(JSON.stringify({ type: 'stderr', data: 'Docker is not running.' }));
                return;
            }

            try {
                container = await docker.createContainer({
                    Image: image,
                    Cmd: command(containerTempFilePath),
                    HostConfig: {
                        Binds: [`${tempDir}:${dockerTempDir}`], // Corrected binding
                    },
                    Tty: true,
                    AttachStdin: true,
                    AttachStdout: true,
                    AttachStderr: true,
                    OpenStdin: true,
                    StdinOnce: false
                });

                stream = await container.attach({ stream: true, stdin: true, stdout: true, stderr: true });
                
                processStdinQueue(); // Process any queued input now that the stream is ready

                stream.on('data', (chunk) => {
                    ws.send(JSON.stringify({ type: 'stdout', data: chunk.toString('utf8') }));
                });

                stream.on('end', () => {
                    ws.send(JSON.stringify({ type: 'stdout', data: '\r\nProcess finished.' }));
                    // Cleanup is handled in ws.on('close')
                });

                await container.start();

            } catch (error) {
                ws.send(JSON.stringify({ type: 'stderr', data: error.message }));
                // Cleanup is handled in ws.on('close')
            }
        } else if (msg.type === 'stdin') {
            if (stream) {
                stream.write(msg.data);
            } else {
                stdinQueue.push(msg.data); // Queue if stream is not ready yet
            }
        }
    });

    ws.on('close', async () => {
        console.log('Client disconnected');
        if (container) {
            try {
                await container.stop();
                await container.remove({ force: true });
            } catch (error) {
                // console.error('Error cleaning up container:', error);
            }
        }
        if (tempDir && fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    });
};

module.exports = { handleInteractiveExecution };
