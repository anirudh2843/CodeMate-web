const ProtectedRoute = ({ children }) => {
    const isAuthenticated = // check from Redux or localStorage
      localStorage.getItem("authToken"); // or useSelector from Redux
  
    if (!isAuthenticated) {
      return <Navigate to="/login" />;
    }
  
    return children;
  };
  