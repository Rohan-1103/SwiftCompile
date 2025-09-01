import React, { useState, useEffect } from 'react';
import axios from 'axios';

// COMPONENT TO DISPLAY AND MANAGE FILES WITHIN A PROJECT
const ProjectDetails = ({ project }) => {
  const [files, setFiles] = useState([]);
  const [newFileName, setNewFileName] = useState('');
  const [editingFile, setEditingFile] = useState(null); // STATE TO HOLD THE FILE BEING EDITED
  const [fileContent, setFileContent] = useState(''); // STATE TO HOLD THE CONTENT OF THE FILE BEING EDITED

  // EFFECT TO UPDATE FILES WHEN THE PROJECT PROP CHANGES
  useEffect(() => {
    setFiles(project.files || []);
  }, [project]);

  // HANDLES CREATION OF A NEW FILE
  const handleCreateFile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        `http://localhost:3000/api/projects/${project.id}/files`,
        { name: newFileName },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setFiles([...files, res.data]);
      setNewFileName('');
    } catch (err) {
      console.error('Error creating file:', err);
    }
  };

  // HANDLES UPDATING THE CONTENT OF AN EXISTING FILE
  const handleUpdateFile = async (fileId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.put(
        `http://localhost:3000/api/projects/${project.id}/files/${fileId}`,
        { content: fileContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // UPDATE THE FILE IN THE LOCAL STATE
      setFiles(files.map(file => file.id === fileId ? res.data : file));
      setEditingFile(null);
      setFileContent('');
    } catch (err) {
      console.error('Error updating file:', err);
    }
  };

  // HANDLES DELETING A FILE
  const handleDeleteFile = async (fileId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3000/api/projects/${project.id}/files/${fileId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFiles(files.filter((file) => file.id !== fileId));
    } catch (err) {
      console.error('Error deleting file:', err);
    }
  };

  return (
    <div className="mt-4">
      <h3 className="text-xl font-bold mb-4">Files</h3>
      <form onSubmit={handleCreateFile} className="mb-4">
        <input 
          type="text"
          value={newFileName}
          onChange={(e) => setNewFileName(e.target.value)}
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700"
          placeholder="New file name"
        />
        <button type="submit" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2">
          Create File
        </button>
      </form>
      <ul>
        {files.map((file) => (
          <li key={file.id} className="flex justify-between items-center bg-gray-100 dark:bg-gray-700 p-2 rounded mb-2">
            <span>{file.name}</span>
            <div>
              <button onClick={() => { setEditingFile(file); setFileContent(file.content); }} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline">
                Edit
              </button>
              <button onClick={() => handleDeleteFile(file.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline ml-2">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editingFile && (
        <div className="mt-4 p-4 bg-white dark:bg-gray-800 shadow-md rounded">
          <h4 className="text-lg font-bold mb-2">Edit {editingFile.name}</h4>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 h-48"
            value={fileContent}
            onChange={(e) => setFileContent(e.target.value)}
          ></textarea>
          <button onClick={() => handleUpdateFile(editingFile.id)} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2">
            Save Changes
          </button>
          <button onClick={() => { setEditingFile(null); setFileContent(''); }} className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2 ml-2">
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;
