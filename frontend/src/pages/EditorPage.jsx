
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { Play, Save, GitCommit, ChevronRight, Loader2 } from 'lucide-react';
import { Toaster, toast } from 'react-hot-toast';

// MANUALLY CREATED COMPONENTS, MAKE SURE TO CREATE THESE FILES
import FileExplorer from '../components/FileExplorer';
import Editor from '../components/Editor';
import Terminal from '../components/Terminal';

const EditorPage = () => {
    const { projectId } = useParams();
    const [project, setProject] = useState(null);
    const [activeFile, setActiveFile] = useState(null);
    const [fileContent, setFileContent] = useState('');
    const [isRunning, setIsRunning] = useState(false);
    const [output, setOutput] = useState('');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    // Mock project data fetching
    useEffect(() => {
        // In a real app, you would fetch this from your API
        setProject({ id: projectId, name: `Project ${projectId}` });
    }, [projectId]);

    const handleFileSelect = (file) => {
        // In a real app, fetch file content from API
        setActiveFile(file);
        setFileContent(`// Content for ${file.name}`);
        setHasUnsavedChanges(false);
    };

    const handleCodeChange = (newContent) => {
        setFileContent(newContent);
        if (!hasUnsavedChanges) {
            setHasUnsavedChanges(true);
        }
    };

    const handleSave = () => {
        // In a real app, save the file content via API
        console.log('Saving file:', activeFile.name, fileContent);
        setHasUnsavedChanges(false);
        toast.success('File Saved!');
    };

    const handleRun = async () => {
        setIsRunning(true);
        setOutput('');
        // In a real app, send code to the backend for execution
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
        setOutput(`> Executing ${activeFile.name}...

Hello, World!
Execution finished.`);
        setIsRunning(false);
    };
    
    const handleCommit = () => {
        toast('Committing changes...', { icon: '🚀' });
        // Git integration logic here
    };

    // Handle Ctrl+S / Cmd+S for saving
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                handleSave();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleSave]);


    if (!project) {
        return <div className="flex items-center justify-center h-screen bg-gray-900 text-white">Loading Project...</div>;
    }

    return (
        <div className="h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
            <Toaster position="top-center" reverseOrder={false} />
            <header className="flex items-center justify-between h-12 px-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center text-sm">
                    <span className="font-bold">{project.name}</span>
                    {activeFile && (
                        <>
                            <ChevronRight className="w-4 h-4 mx-1" />
                            <span className="flex items-center">
                                {activeFile.name}
                                {hasUnsavedChanges && <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full" title="Unsaved changes"></span>}
                            </span>
                        </>
                    )}
                </div>
                <div className="flex items-center gap-4">
                    <button onClick={handleRun} disabled={isRunning} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        {isRunning ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                        <span>Run</span>
                    </button>
                    <button onClick={handleSave} disabled={!hasUnsavedChanges} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
                        <Save className="w-4 h-4" />
                        <span>Save</span>
                    </button>
                    <button onClick={handleCommit} className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-600 hover:bg-gray-700 text-white rounded-md transition-colors">
                        <GitCommit className="w-4 h-4" />
                        <span>Commit</span>
                    </button>
                </div>
            </header>

            <ResizablePanelGroup direction="horizontal" className="h-[calc(100vh-3rem)]">
                <ResizablePanel defaultSize={20} minSize={15}>
                    <FileExplorer projectId={projectId} onFileSelect={handleFileSelect} activeFile={activeFile} />
                </ResizablePanel>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={80}>
                    <ResizablePanelGroup direction="vertical">
                        <ResizablePanel defaultSize={70} minSize={30}>
                            <Editor
                                file={activeFile}
                                content={fileContent}
                                onChange={handleCodeChange}
                            />
                        </ResizablePanel>
                        <ResizableHandle withHandle />
                        <ResizablePanel defaultSize={30} minSize={15}>
                            <Terminal output={output} />
                        </ResizablePanel>
                    </ResizablePanelGroup>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    );
};

export default EditorPage;
