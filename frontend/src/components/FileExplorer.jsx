
import { useState, useEffect } from 'react';
import { Tree } from "react-arborist";
import { File, Folder, FilePlus, FolderPlus, Edit, Trash2 } from "lucide-react";

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

    // In a real app, you'd fetch this data
    useEffect(() => {
        // fetch(`/api/projects/${projectId}/files`).then(res => res.json()).then(data => setTreeData(data));
    }, [projectId]);

    const Node = ({ node, style, dragHandle }) => {
        const isFolder = !!node.children;
        const Icon = isFolder ? Folder : File;

        return (
            <div
                ref={dragHandle}
                style={style}
                className={`flex items-center gap-2 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 rounded-md px-2 ${node.isSelected ? 'bg-blue-500/20' : ''}`}
                onClick={() => !isFolder && onFileSelect(node.data)}
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
                    <button className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"><FilePlus className="w-4 h-4" /></button>
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
            >
                {Node}
            </Tree>
        </div>
    );
};

export default FileExplorer;
