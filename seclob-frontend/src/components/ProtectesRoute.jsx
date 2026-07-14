// ProtectedRoute.jsx
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  if (token) {
    return children;
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <p>You must log in to access this page.</p>
      <button
        onClick={() => navigate('/signin')}
        style={{
          padding: '10px 20px',
          backgroundColor: '#EDA415',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Please Login
      </button>
    </div>
  );
};

export default ProtectedRoute;
