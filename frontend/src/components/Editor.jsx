
import { useRef } from 'react';
import MonacoEditor from "@monaco-editor/react";
import { useTheme } from '../hooks/useTheme'; // Assuming you have a theme hook

const Editor = ({ file, content, onChange }) => {
    const { theme } = useTheme();
    const editorRef = useRef(null);

    const handleEditorDidMount = (editor) => {
        editorRef.current = editor;
        // You can add custom keybindings here if needed
    };

    if (!file) {
        return (
            <div className="flex items-center justify-center h-full bg-white dark:bg-gray-900 text-gray-500">
                <p>Select a file to start editing</p>
            </div>
        );
    }

    return (
        <MonacoEditor
            height="100%"
            language={getLanguageFromFile(file.name)} // Simple utility to get language from extension
            value={content}
            onChange={onChange}
            onMount={handleEditorDidMount}
            theme={theme === 'dark' ? 'vs-dark' : 'light'}
            options={{
                minimap: { enabled: true },
                lineNumbers: 'on',
                glyphMargin: true,
                folding: true,
                lineDecorationsWidth: 15,
                lineNumbersMinChars: 5,
                wordWrap: 'on',
                scrollBeyondLastLine: false,
                automaticLayout: true,
            }}
        />
    );
};

function getLanguageFromFile(filename) {
    if (!filename) {
        return 'plaintext'; // Default language if filename is not provided
    }
    const extension = filename.split('.').pop();
    switch (extension) {
        case 'js':
        case 'jsx':
            return 'javascript';
        case 'ts':
        case 'tsx':
            return 'typescript';
        case 'py':
            return 'python';
        case 'html':
            return 'html';
        case 'css':
            return 'css';
        case 'json':
            return 'json';
        case 'md':
            return 'markdown';
        default:
            return 'plaintext';
    }
}

export default Editor;
