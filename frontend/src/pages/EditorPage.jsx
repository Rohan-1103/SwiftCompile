
import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Allotment } from "allotment";
import "allotment/dist/style.css";
import { Play, Save, ChevronRight, Loader2 } from 'lucide-react';
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
    const [runCounter, setRunCounter] = useState(0);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    useEffect(() => {
        const fetchProject = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                toast.error('Authentication token not found. Please log in.');
                return;
            }

            try {
                const response = await fetch(`/api/projects/${projectId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch project details.');
                }
                const data = await response.json();
                setProject(data);
            } catch (error) {
                console.error('Error fetching project:', error);
                toast.error(error.message);
            }
        };

        if (projectId) {
            fetchProject();
        }
    }, [projectId]);

    const handleFileSelect = (file) => {
        console.log('handleFileSelect called. file:', file);
        console.log('handleFileSelect called. file.name:', file.name);
        setActiveFile(file);
        setFileContent(file.content || '');
        setHasUnsavedChanges(false);
    };

    const handleCodeChange = (newContent) => {
        setFileContent(newContent);
        if (!hasUnsavedChanges) {
            setHasUnsavedChanges(true);
        }
    };

    const handleSave = useCallback(async () => {
        if (!activeFile || !activeFile.id) {
            toast.error('No active file selected or file ID missing.');
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Authentication required. Please log in.');
            return;
        }

        try {
            const response = await fetch(`/api/projects/${projectId}/files/${activeFile.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: fileContent })
            });

            if (!response.ok) {
                throw new Error('Failed to save file.');
            }

            setHasUnsavedChanges(false);
            toast.success('File Saved!');
        } catch (error) {
            console.error('Error saving file:', error);
            toast.error(`Error saving file: ${error.message}`);
        }
    }, [activeFile, fileContent, projectId]);

    const getLanguageFromFile = (filename) => {
        if (!filename) {
            return 'plaintext';
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
            case 'css':
            case 'json':
            case 'md':
                return 'markdown';
            case 'c':
                return 'c';
            case 'java':
                return 'java';
            default:
                return 'plaintext';
        }
    };

    const handleRun = () => {
        if (!activeFile || !fileContent) {
            toast.error('No file selected or file is empty.');
            return;
        }

        const language = getLanguageFromFile(activeFile.name);
        if (language === 'plaintext') {
            toast.error('Unsupported file type for execution.');
            return;
        }

        setRunCounter(prev => prev + 1);
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
                </div>
            </header>

                        <Allotment defaultSizes={[200, 800]}>
              <Allotment.Pane minSize={150}>
                <FileExplorer projectId={projectId} onFileSelect={handleFileSelect} activeFile={activeFile} />
              </Allotment.Pane>
              <Allotment.Pane>
                <Allotment vertical>
                  <Allotment.Pane minSize={300}>
                    <Editor
                      file={activeFile}
                      content={fileContent}
                      onChange={handleCodeChange}
                    />
                  </Allotment.Pane>
                  <Allotment.Pane minSize={150}>
                    <Terminal 
                        runCounter={runCounter} 
                        language={getLanguageFromFile(activeFile?.name)} 
                        code={fileContent} 
                    />
                  </Allotment.Pane>
                </Allotment>
              </Allotment.Pane>
            </Allotment>
        </div>
    );
};

export default EditorPage;
