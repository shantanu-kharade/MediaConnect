import { Link, useNavigate } from "react-router-dom";
import { Home, PlusSquare, User, LogOut, Search } from "lucide-react";
import { Button } from "../ui/button.jsx";
import { Input } from "../ui/input.jsx";


const Header = () => {
  const { user, logout } = {
    avatar: "https://via.placeholder.com/150",
    displayName: "Name",    
  }; //fetch user data from context or api
  const navigate = useNavigate();

  const handleLogout = () => {
  
    navigate("/");
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        {/* Logo */}
        <Link to="/feed" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-gold to-gold-light">
            <span className="font-display text-lg font-bold text-accent-foreground">M</span>
          </div>
          <span className="hidden font-display text-xl font-semibold text-foreground sm:block">
            media-connect
          </span>
        </Link>

        {/* Search */}
        <div className="hidden max-w-md flex-1 px-8 md:block">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search people, posts..."
              className="h-10 pl-10"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          <Button variant="ghost" size="icon" asChild className="hover:bg-secondary">
            <Link to="/feed">
              <Home className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild className="hover:bg-secondary">
            <Link to="/create-post">
              <PlusSquare className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="ghost" size="icon" asChild className="hover:bg-secondary">
            <Link to="/profile">
              <User className="h-5 w-5" />
            </Link>
          </Button>
          <div className="ml-2 h-6 w-px bg-border" />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-5 w-5" />
          </Button>
          {user && (
            <Link to="/profile" className="ml-2">
              <img
                src={user.avatar}
                alt={user.displayName || "User Avatar"}
                className="h-8 w-8 rounded-full border-2 border-gold object-cover transition-transform hover:scale-105"
              />
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;