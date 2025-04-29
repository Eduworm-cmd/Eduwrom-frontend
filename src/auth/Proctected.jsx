import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useLocation, Navigate } from "react-router-dom";

const SuperAdminProtected = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const storedToken = localStorage.getItem('token');
  const isAuthenticated = token || storedToken;
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'superadmin') {
      localStorage.setItem('redirectUrl', location.pathname);
    }
  }, [isAuthenticated, location.pathname]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'superadmin') return <Navigate to="/404" replace />; 

  return children;
};

const SchoolAdminProtected = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const storedToken = localStorage.getItem('token');
  const isAuthenticated = token || storedToken;
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'schooladmin') {
      localStorage.setItem('redirectUrl', location.pathname);
    }
  }, [isAuthenticated, location.pathname]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'schooladmin') return <Navigate to="/404" replace />;

  return children;
};

const TeacherAdminProtected = ({ children }) => {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const storedToken = localStorage.getItem('token');
  const isAuthenticated = token || storedToken;
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'teacher') {
      localStorage.setItem('redirectUrl', location.pathname);
    }
  }, [isAuthenticated, location.pathname]);

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'teacher') return <Navigate to="/404" replace />;

  return children;
};


const isSuperAdmin = () =>{
  const user = useSelector((state) => state.auth.user);
  return user.role.includes('superadmin');
}

export { SuperAdminProtected, SchoolAdminProtected,TeacherAdminProtected, isSuperAdmin };