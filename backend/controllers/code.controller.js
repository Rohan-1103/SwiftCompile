
const Docker = require('dockerode');
const fs = require('fs');
const path = require('path');
const os = require('os');

const docker = new Docker();

const languageConfigs = {
    'python': {
        image: 'python:3.9-slim',
        command: (filePath) => ['python', filePath],
        extension: '.py'
    },
    'c': {
        image: 'gcc',
        command: (filePath) => ['sh', '-c', `gcc ${filePath} -o /tmp/out && /tmp/out`],
        extension: '.c'
    },
    'java': {
        image: 'openjdk',
        command: (filePath) => ['java', filePath],
        extension: '.java'
    }
};

const executeCode = async (req, res) => {
    const { language, code } = req.body;

    if (!languageConfigs[language]) {
        return res.status(400).json({ success: false, stderr: 'Unsupported language' });
    }

    const { image, command, extension } = languageConfigs[language];
    const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'code-'));

    const tempFilePath = path.join(tempDir, `code${extension}`);
    fs.writeFileSync(tempFilePath, code);

    let stdout = '';
    let stderr = '';
    let container;

    try {
            await docker.ping();
        } catch (error) {
            return res.status(500).json({ success: false, stderr: 'Docker is not running.' });
        }

        container = await docker.createContainer({
            Image: image,
            Cmd: command(tempFilePath),
            HostConfig: {
                Binds: [`${tempDir}:${tempDir}`],
                Memory: 256 * 1024 * 1024, // 256MB
                CpuShares: 512, // Relative weight
                NetworkMode: 'none'
            },
            Tty: false,
            AttachStdout: true,
            AttachStderr: true,
        });

        const stream = await container.attach({ stream: true, stdout: true, stderr: true });

        const stdoutPromise = new Promise((resolve) => {
            stream.on('data', (chunk) => {
                // The stream multiplexes stdout and stderr. We need to demultiplex it.
                // The first 8 bytes of each chunk is a header.
                // The first byte of the header indicates the stream type (1 for stdout, 2 for stderr).
                const streamType = chunk[0];
                const payload = chunk.slice(8).toString();
                if (streamType === 1) {
                    stdout += payload;
                } else {
                    stderr += payload;
                }
            });
            stream.on('end', resolve);
        });

        await container.start();

        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error('Execution timed out'));
            }, 15000); // 15 seconds
        });

        await Promise.race([
            container.wait(),
            timeoutPromise
        ]);

        await stdoutPromise;

        res.json({ success: true, stdout, stderr });

    } catch (error) {
        if (error.message === 'Execution timed out' && container) {
            try {
                await container.stop();
            } catch (stopError) {
                // Ignore error if container is already stopped
            }
            stderr = 'Execution timed out after 15 seconds.';
        } else {
            stderr = error.message;
        }
        res.json({ success: false, stdout, stderr });
    } finally {
        if (container) {
            try {
                await container.remove({ force: true });
            } catch (removeError) {
                // Ignore error if container is already removed
            }
        }
        if (fs.existsSync(tempDir)) {
            fs.rmSync(tempDir, { recursive: true, force: true });
        }
    }
};

module.exports = { executeCode };
