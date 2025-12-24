import { Link, useLocation } from "react-router-dom";
import { BookOpen, Trophy, Home } from "lucide-react";

export const Header = () => {
  const location = useLocation();
  
  const isActive = (path) => {
    if (path === "/" && location.pathname === "/") return true;
    if (path !== "/" && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <header className="glass-header sticky top-0 z-50" data-testid="header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group"
            data-testid="logo-link"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-stone-900 hidden sm:block">
              StudyQuest
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1" data-testid="main-nav">
            <Link
              to="/"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive("/") 
                  ? "bg-stone-900 text-white" 
                  : "text-stone-600 hover:bg-stone-100"
              }`}
              data-testid="nav-dashboard"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Link>
            <Link
              to="/achievements"
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                isActive("/achievements") 
                  ? "bg-stone-900 text-white" 
                  : "text-stone-600 hover:bg-stone-100"
              }`}
              data-testid="nav-achievements"
            >
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Achievements</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
