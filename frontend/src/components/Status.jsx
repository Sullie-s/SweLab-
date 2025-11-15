import { useApp } from '../context/AppContext';

const Status = () => {
  const { statusMessage } = useApp();

  return (
    <div className="card">
      <h2>Status</h2>
      <p id="status">{statusMessage}</p>
    </div>
  );
};

export default Status;

