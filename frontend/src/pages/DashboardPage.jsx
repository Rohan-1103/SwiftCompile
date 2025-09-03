import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search } from 'lucide-react';
import ProjectCard from '../components/ProjectCard';
import SkeletonCard from '../components/SkeletonCard';

// MOCK DATA - REPLACE WITH API CALL
const mockProjects = [
    { id: 1, name: 'SwiftCompiler', language: 'javascript', description: 'A web-based Swift compiler using Monaco editor.', updatedAt: '2025-09-03T10:00:00Z' },
    { id: 2, name: 'DataViz Dashboard', language: 'python', description: 'Dashboard for visualizing sales data with charts.', updatedAt: '2025-09-02T14:30:00Z' },
    { id: 3, name: 'My Portfolio', language: 'javascript', description: 'Personal portfolio website built with React.', updatedAt: '2025-08-28T18:00:00Z' },
];

const DashboardPage = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            setProjects(mockProjects);
            setLoading(false);
        }, 1500);
    }, []);

    const handleNewProject = () => {
        // Navigate to a new project page or open a modal
        console.log('Creating new project...');
        // For now, let's navigate to a placeholder editor page
        const newProjectId = Math.max(...projects.map(p => p.id), 0) + 1;
        navigate(`/editor/${newProjectId}`);
    };

    const handleOpenProject = (projectId) => {
        navigate(`/editor/${projectId}`);
    };

    const handleDeleteProject = (projectId) => {
        setProjects(projects.filter(p => p.id !== projectId));
    };

    return (
        <div className="p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
            <header className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Projects</h1>
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input type="text" placeholder="Search projects..." className="pl-10 pr-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                    </div>
                    <button onClick={handleNewProject} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors">
                        <Plus className="w-5 h-5" />
                        New Project
                    </button>
                </div>
            </header>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
            ) : projects.length === 0 ? (
                <div className="text-center py-20">
                    <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">No projects yet!</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-8">Get started by creating your first project.</p>
                    <button onClick={handleNewProject} className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors text-lg">
                        Create Your First Project
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects.map(project => (
                        <ProjectCard 
                            key={project.id} 
                            project={project} 
                            onOpen={handleOpenProject}
                            onDelete={handleDeleteProject}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default DashboardPage;
