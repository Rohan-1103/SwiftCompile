
import { FileCode, Trash2, ArrowRight } from 'lucide-react';

const ProjectCard = ({ project, onOpen, onDelete }) => {
    const { name, language, description, updatedAt } = project;

    const langIcons = {
        javascript: <FileCode className="w-6 h-6 text-yellow-400" />,
        python: <FileCode className="w-6 h-6 text-blue-400" />,
        // Add other languages here
        default: <FileCode className="w-6 h-6 text-gray-400" />
    };

    return (
        <div className="group relative bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out border border-transparent hover:border-blue-500/50">
             <div className="p-5">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                        {langIcons[language] || langIcons.default}
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">{name}</h3>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Last updated {new Date(updatedAt).toLocaleDateString()}</p>
                </div>
                <p className="mt-3 text-sm text-gray-600 dark:text-gray-300 h-10">{description}</p>
            </div>
            <div className="absolute bottom-5 right-5 flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <button onClick={() => onDelete(project.id)} className="p-2 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500">
                    <Trash2 className="w-4 h-4" />
                </button>
                <button onClick={() => onOpen(project.id)} className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-500 hover:bg-blue-600 text-white rounded-full">
                    Open <ArrowRight className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

export default ProjectCard;
