import React from 'react';

export default function UserAvatar({ user, size = "md", className = "" }) {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-10 h-10 text-sm",
    lg: "w-24 h-24 text-3xl",
    xl: "w-32 h-32 text-4xl"
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };

  const colors = [
    'bg-red-100 text-red-600', 'bg-blue-100 text-blue-600', 
    'bg-green-100 text-green-600', 'bg-purple-100 text-purple-600',
    'bg-orange-100 text-orange-600', 'bg-pink-100 text-pink-600'
  ];
  const colorIndex = user?.name ? user.name.length % colors.length : 1;
  const colorClass = colors[colorIndex];

  if (user?.avatarUrl) {
    return (
       <img 
         src={user.avatarUrl} 
         alt={user.name} 
         crossOrigin="anonymous" 
         referrerPolicy="no-referrer"
         className={`${sizes[size]} rounded-full object-cover border border-slate-200 dark:border-slate-700 ${className}`} 
         onError={(e) => {
             e.target.style.display = 'none'; 
         }}
       />
    );
  }

  return (
    <div className={`${sizes[size]} rounded-full ${colorClass} flex items-center justify-center font-bold border border-white dark:border-slate-800 shadow-sm ${className}`}>
       {getInitials(user?.name)}
    </div>
  );
}