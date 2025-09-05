import { useState, useEffect, useCallback } from 'react';
import { Tree } from "react-arborist";
import { File, Folder, FilePlus, FolderPlus } from "lucide-react";

const FileExplorer = ({ projectId, onFileSelect }) => {
    const [treeData, setTreeData] = useState([]);
    const [treeKey, setTreeKey] = useState(0);
    const [selectedNode, setSelectedNode] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchFiles = useCallback(async () => {
        console.log('fetchFiles called');
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
            console.log('Fetched data for buildTree:', data);
            setTreeData(buildTree(data));
            setTreeKey(prevKey => prevKey + 1); // Increment key to force Tree re-render
            setSelectedNode(null); // Reset selectedNode when treeData changes
        } catch (err) {
            console.error('Error fetching files:', err);
            setError('Failed to load files.');
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        if (projectId) {
            fetchFiles();
        }
    }, [projectId, fetchFiles]);

    // Helper function to build a tree structure from a flat list of files/folders
    const buildTree = (flatList) => {
        console.log('buildTree received flatList:', flatList);
        const nodes = {};
        // First, create a node for each item in the list
        flatList.forEach(item => {
            nodes[item.id] = { ...item, children: item.is_folder ? [] : undefined };
        });

        const tree = [];
        // Then, link children to their parents
        flatList.forEach(item => {
            if (item.parent_id && nodes[item.parent_id]) {
                nodes[item.parent_id].children.push(nodes[item.id]);
            } else {
                tree.push(nodes[item.id]);
            }
        });
        console.log('buildTree returned tree:', tree);
        return tree;
    };

    const handleCreateFile = async (parentId) => {
        const fileName = prompt("Enter file name:");
        if (!fileName) return;

        const token = localStorage.getItem('token');
        if (!token) {
            alert("You must be logged in to create a file.");
            return;
        }

        const newFile = {
            name: fileName,
            is_folder: false,
            parent_id: parentId,
            content: '' // Or some default content
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

    const handleCreateClick = () => {
        let parentId = null;
        if (selectedNode) {
            // If a folder is selected, create the file inside it
            if (selectedNode.data.is_folder) {
                parentId = selectedNode.data.id;
            } else {
                // If a file is selected, create the file in the same folder
                parentId = selectedNode.data.parent_id;
            }
        }
        handleCreateFile(parentId);
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
                    <button onClick={handleCreateClick} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"><FilePlus className="w-4 h-4" /></button>
                    <button onClick={handleCreateFolder} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"><FolderPlus className="w-4 h-4" /></button>
                 </div>
            </div>
            {loading && <p>Loading files...</p>}
            {error && <p className="text-red-500">{error}</p>}
            {!loading && !error && treeData.length > 0 && (
                console.log('Rendering Tree with treeData:', treeData),
                <Tree
                    key={treeKey}
                    initialData={treeData}
                    width="100%"
                    height={1000} // Adjust height as needed
                    indent={20}
                    rowHeight={30}
                    disableDrag={true}
                    disableDrop={true}
                    onSelect={(nodes) => {
                        console.log('onSelect nodes:', nodes); // DEBUG LOG
                        setSelectedNode(nodes[0] || null);
                    }}
                >
                    {Node}
                </Tree>
            )}
            {!loading && !error && treeData.length === 0 && (
                <p>No files found for this project.</p>
            )}
        </div>
    );
};

export default FileExplorer;