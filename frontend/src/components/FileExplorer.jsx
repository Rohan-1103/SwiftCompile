import { useState, useEffect, useCallback } from 'react';
import { Tree } from "react-arborist";
import { File, Folder, FilePlus, FolderPlus, Trash2 } from "lucide-react";

const FileExplorer = ({ projectId, onFileSelect }) => {
    const [treeData, setTreeData] = useState([]);
    const [selectedNode, setSelectedNode] = useState(null);
    const [treeKey, setTreeKey] = useState(0);

    const mapFileToNode = (file) => ({
        id: file.id.toString(),
        name: file.name,
        is_folder: file.is_folder,
        children: file.is_folder ? [] : null,
        ...file
    });

    useEffect(() => {
        if (!projectId) return;

        const fetchRootFiles = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                return;
            }
            const response = await fetch(`/api/projects/${projectId}/files`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                return;
            }

            const files = await response.json();
            setTreeData(files.map(mapFileToNode));
            setTreeKey(prevKey => prevKey + 1);
        };

        fetchRootFiles();
    }, [projectId]);

    const getChildren = useCallback(async (node) => {
        const token = localStorage.getItem('token');
        if (!token) {
            return [];
        }
        const folderId = node.data.id;
        const url = `/api/projects/${projectId}/files?folderId=${folderId}`;

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            return [];
        }

        const files = await response.json();
        return files.map(mapFileToNode);
    }, [projectId]);

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
            content: ''
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
            alert('File created. Refreshing the file explorer to see changes.');
            window.location.reload();

        } catch (error) {
            console.error("Error creating file:", error);
            alert("Error creating file.");
        }
    };

    const handleCreateClick = () => {
        let parentId = null;
        if (selectedNode) {
            if (selectedNode.data.is_folder) {
                parentId = selectedNode.data.id;
            } else {
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
            if (selectedNode.data.is_folder) {
                parentId = selectedNode.data.id;
            } else {
                parentId = selectedNode.data.parent_id;
            }
        }

        const newFolder = {
            name: folderName,
            is_folder: true,
            parent_id: parentId
        };

        try {
            const response = await fetch(`/api/projects/${projectId}/files/folder`, {
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
            alert('Folder created. Refreshing the file explorer to see changes.');
            window.location.reload();

        } catch (error) {
            console.error("Error creating folder:", error);
            alert("Error creating folder.");
        }
    };

    const handleDelete = async (fileId, isFolder) => {
        if (!confirm(`Are you sure you want to delete this ${isFolder ? 'folder' : 'file'}? This action cannot be undone.`)) {
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) {
            alert("You must be logged in to delete files.");
            return;
        }

        try {
            const response = await fetch(`/api/projects/${projectId}/files/${fileId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to delete file/folder');
            }
            alert(`${isFolder ? 'Folder' : 'File'} deleted. Refreshing the file explorer to see changes.`);
            window.location.reload();

        } catch (error) {
            console.error("Error deleting file/folder:", error);
            alert("Error deleting file/folder.");
        }
    };

    const Node = ({ node, style, dragHandle }) => {
        const Icon = node.data.is_folder ? Folder : File;
        return (
            <div
                ref={dragHandle}
                style={style}
                className={`flex items-center gap-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md px-2 ${node.isSelected ? 'bg-blue-500/20 border border-blue-500' : ''}`}
                onClick={() => {
                    if (node.data.is_folder) {
                        node.toggle();
                    } else {
                        onFileSelect(node.data);
                    }
                }}
            >
                <Icon className={`w-4 h-4 ${node.isLeaf ? 'text-gray-400' : 'text-blue-400'}`} />
                <span>{node.data.name}</span>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(node.data.id, node.data.is_folder);
                    }}
                    className="ml-auto p-1 hover:bg-red-200 dark:hover:bg-red-700 rounded"
                >
                    <Trash2 className="w-4 h-4 text-red-500" />
                </button>
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
            <Tree
                key={treeKey}
                initialData={treeData}
                getChildren={getChildren}
                width="100%"
                height={1000}
                indent={20}
                rowHeight={30}
                disableDrag={true}
                disableDrop={true}
                onSelect={(nodes) => {
                    setSelectedNode(nodes[0] || null);
                }}
            >
                {Node}
            </Tree>
        </div>
    );
};

export default FileExplorer;