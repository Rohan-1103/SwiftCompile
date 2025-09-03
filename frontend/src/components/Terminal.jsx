
import { useState } from 'react';
import { X } from 'lucide-react';

const Terminal = ({ output }) => {
    const [activeTab, setActiveTab] = useState('output');
    const [stdin, setStdin] = useState('');

    const TabButton = ({ id, label }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`px-4 py-2 text-sm font-medium ${activeTab === id ? 'bg-gray-200 dark:bg-gray-700' : 'hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
            {label}
        </button>
    );

    return (
        <div className="h-full flex flex-col bg-white dark:bg-gray-900">
            <div className="flex items-center border-b border-gray-200 dark:border-gray-700">
                <TabButton id="output" label="Output" />
                <TabButton id="input" label="Input (stdin)" />
                <TabButton id="problems" label="Problems" />
            </div>
            <div className="flex-grow p-2 overflow-auto font-mono text-sm">
                {activeTab === 'output' && (
                    <pre className="whitespace-pre-wrap">{output || "<Execution output will appear here>"}</pre>
                )}
                {activeTab === 'input' && (
                    <textarea
                        className="w-full h-full bg-transparent resize-none focus:outline-none"
                        placeholder="Enter stdin for your program..."
                        value={stdin}
                        onChange={(e) => setStdin(e.target.value)}
                    />
                )}
                {activeTab === 'problems' && (
                    <div className="text-gray-500">
                        No problems detected.
                    </div>
                )}
            </div>
        </div>
    );
};

export default Terminal;
