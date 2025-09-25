import { useEffect, useRef } from 'react';
import { Terminal as XTerm } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';

const Terminal = ({ runCounter, language, code }) => {
    const terminalRef = useRef(null);
    const term = useRef(null);
    const fitAddon = useRef(null);

    // Effect for terminal creation and setup
    useEffect(() => {
        if (!terminalRef.current) {
            return;
        }

        // Create a new terminal instance only if it doesn't exist
        if (!term.current) {
            term.current = new XTerm({ cursorBlink: true, convertEol: true });
            fitAddon.current = new FitAddon();
            term.current.loadAddon(fitAddon.current);
            term.current.open(terminalRef.current);
            fitAddon.current.fit();
            term.current.write('Click \'Run\' to execute your code.\r\n');
        }
    }, []); // Empty dependency array ensures this runs only once

    // Effect for handling code execution via WebSocket
    useEffect(() => {
        if (runCounter === 0) {
            return;
        }

        // Ensure terminal is initialized before proceeding
        if (!term.current) {
            return;
        }

        term.current.clear();
        term.current.write('Starting execution...\r\n');
        term.current.focus(); // Automatically focus the terminal

        const ws = new WebSocket('ws://localhost:3000');

        ws.onopen = () => {
            ws.send(JSON.stringify({ type: 'execute', language, code }));
        };

        ws.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (message.type === 'stdout' || message.type === 'stderr') {
                term.current.write(message.data);
            }
        };

        ws.onerror = (error) => {
            term.current.write(`\r\nWebSocket error: ${error.message}\r\n`);
        };

        ws.onclose = () => {
            term.current.write('\r\nConnection closed.\r\n');
        };

        const onDataDisposable = term.current.onData((data) => {
            // Implement local echo
            if (data === '\r') { // Enter key
                term.current.write('\r\n');
            } else if (data === '\x7F') { // Backspace
                // Prevent deleting past the prompt
                if (term.current.buffer.active.cursorX > 0) {
                    term.current.write('\b \b');
                }
            } else { // Printable characters
                term.current.write(data);
            }

            // Send data to the backend
            if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ type: 'stdin', data }));
            }
        });

        // Cleanup when runCounter changes, which signifies a new run
        return () => {
            onDataDisposable.dispose();
            if (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING) {
                ws.close();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [runCounter]); // Only depend on runCounter

    return <div ref={terminalRef} style={{ width: '100%', height: '100%' }} />;
};

export default Terminal;
