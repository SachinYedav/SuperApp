import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/store/authSlice";
import authService from "@/services/auth";

import { ChevronDown, LogOut, User, Settings, BookOpen } from "lucide-react";
import {
  Dropdown,
  ThemeToggle,
  SmartSearchBar,
  ConfirmModal,NotificationDropdown
} from "@/components/ui/index";
import Logo from '@/assets/Logo';
import AuthModal from "../auth/AuthModal";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const authStatus = useSelector((state) => state.auth.status);
  const userData = useSelector((state) => state.auth.userData);

  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const handleLogout = () => {
    authService.logout().then(() => {
      dispatch(logout());
      navigate("/");
    });
  };

  return (
    <>
      <header className="h-16 bg-white dark:bg-linear-to-r dark:from-slate-900 dark:to-slate-800 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between transition-colors duration-300">
        {/* 1. SMART SEARCH BAR  */}
        <SmartSearchBar />

        {/* Mobile Title */}
        <div className="flex items-center md:hidden">
          <Logo iconSize="w-8 h-8" textSize="text-xl" />
        </div>

        {/* 2. ACTIONS & PROFILE */}
        <div className="flex items-center gap-2 md:gap-4 ml-auto">
          <ThemeToggle />
          <NotificationDropdown />

          {authStatus && userData ? (
            // PROFILE DROPDOWN
            <Dropdown
              align="right"
              width="w-56"
              trigger={(isOpen) => (
                <div className="flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 p-1.5 pr-3 rounded-full transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-700 select-none">
                  <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                    {userData.name
                      ? userData.name.charAt(0).toUpperCase()
                      : "U"}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 leading-none truncate max-w-[100px]">
                      {userData.name}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5">
                      Pro Member
                    </p>
                  </div>
                  <ChevronDown
                    size={16}
                    className={`text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                  />
                </div>
              )}
            >
              {(close) => (
                <>
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 md:hidden">
                    <p className="text-sm font-bold text-slate-800 dark:text-white">
                      {userData.name}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {userData.email}
                    </p>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/settings/account"
                      onClick={close}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <User size={16} /> My Profile
                    </Link>
                    <Link
                      to="/settings/"
                      onClick={close}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <Settings size={16} /> Settings
                    </Link>
                    <Link
                      to="/docs"
                      onClick={close}
                      className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <BookOpen size={16} /> Documentation
                    </Link>
                  </div>
                  <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                    <button
                      onClick={() => {
                        setIsLogoutOpen(true);
                        close();
                      }}
                      className="flex w-full items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors font-medium"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </div>
                </>
              )}
            </Dropdown>
          ) : (
            <button
              onClick={() => setIsAuthOpen(true)}
              className="px-5 py-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-xl text-sm font-bold hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-lg shadow-slate-900/20"
            >
              Sign In
            </button>
          )}
        </div>
      </header>
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
      <ConfirmModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={handleLogout}
        title="Logout?"
        message="Are you sure you want to logout from your account?"
        type="danger"
        checkboxLabel="Yes, logout from my account"
      />
    </>
  );
}
