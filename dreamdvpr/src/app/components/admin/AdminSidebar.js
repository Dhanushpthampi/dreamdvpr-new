'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';

const AdminSidebar = ({ isMobile = false, onClose }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [expandedItems, setExpandedItems] = useState(['Doc Generator']);

  const isActive = (path, exact = false) => {
    if (!path) return false;
    if (exact) return pathname === path;
    return path === '/admin' ? pathname === path : pathname.startsWith(path);
  };

  const menuItems = [
    { label: 'Dashboard', path: '/admin', icon: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z' },
    { label: 'Clients', path: '/admin/clients', icon: 'M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z' },
    { label: 'Projects', path: '/admin/projects', icon: 'M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z' },
    { label: 'Invoices', path: '/admin/invoices', exact: true, icon: 'M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z' },
    {
      label: 'Doc Generator',
      icon: 'M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z',
      subItems: [
        { label: 'Proposal Gen', path: '/admin/proposals' },
        { label: 'Invoice Gen', path: '/admin/invoices/generate' },
        { label: 'NDA Gen', path: '/admin/nda' },
        { label: 'Contract Gen', path: '/admin/contracts' },
      ]
    },
    { label: 'Content Management', path: '/admin/content', icon: 'M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 14H7v-2h10v2zm0-4H7v-2h10v2zm0-4H7V7h10v2z' },
    { label: 'Blog Management', path: '/admin/blogs', icon: 'M19 3H5c-1.1 0-2 .9-2 2v14h14V5c0-1.1-.9-2-2-2zM14 17H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z' },
  ];

  // Initialize expanded state based on current path
  useEffect(() => {
    const activeSubParent = menuItems.find(item =>
      item.subItems?.some(sub => pathname.startsWith(sub.path))
    );
    if (activeSubParent && !expandedItems.includes(activeSubParent.label)) {
      setExpandedItems(prev => [...prev, activeSubParent.label]);
    }
  }, [pathname]);

  const toggleExpand = (label) => {
    setExpandedItems(prev =>
      prev.includes(label) ? prev.filter(i => i !== label) : [...prev, label]
    );
  };

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
          <div className="bg-[#00abad] p-2 rounded-lg">
            <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7z" />
            </svg>
          </div>
          <div className="flex flex-col items-start">
            <p className="font-bold text-[#1d1d1f]">DREAMdvpr</p>
            <p className="text-xs text-[#86868b]">Admin Portal</p>
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

      <div className="flex flex-col p-4 gap-1 flex-1 overflow-y-auto">
        {menuItems.map((item) => {
          const isExpanded = expandedItems.includes(item.label);
          const active = item.path ? isActive(item.path, item.exact) : item.subItems?.some(si => isActive(si.path));

          return (
            <div key={item.label} className="flex flex-col gap-1">
              <div
                className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${active
                  ? 'bg-[#00abad]/12 text-[#00abad] font-semibold'
                  : 'text-[#86868b] font-medium hover:bg-[#00abad]/18'
                  }`}
                onClick={() => {
                  if (item.subItems) {
                    toggleExpand(item.label);
                  } else {
                    handleNavigation(item.path, item.badge);
                  }
                }}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                  <path d={item.icon} />
                </svg>
                <span className="flex-1">{item.label}</span>
                {item.subItems && (
                  <svg
                    viewBox="0 0 24 24"
                    className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                    fill="currentColor"
                  >
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                )}
                {item.badge && (
                  <span className="px-2 py-0.5 rounded-full bg-white/30 text-xs">
                    {item.badge}
                  </span>
                )}
              </div>

              {/* Sub Items */}
              {item.subItems && isExpanded && (
                <div className="flex flex-col gap-1 ml-9 border-l border-gray-100 pl-4 animate-in fade-in slide-in-from-top-2 duration-200">
                  {item.subItems.map((sub) => {
                    const subActive = isActive(sub.path);
                    return (
                      <div
                        key={sub.path}
                        className={`px-4 py-2 text-sm rounded-lg cursor-pointer transition-colors ${subActive
                          ? 'text-[#00abad] font-bold bg-[#00abad]/5'
                          : 'text-[#86868b] hover:text-[#00abad] hover:bg-gray-50'
                          }`}
                        onClick={() => handleNavigation(sub.path)}
                      >
                        {sub.label}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="border-t border-white/30" />

      {/* User & Logout */}
      <div className="p-4 space-y-2">
        <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-white/20">
          <div className="w-8 h-8 rounded-full bg-[#00abad] flex items-center justify-center text-white font-semibold text-sm">
            {session?.user?.name?.charAt(0) || 'A'}
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

export const AdminSidebarWrapper = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen static-theme" style={{ backgroundColor: '#f5f5f7' }} suppressHydrationWarning>
      {/* Mobile Header */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-white/80 backdrop-blur-[20px] border-b border-gray-200 sticky top-0 z-50">
        <p className="font-bold text-[#1d1d1f]">DREAMdvpr</p>
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
        <AdminSidebar />
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/50 z-[2000]"
            onClick={() => setIsOpen(false)}
          />
          <div className="lg:hidden fixed left-0 top-0 bottom-0 w-80 bg-white/60 backdrop-blur-[24px] z-[2001] shadow-xl">
            <AdminSidebar isMobile onClose={() => setIsOpen(false)} />
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

export default AdminSidebar;
