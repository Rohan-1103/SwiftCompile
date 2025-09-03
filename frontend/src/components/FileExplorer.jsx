
import { useState, useEffect } from 'react';
import { Tree } from "react-arborist";
import { File, Folder, FilePlus, FolderPlus } from "lucide-react";

// MOCK DATA - REPLACE WITH API CALL
const initialData = [
    { id: "1", name: "src", children: [
        { id: "c1", name: "App.jsx" },
        { id: "c2", name: "index.css" },
    ]},
    { id: "2", name: "public", children: [
        { id: "c3", name: "vite.svg" },
    ]},
    { id: "3", name: "package.json" },
];

const FileExplorer = ({ projectId, onFileSelect, activeFile }) => {
    const [treeData, setTreeData] = useState(initialData);
    const [selectedNode, setSelectedNode] = useState(null);

    // In a real app, you'd fetch this data
    useEffect(() => {
        // fetch(`/api/projects/${projectId}/files`).then(res => res.json()).then(data => setTreeData(data));
    }, [projectId]);

    const getDefaultContent = (fileName) => {
        const extension = fileName.split('.').pop();
        switch (extension) {
            case 'js':
                return 'console.log("Hello, World!");';
            case 'html':
                return '<!DOCTYPE html>\n<html>\n<head>\n  <title>New Page</title>\n</head>\n<body>\n  <h1>Hello, World!</h1>\n</body>\n</html>';
            case 'css':
                return 'body {\n  font-family: sans-serif;\n}';
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
            if (selectedNode.children) {
                parentId = selectedNode.id;
            } else {
                parentId = selectedNode.parent.id;
            }
        }

        const newFile = {
            name: fileName,
            content: getDefaultContent(fileName),
            parentId: parentId
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

            const createdFile = await response.json();

            // Update tree data
            const newTreeData = [...treeData];
            const parentNode = findNode(newTreeData, parentId);

            if (parentNode) {
                parentNode.children = parentNode.children ? [...parentNode.children, createdFile] : [createdFile];
            } else {
                newTreeData.push(createdFile);
            }
            setTreeData(newTreeData);

        } catch (error) {
            console.error("Error creating file:", error);
            alert("Error creating file.");
        }
    };

    const findNode = (nodes, id) => {
        for (const node of nodes) {
            if (node.id === id) return node;
            if (node.children) {
                const found = findNode(node.children, id);
                if (found) return found;
            }
        }
        return null;
    };

    const Node = ({ node, style, dragHandle }) => {
        const isFolder = !!node.children;
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
                    <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"><FolderPlus className="w-4 h-4" /></button>
                 </div>
            </div>
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
        </div>
    );
};

export default FileExplorer;
