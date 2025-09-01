import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ProjectDetails from '../components/ProjectDetails';

// DASHBOARD PAGE COMPONENT
const DashboardPage = () => {
  const [projects, setProjects] = useState([]);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectLanguage, setNewProjectLanguage] = useState('web');
  const [selectedProject, setSelectedProject] = useState(null);

  // EFFECT TO FETCH PROJECTS ON COMPONENT MOUNT
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:3000/api/projects', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(res.data);
      } catch (err) {
        console.error('Error fetching projects:', err);
      }
    };
    fetchProjects();
  }, []);

  // HANDLES CREATION OF A NEW PROJECT
  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:3000/api/projects',
        { name: newProjectName, language: newProjectLanguage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjects([res.data, ...projects]);
      setNewProjectName('');
    } catch (err) {
      console.error('Error creating project:', err);
    }
  };

  // HANDLES SELECTION OF A PROJECT TO DISPLAY ITS DETAILS
  const handleSelectProject = async (projectId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:3000/api/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedProject(res.data);
    } catch (err) {
      console.error('Error fetching project details:', err);
    }
  };

  return (
    <div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-1 flex-col items-center bg-vision-light dark:bg-vision-dark text-vision-text-light dark:text-vision-text-dark p-8"
    >
      <h1 className="text-4xl font-bold text-vision-primary mb-8">Your Projects</h1>
      
      <div className="w-full max-w-md mb-8">
        <form onSubmit={handleCreateProject} className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4">
          <div className="mb-4">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="projectName">
              New Project Name
            </label>
            <input 
              id="projectName"
              type="text"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700"
              placeholder="My Awesome Project"
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="projectLanguage">
              Language
            </label>
            <select 
              id="projectLanguage"
              value={newProjectLanguage}
              onChange={(e) => setNewProjectLanguage(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 dark:text-gray-300 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700"
            >
              <option value="web">Web</option>
              <option value="python">Python</option>
              <option value="javascript">JavaScript</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <button 
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Create Project
            </button>
          </div>
        </form>
      </div>

      <div className="w-full max-w-4xl">
        {projects.map((project) => (
          <div key={project.id} className="bg-white dark:bg-gray-800 shadow-md rounded px-8 pt-6 pb-8 mb-4 cursor-pointer" onClick={() => handleSelectProject(project.id)}>
            <h2 className="text-2xl font-bold text-vision-primary mb-2">{project.name}</h2>
            <p className="text-gray-600 dark:text-gray-400">Language: {project.language}</p>
          </div>
        ))}
      </div>

      {selectedProject && <ProjectDetails project={selectedProject} />}
    </div>
  );
};

export default DashboardPage;
