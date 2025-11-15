import { useState } from 'react';
import { useApp } from '../context/AppContext';

const ProjectManagement = () => {
  const [showCreate, setShowCreate] = useState(true);
  const [projectId, setProjectId] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [joinProjectId, setJoinProjectId] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentProject, projects, createProject, joinProject } = useApp();

  const handleCreateProject = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await createProject(projectId, projectName, projectDesc);
    setLoading(false);

    if (!result.success) {
      setError(result.error || 'Failed to create project');
    } else {
      setProjectId('');
      setProjectName('');
      setProjectDesc('');
    }
  };

  const handleJoinProject = (e) => {
    e.preventDefault();
    setError('');

    const result = joinProject(joinProjectId);
    if (!result.success) {
      setError(result.error || 'Failed to join project');
    } else {
      setJoinProjectId('');
    }
  };

  return (
    <div className="card">
      <h2>Project Management</h2>
      
      {currentProject && (
        <div style={{ 
          background: '#bee3f8', 
          padding: '12px', 
          borderRadius: '8px', 
          marginBottom: '15px',
          border: '1px solid #90cdf4',
          color: '#2c5282'
        }}>
          <strong>Current Project:</strong> {currentProject.project_name} ({currentProject.project_id})
        </div>
      )}

      <div style={{ marginBottom: '15px' }}>
        <button
          className={showCreate ? 'primary' : 'secondary'}
          onClick={() => setShowCreate(true)}
          style={{ marginRight: '5px' }}
        >
          Create Project
        </button>
        <button
          className={!showCreate ? 'primary' : 'secondary'}
          onClick={() => setShowCreate(false)}
        >
          Join Project
        </button>
      </div>

      {showCreate ? (
        <form onSubmit={handleCreateProject}>
          <label>
            Project ID:
            <input
              type="text"
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
              required
            />
          </label>
          <label>
            Project Name:
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              required
            />
          </label>
          <label>
            Description:
            <input
              type="text"
              value={projectDesc}
              onChange={(e) => setProjectDesc(e.target.value)}
            />
          </label>
          {error && <div style={{ color: '#c53030', marginTop: '8px', padding: '8px', background: '#fed7d7', borderRadius: '6px', border: '1px solid #fc8181' }}>{error}</div>}
          <button type="submit" className="primary" disabled={loading} style={{ marginTop: '10px' }}>
            {loading ? 'Creating...' : 'Create Project'}
          </button>
        </form>
      ) : (
        <form onSubmit={handleJoinProject}>
          <label>
            Project ID:
            <input
              type="text"
              value={joinProjectId}
              onChange={(e) => setJoinProjectId(e.target.value)}
              required
            />
          </label>
          {error && <div style={{ color: '#c53030', marginTop: '8px', padding: '8px', background: '#fed7d7', borderRadius: '6px', border: '1px solid #fc8181' }}>{error}</div>}
          <button type="submit" className="primary" style={{ marginTop: '10px' }}>
            Join Project
          </button>
        </form>
      )}

      {projects.length > 0 && (
        <div style={{ marginTop: '15px', paddingTop: '15px', borderTop: '1px solid #e2e8f0' }}>
          <strong>Available Projects:</strong>
          <div style={{ marginTop: '8px', fontSize: '0.9em', color: '#4a5568' }}>
            {projects.map((p) => (
              <div key={p.project_id} style={{ marginBottom: '4px' }}>
                {p.project_id} - {p.project_name}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;

