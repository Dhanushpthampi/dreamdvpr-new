'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

const ClientSidebar = ({ isMobile = false, onClose }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user?.role === 'client') {
      fetchProjects();
    }
  }, [session]);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects');
      const data = await res.json();
      setProjects(data.projects || []);
    } catch (error) {
      console.error('Sidebar project fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const activeProject = projects.find(p => ['in-progress', 'pending', 'onboarding'].includes(p.status.toLowerCase()));

  const menuItems = [
    { label: 'Dashboard', path: '/client', icon: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z' },
    { label: 'My Projects', path: '/client/projects', icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z' },
    { label: 'Schedule Meeting', path: '/client/schedule', icon: 'M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z' },
    { label: 'My Invoices', path: '/client/invoices', icon: 'M11.5 2C6.81 2 3 5.81 3 10.5S6.81 19 11.5 19h.5v3c4.86-2.36 8-5.29 8-9.5C20 5.81 16.19 2 11.5 2zm1 14.5h-2v-2h2v2zm0-3.5h-2c0-2.25 2.5-2.75 2.5-4.5 0-1.1-.9-2-2-2s-2 .9-2 2h-2c0-2.21 1.79-4 4-4s4 1.79 4 4c0 2.5-3 3.12-3 5z' },
    { label: 'My Profile', path: '/client/profile', icon: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08s5.97 1.09 6 3.08c-1.29 1.94-3.5 3.22-6 3.22z' },
  ];

  const isActive = (path) =>
    path === '/client' ? pathname === path : pathname.startsWith(path);

  const handleNavigation = (path, badge) => {
    if (badge === 'Soon') return alert('Coming soon!');
    router.push(path);
    if (isMobile && onClose) onClose();
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/login' });
  };

  return (
    <div className="flex flex-col h-full bg-white/60 backdrop-blur-[24px] backdrop-saturate-[180%] border-r border-white/30">
      {/* Brand */}
      <div className="p-6 border-b border-white/30 bg-white/40 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-[#e53e3e]/10 p-2 rounded-lg">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#e53e3e]" fill="currentColor">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12z" />
            </svg>
          </div>
          <div className="flex flex-col items-start leading-tight">
            <p className="font-bold text-xl tracking-tight">
              <span className="text-[#e53e3e]">RED</span>
              <span className="text-[#1d1d1f]">gravity</span>
            </p>
            <p className="text-[10px] uppercase font-black tracking-widest text-[#86868b] opacity-60">Client Portal</p>
          </div>
        </div>
        {isMobile && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        )}
      </div>

      {/* Project Context */}
      {activeProject && (
        <div className="p-4 mx-4 mt-4 bg-black/5 rounded-xl border border-black/5 animate-in fade-in slide-in-from-left-4 duration-500">
          <p className="text-[10px] font-black text-black uppercase tracking-widest mb-1.5 opacity-40">Active Engagement</p>
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-black/40 animate-pulse" />
            <p className="text-sm font-bold text-[#1d1d1f] truncate">{activeProject.name}</p>
          </div>
        </div>
      )}

      {/* Nav */}
      <div className="flex flex-col p-4 gap-1 flex-1">
        {menuItems.map((item) => {
          const active = isActive(item.path);
          return (
            <div
              key={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${active
                ? 'bg-black/5 text-black font-semibold'
                : 'text-[#86868b] font-medium hover:bg-black/5'
                }`}
              onClick={() => handleNavigation(item.path, item.badge)}
            >
              <svg viewBox="0 0 24 24" className={`w-5 h-5 transition-colors ${active ? 'text-[#e53e3e]' : 'text-[#e53e3e]/50'}`} fill="currentColor">
                <path d={item.icon} />
              </svg>
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="px-2 py-0.5 rounded-full bg-white/30 text-xs">
                  {item.badge}
                </span>
              )}
            </div>
          );
        })}
      </div>

      <div className="border-t border-white/30" />

      {/* User & Logout */}
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/20">
          <div className="w-8 h-8 rounded-full bg-[#e53e3e] flex items-center justify-center text-white font-semibold text-sm">
            {session?.user?.name?.charAt(0) || 'U'}
          </div>
          <div className="flex flex-col items-start flex-1 min-w-0">
            <p className="text-sm font-medium text-[#1d1d1f] truncate w-full">{session?.user?.name}</p>
            <p className="text-xs text-[#86868b] truncate w-full">{session?.user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
            <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
          </svg>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export const ClientSidebarWrapper = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen static-theme" style={{ backgroundColor: '#f5f5f7' }}>
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-[20px] border-b border-gray-200 sticky top-0 z-50">
        <p className="font-bold text-[#1d1d1f]">RE<span style={{ display: 'inline-block', transform: 'scaleX(-1)' }}>D</span>gravity</p>
        <button
          onClick={() => setIsOpen(true)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Open menu"
        >
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-[#1d1d1f]" fill="currentColor" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
      </div>

      {/* Desktop */}
      <div className="hidden lg:block fixed left-0 top-0 bottom-0 w-[280px] z-10">
        <ClientSidebar />
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-[2000]"
            onClick={() => setIsOpen(false)}
          />
          <div className="lg:hidden fixed left-0 top-0 bottom-0 w-80 bg-white/60 backdrop-blur-[24px] z-[2001] shadow-xl">
            <ClientSidebar isMobile onClose={() => setIsOpen(false)} />
          </div>
        </>
      )}

      {/* Content */}
      <div className="lg:ml-[280px]">
        {children}
      </div>
    </div>
  );
};

export default ClientSidebar;
