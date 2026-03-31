  import React from "react";
  import { useAuthStore } from "../store/useAuthStore";
  import { MessageSquare, User, LogOut } from "lucide-react";
  import { Link } from "react-router-dom";

  const Navbar = () => {
    const { logout, authUser } = useAuthStore();

    return (
      <header className="bg-base-100/80 border-b border-base-300 fixed w-full top-0 z-40 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 h-16">

          <div className="flex items-center justify-between h-full">

            {/* 🔹 LEFT SIDE (Logo) */}
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Mozhi</h1>
            </Link>

            {/* 🔹 RIGHT SIDE */}
            <div className="flex items-center gap-2">

             
              {authUser && (
                <>
                  <Link to="/profile" className="btn btn-sm gap-2">
                    <User className="size-5" />
                    <span className="hidden sm:inline">Profile</span>
                  </Link>

                  <button
                    className="btn btn-sm gap-2"
                    onClick={logout}
                  >
                    <LogOut className="size-5" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </>
              )}

            </div>

          </div>

        </div>
      </header>
    );
  };

  export default Navbar;