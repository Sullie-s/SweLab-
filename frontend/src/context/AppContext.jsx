import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [currentProject, setCurrentProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [hardwareState, setHardwareState] = useState({
    HWSet1: { available: 10, capacity: 10 },
    HWSet2: { available: 8, capacity: 8 },
  });
  const [statusMessage, setStatusMessage] = useState('No actions yet.');

  const loadHardwareState = async () => {
    try {
      const status = await api.getHardwareStatus();
      setHardwareState(status);
    } catch (error) {
      console.error('Failed to load hardware state:', error);
      // Use defaults if API fails
      setHardwareState({
        HWSet1: { available: 10, capacity: 10 },
        HWSet2: { available: 8, capacity: 8 },
      });
    }
  };

  const loadProjects = async () => {
    try {
      const projectList = await api.listProjects();
      setProjects(projectList);
    } catch (error) {
      console.error('Failed to load projects:', error);
    }
  };

  useEffect(() => {
    // Load state from localStorage only if user is logged in
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const savedProject = localStorage.getItem('currentProject');
      
      if (savedProject) {
        setCurrentProject(JSON.parse(savedProject));
      }
      
      // Load hardware state from backend (global, shared)
      loadHardwareState();
    } else {
      // If no user, clear state
      setCurrentProject(null);
      setHardwareState({
        HWSet1: { available: 10, capacity: 10 },
        HWSet2: { available: 8, capacity: 8 },
      });
    }

    // Load projects list
    loadProjects();
  }, []);

  const createProject = async (projectId, projectName, projectDesc) => {
    try {
      // Check if project ID already exists
      const existingProject = projects.find(p => p.project_id === projectId || p.project_id === String(projectId));
      if (existingProject) {
        return { success: false, error: 'Project ID already exists' };
      }

      await api.createProject(projectId, projectName, projectDesc);
      
      // Reload projects and find the newly created one
      const updatedProjects = await api.listProjects();
      setProjects(updatedProjects);
      
      const newProject = updatedProjects.find(p => p.project_id === projectId || p.project_id === String(projectId));
      
      if (newProject) {
        setCurrentProject(newProject);
        localStorage.setItem('currentProject', JSON.stringify(newProject));
        setStatusMessage(`Created and joined project: ${projectName}`);
      }
      
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const joinProject = (projectId) => {
    const project = projects.find(p => p.project_id === projectId || p.project_id === String(projectId));
    if (project) {
      setCurrentProject(project);
      localStorage.setItem('currentProject', JSON.stringify(project));
      setStatusMessage(`Joined project: ${project.project_name}`);
      return { success: true };
    }
    return { success: false, error: 'Project not found' };
  };

  const checkoutHardware = async (hwSet, quantity) => {
    if (quantity <= 0) {
      setStatusMessage('Please enter a valid quantity');
      return { success: false, error: 'Invalid quantity' };
    }

    if (!currentProject) {
      setStatusMessage('Please select or create a project first');
      return { success: false, error: 'No project selected' };
    }

    try {
      const result = await api.checkoutHardware(currentProject.project_id, hwSet, quantity);
      
      // Reload hardware state from backend to get updated values
      await loadHardwareState();
      
      setStatusMessage(`Checked out ${quantity} units of ${hwSet}`);
      return { success: true };
    } catch (error) {
      setStatusMessage(error.message || 'Checkout failed');
      return { success: false, error: error.message };
    }
  };

  const checkinHardware = async (hwSet, quantity) => {
    if (quantity <= 0) {
      setStatusMessage('Please enter a valid quantity');
      return { success: false, error: 'Invalid quantity' };
    }

    try {
      const result = await api.checkinHardware(hwSet, quantity);
      
      // Reload hardware state from backend to get updated values
      await loadHardwareState();
      
      setStatusMessage(`Checked in ${quantity} units of ${hwSet}`);
      return { success: true };
    } catch (error) {
      setStatusMessage(error.message || 'Checkin failed');
      return { success: false, error: error.message };
    }
  };

  const resetAppState = () => {
    // Reset to default state
    setCurrentProject(null);
    setStatusMessage('No actions yet.');
    // Reload projects and hardware state from backend
    loadProjects();
    loadHardwareState();
  };

  return (
    <AppContext.Provider
      value={{
        currentProject,
        projects,
        hardwareState,
        statusMessage,
        createProject,
        joinProject,
        checkoutHardware,
        checkinHardware,
        loadProjects,
        loadHardwareState,
        resetAppState,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

