import React from 'react';
import { 
  LayoutDashboard, 
  Navigation, 
  MessageSquare, 
  Package, 
  FileText, 
  BarChart3, 
  Headphones, 
  Settings, 
  LogOut, 
  ChevronDown, 
  Sparkles, 
  AlertTriangle,
  Moon,
  Sun
} from 'lucide-react';

export default function Sidebar({ 
  currentTab, 
  setCurrentTab, 
  isDarkMode, 
  onToggleDarkMode, 
  onLogout 
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tracking', label: 'Tracking', icon: Navigation, badge: '%' },
    { id: 'chats', label: 'Chats', icon: MessageSquare, count: 1 },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'optimize', label: 'Optimize AI', icon: Sparkles, isAi: true },
    { id: 'scenarios', label: 'Scenarios & Re-opt', icon: AlertTriangle },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'report', label: 'Report', icon: BarChart3 },
    { id: 'customer', label: 'Customer', icon: Headphones },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className={`app-sidebar ${isDarkMode ? 'sidebar-dark' : 'sidebar-light'}`}>
      
      {/* Top Section: User Profile Card */}
      <div className="sidebar-header-user">
        <div className="user-profile-badge">
          <div className="user-avatar-img" style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 15 }}>
            OG
          </div>
          
          <div className="user-text-info">
            <div className="user-name-row">
              <strong className="user-name">Omkar Ghangale</strong>
              <ChevronDown size={14} className="user-chevron" />
            </div>
            <span className="user-role">Admin · Fleet Manager</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Items */}
      <nav className="sidebar-nav-list">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id || (currentTab === 'demo' && item.id === 'tracking');

          return (
            <button
              key={item.id}
              className={`sidebar-nav-btn ${isActive ? 'active' : ''} ${item.isAi ? 'ai-item' : ''}`}
              onClick={() => setCurrentTab(item.id)}
              title={item.label}
            >
              <div className="nav-icon-wrapper">
                <Icon size={18} />
                {item.badge && <span className="nav-pill-badge">{item.badge}</span>}
              </div>
              
              <span className="nav-label-text">{item.label}</span>

              {item.count && (
                <span className="nav-unread-dot">{item.count}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Section: Theme Switch & Logout */}
      <div className="sidebar-footer-section">
        
        {/* Dark Mode Switcher */}
        <button 
          className="theme-toggle-btn"
          onClick={onToggleDarkMode}
          title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
          <span>{isDarkMode ? "Light Mode" : "Dark Mode"}</span>
        </button>

        {/* Logout Button (matching the reference image) */}
        <button 
          className="logout-btn"
          onClick={onLogout || (() => alert("Log out requested. Session preserved."))}
        >
          <LogOut size={17} />
          <span>Logout</span>
        </button>

      </div>

    </aside>
  );
}
