import { useState, useEffect } from 'react';
import { Tree } from "react-arborist";
import { File, Folder, FilePlus, FolderPlus } from "lucide-react";

const FileExplorer = ({ projectId, onFileSelect, activeFile }) => {
    const [treeData, setTreeData] = useState([]);
    const [selectedNode, setSelectedNode] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchFiles = async () => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Authentication required. Please log in.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`/api/projects/${projectId}/files`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                throw new Error('Failed to fetch files');
            }
            const data = await response.json();
            console.log('Fetched raw data:', data); // DEBUG LOG
            setTreeData(buildTree(data));
        } catch (err) {
            console.error('Error fetching files:', err);
            setError('Failed to load files.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (projectId) {
            fetchFiles();
        }
    }, [projectId]);

    // Helper function to build a tree structure from a flat list of files/folders
    const buildTree = (flatList) => {
        const nodes = {};
        const tree = [];

        flatList.forEach(item => {
            console.log('Building tree - processing item:', item); // DEBUG LOG
            if (!item || item.id === undefined) {
                console.error('Invalid item found in flatList:', item); // DEBUG LOG
                return; // Skip invalid items
            }
            // Initialize children only if it's a folder
            nodes[item.id] = { ...item, ...(item.is_folder && { children: [] }) };
        });

        flatList.forEach(item => {
            if (!item || item.id === undefined) {
                return; // Skip invalid items
            }
            if (item.parent_id && nodes[item.parent_id]) {
                console.log('Building tree - adding child to parent:', item.id, '->', item.parent_id); // DEBUG LOG
                nodes[item.parent_id].children.push(nodes[item.id]);
            } else {
                console.log('Building tree - adding to root:', item.id); // DEBUG LOG
                tree.push(nodes[item.id]);
            }
        });
        console.log('Final tree data:', tree); // DEBUG LOG
        return tree;
    };

    const getDefaultContent = (fileName) => {
        const extension = fileName.split('.').pop();
        switch (extension) {
            case 'js':
                return 'console.log("Hello, World!");';
            case 'html':
                return `<!DOCTYPE html>
<html>
<head>
  <title>New Page</title>
</head>
<body>
  <h1>Hello, World!</h1>
</body>
</html>`;
            case 'css':
                return `body {
  font-family: sans-serif;
}`;
            case 'py':
                return '# Your Python code here';
            default:
                return '';
        }
    };

    const handleCreateFile = async () => {
        const fileName = prompt("Enter file name:");
        if (!fileName) return;

        const token = localStorage.getItem('token');
        if (!token) {
            alert("You must be logged in to create a file.");
            return;
        }

        let parentId = null;
        if (selectedNode) {
            if (selectedNode.data.children) { // If selected node is a folder
                parentId = selectedNode.data.id;
            } else if (selectedNode.parent) { // If selected node is a file, use its parent
                parentId = selectedNode.parent.data.id;
            }
        }

        const newFile = {
            name: fileName,
            content: getDefaultContent(fileName),
            parent_id: parentId // Use parent_id to match backend
        };

        try {
            const response = await fetch(`/api/projects/${projectId}/files`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newFile)
            });

            if (!response.ok) {
                throw new Error('Failed to create file');
            }

            // Re-fetch files to update the tree after successful creation
            fetchFiles();

        } catch (error) {
            console.error("Error creating file:", error);
            alert("Error creating file.");
        }
    };

    const handleCreateFolder = async () => {
        const folderName = prompt("Enter folder name:");
        if (!folderName) return;

        const token = localStorage.getItem('token');
        if (!token) {
            alert("You must be logged in to create a folder.");
            return;
        }

        let parentId = null;
        if (selectedNode) {
            if (selectedNode.data.children) { // If selected node is a folder
                parentId = selectedNode.data.id;
            } else if (selectedNode.parent) { // If selected node is a file, use its parent
                parentId = selectedNode.parent.data.id;
            }
        }

        const newFolder = {
            name: folderName,
            is_folder: true, // Indicate that this is a folder
            parent_id: parentId
        };

        try {
            const response = await fetch(`/api/projects/${projectId}/files/folder`, { // Using the new folder endpoint
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newFolder)
            });

            if (!response.ok) {
                throw new Error('Failed to create folder');
            }

            // Re-fetch files to update the tree after successful creation
            fetchFiles();

        } catch (error) {
            console.error("Error creating folder:", error);
            alert("Error creating folder.");
        }
    };

    const Node = ({ node, style, dragHandle }) => {
        const isFolder = node.data.is_folder; // Use node.data.is_folder directly
        const Icon = isFolder ? Folder : File;

        return (
            <div
                ref={dragHandle}
                style={style}
                className={`flex items-center gap-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md px-2 ${node.isSelected ? 'bg-blue-500/20' : ''}`}
                onClick={() => {
                    if (!isFolder) onFileSelect(node.data)
                }}
            >
                <Icon className={`w-4 h-4 ${isFolder ? 'text-blue-400' : 'text-gray-400'}`} />
                <span>{node.data.name}</span>
            </div>
        );
    };

    return (
        <div className="h-full bg-gray-50 dark:bg-gray-800 p-2">
            <div className="flex items-center justify-between mb-2">
                 <h4 className="font-bold text-sm">File Explorer</h4>
                 <div className="flex gap-2">
                    <button onClick={handleCreateFile} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"><FilePlus className="w-4 h-4" /></button>
                    <button onClick={handleCreateFolder} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"><FolderPlus className="w-4 h-4" /></button>
                 </div>
            </div>
            {loading && <p>Loading files...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && (
                <Tree
                    initialData={treeData}
                    width="100%"
                    height={1000} // Adjust height as needed
                    indent={20}
                    rowHeight={30}
                    disableDrag={true}
                    disableDrop={true}
                    onSelect={(nodes) => setSelectedNode(nodes[0] || null)}
                >
                    {Node}
                </Tree>
            )}
        </div>
    );
};

export default FileExplorer;