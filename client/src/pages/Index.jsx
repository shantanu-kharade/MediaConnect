import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/feed");
    } else {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 animate-pulse rounded-lg bg-gradient-to-br from-gold to-gold-light" />
        <span className="font-display text-xl font-bold text-foreground">
          Loading...
        </span>
      </div>
    </div>
  );
};

export default Index;
