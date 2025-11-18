import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../store/authStore";

interface Props {
  children: React.ReactNode;
  openAuth: () => void;
}

export const ProtectedRoute: React.FC<Props> = ({ children, openAuth }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      openAuth();
    }
  }, [loading, user, openAuth]);

  if (loading) {
    return <div style={{ padding: 32 }}>Loading…</div>;
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
