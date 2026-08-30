import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ArrowUpDown, 
  Filter, 
  Phone, 
  MessageSquare, 
  Plus, 
  Truck, 
  MapPin, 
  Calendar, 
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  PackageCheck
} from 'lucide-react';
import InteractiveMap from './InteractiveMap';

export default function TrackingDashboard({ 
  packages, 
  onNewPackageClick, 
  onCallDriver, 
  onChatDriver,
  onConsignmentClick,
  selectedConsignmentId,
  isDarkMode 
}) {
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedShipmentId, setSelectedShipmentId] = useState(packages[0]?.id || 'PKG-001');
  const [sortOption, setSortOption] = useState('default');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Compute counts for top category pills
  const counts = useMemo(() => {
    return {
      All: packages.length,
      Prepared: packages.filter(p => p.status.toLowerCase() === 'prepared').length,
      'In-transit': packages.filter(p => p.status.toLowerCase() === 'in-transit').length,
      Completed: packages.filter(p => p.status.toLowerCase() === 'completed').length,
      Failed: packages.filter(p => p.status.toLowerCase() === 'failed').length,
    };
  }, [packages]);

  // Filtered and sorted packages list
  const filteredPackages = useMemo(() => {
    let list = [...packages];

    // Status filter pill
    if (activeFilter !== 'All') {
      list = list.filter(p => p.status.toLowerCase() === activeFilter.toLowerCase());
    }

    // Category filter
    if (categoryFilter !== 'all') {
      list = list.filter(p => p.category.toLowerCase() === categoryFilter.toLowerCase());
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(p => 
        p.shipmentNumber?.toLowerCase().includes(q) ||
        p.title?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.driver?.name?.toLowerCase().includes(q) ||
        p.deliveryAddress?.toLowerCase().includes(q)
      );
    }

    // Sorting
    if (sortOption === 'departure') {
      list.sort((a, b) => (a.departureDate || '').localeCompare(b.departureDate || ''));
    } else if (sortOption === 'weight') {
      list.sort((a, b) => parseFloat(b.weight || 0) - parseFloat(a.weight || 0));
    } else if (sortOption === 'driver') {
      list.sort((a, b) => (a.driver?.name || '').localeCompare(b.driver?.name || ''));
    }

    return list;
  }, [packages, activeFilter, categoryFilter, searchQuery, sortOption]);

  const selectedPackage = packages.find(p => p.id === selectedShipmentId) || filteredPackages[0] || packages[0];

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'in-transit':
        return 'badge-in-transit';
      case 'completed':
        return 'badge-completed';
      case 'failed':
        return 'badge-failed';
      case 'prepared':
      default:
        return 'badge-prepared';
    }
  };

  return (
    <div className="tracking-dashboard-layout">
      
      {/* ================= TOP ACTION BAR ================= */}
      <header className="tracking-top-bar">
        
        {/* Filter Pills matching the screenshot: All(80), Prepared(30), In-transit(15), Completed(10), Failed(5) */}
        <div className="status-pill-group">
          {['All', 'Prepared', 'In-transit', 'Completed', 'Failed'].map((filterKey) => (
            <button
              key={filterKey}
              className={`status-pill ${activeFilter === filterKey ? 'active' : ''}`}
              onClick={() => setActiveFilter(filterKey)}
            >
              {filterKey}({counts[filterKey] !== undefined ? counts[filterKey] : 0})
            </button>
          ))}
        </div>

        {/* Right Search, Sort, Filter Bar */}
        <div className="top-search-filter-controls">
          
          {/* Search Order Pill Input */}
          <div className="search-input-pill">
            <Search size={16} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search order, items.."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Sort Pill Button */}
          <div className="dropdown-wrapper">
            <button 
              className={`action-pill-btn ${isSortOpen ? 'active' : ''}`}
              onClick={() => { setIsSortOpen(!isSortOpen); setIsFilterOpen(false); }}
            >
              <ArrowUpDown size={14} />
              <span>Sort</span>
            </button>

            {isSortOpen && (
              <div className="dropdown-popover">
                <div className="popover-item" onClick={() => { setSortOption('default'); setIsSortOpen(false); }}>
                  Default Order
                </div>
                <div className="popover-item" onClick={() => { setSortOption('departure'); setIsSortOpen(false); }}>
                  By Departure Date
                </div>
                <div className="popover-item" onClick={() => { setSortOption('weight'); setIsSortOpen(false); }}>
                  By Cargo Weight
                </div>
                <div className="popover-item" onClick={() => { setSortOption('driver'); setIsSortOpen(false); }}>
                  By Driver Name
                </div>
              </div>
            )}
          </div>

          {/* Add Filter Pill Button */}
          <div className="dropdown-wrapper">
            <button 
              className={`action-pill-btn ${isFilterOpen ? 'active' : ''}`}
              onClick={() => { setIsFilterOpen(!isFilterOpen); setIsSortOpen(false); }}
            >
              <Filter size={14} />
              <span>Add filter</span>
            </button>

            {isFilterOpen && (
              <div className="dropdown-popover">
                <div className="popover-header">Filter by Category</div>
                {['all', 'Food', 'Clothes', 'Medical', 'Electronics', 'Furniture'].map(cat => (
                  <div 
                    key={cat} 
                    className={`popover-item ${categoryFilter === cat ? 'selected' : ''}`}
                    onClick={() => { setCategoryFilter(cat); setIsFilterOpen(false); }}
                  >
                    {cat === 'all' ? 'All Categories' : cat}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </header>

      {/* ================= MAIN CONTENT GRID (CARDS + MAP) ================= */}
      <div className="tracking-main-split">
        
        {/* LEFT COLUMN: CARDS GRID */}
        <div className="shipment-cards-scroll-area">
          <div className="cards-grid-layout">
            
            {/* CARD 1: NEW PACKAGE CREATION CARD (Exact UI Match) */}
            <div className="new-package-card" onClick={onNewPackageClick}>
              <div className="new-package-illus-box">
                {/* Friendly SVG Illustration of Truck, Parcel, Location Pin & Stars */}
                <svg viewBox="0 0 160 100" className="new-package-svg">
                  {/* Soft cloud shapes */}
                  <path d="M 20 50 Q 30 30 50 40 T 80 40 Q 95 30 110 50 Z" fill="#EBF2FA" opacity="0.8" />
                  
                  {/* Five Rating Stars */}
                  <g fill="#FFAE33" fontSize="8">
                    <text x="35" y="24">★</text>
                    <text x="44" y="24">★</text>
                    <text x="53" y="24">★</text>
                    <text x="62" y="24">★</text>
                    <text x="71" y="24">★</text>
                  </g>

                  {/* Parcel Boxes in background */}
                  <rect x="92" y="42" width="18" height="18" rx="2" fill="#FFAE33" />
                  <line x1="92" y1="51" x2="110" y2="51" stroke="#E69500" strokeWidth="1.5" />
                  <rect x="104" y="48" width="14" height="14" rx="2" fill="#FFC966" />
                  
                  {/* Delivery Location Pin */}
                  <path d="M 112 28 C 107 28 103 32 103 37 C 103 44 112 50 112 50 C 112 50 121 44 121 37 C 121 32 117 28 112 28 Z" fill="#EA4335" />
                  <circle cx="112" cy="36" r="3" fill="#FFFFFF" />

                  {/* Delivery Truck Body */}
                  <rect x="52" y="38" width="48" height="28" rx="4" fill="#2B2D42" />
                  <path d="M 38 48 L 52 48 L 52 66 L 35 66 C 33 66 32 64 32 62 L 32 54 C 32 50 35 48 38 48 Z" fill="#3D405B" />
                  {/* Truck Window & Driver */}
                  <path d="M 38 50 L 49 50 L 49 58 L 36 58 Z" fill="#8D99AE" />
                  <circle cx="43" cy="54" r="3" fill="#E07A5F" />
                  
                  {/* Ground line */}
                  <line x1="20" y1="72" x2="135" y2="72" stroke="#2B2D42" strokeWidth="2.5" strokeLinecap="round" />
                  
                  {/* Truck Wheels */}
                  <circle cx="44" cy="68" r="6" fill="#1D1E2C" stroke="#FFFFFF" strokeWidth="2" />
                  <circle cx="86" cy="68" r="6" fill="#1D1E2C" stroke="#FFFFFF" strokeWidth="2" />
                </svg>
              </div>

              <h3 className="new-package-title">New Package</h3>
              
              <button className="new-package-add-btn" title="Create New Package">
                <Plus size={20} />
              </button>
            </div>

            {/* SHIPMENT CARDS LIST */}
            {filteredPackages.map((pkg, idx) => {
              const isSelected = selectedPackage.id === pkg.id;
              // Make second card dark themed like in the reference image if it's the active one or by default
              const isDarkCard = isSelected || idx === 0;

              return (
                <div 
                  key={pkg.id}
                  className={`shipment-card ${isDarkCard ? 'card-dark-theme' : 'card-light-theme'} ${isSelected ? 'is-selected' : ''} ${selectedConsignmentId === pkg.id ? 'ai-panel-highlighted' : ''}`}
                  onClick={() => {
                    setSelectedShipmentId(pkg.id);
                    if (onConsignmentClick) onConsignmentClick(pkg);
                  }}
                >
                  
                  {/* Top Row: Truck Graphic + Shipment Number + Status Pill */}
                  <div className="card-top-header">
                    <div className="card-truck-icon-wrap">
                      <svg viewBox="0 0 48 24" className="card-truck-svg">
                        <rect x="14" y="2" width="30" height="15" rx="2" fill={isDarkCard ? "#E2E8F0" : "#2B2D42"} />
                        <path d="M 2 8 L 14 8 L 14 17 L 0 17 L 0 11 C 0 9 1 8 2 8 Z" fill={isDarkCard ? "#CBD5E1" : "#4A5568"} />
                        <rect x="4" y="9" width="6" height="5" rx="1" fill={isDarkCard ? "#64748B" : "#A0AEC0"} />
                        <circle cx="8" cy="18" r="3.5" fill="#1E293B" stroke="#FFF" strokeWidth="1" />
                        <circle cx="36" cy="18" r="3.5" fill="#1E293B" stroke="#FFF" strokeWidth="1" />
                        <circle cx="28" cy="18" r="3.5" fill="#1E293B" stroke="#FFF" strokeWidth="1" />
                      </svg>
                    </div>

                    <div className="card-shipment-meta">
                      <span className="card-label-sub">Shipment number</span>
                      <strong className="card-shipment-num">{pkg.shipmentNumber}</strong>
                    </div>

                    <div className="card-status-container">
                      <span className={`card-status-badge ${getStatusBadgeClass(pkg.status)}`}>
                        {pkg.status}
                      </span>
                    </div>
                  </div>

                  {/* Middle Row: Departure, Vertical Stepper Line, Arrival & Category */}
                  <div className="card-stepper-grid">
                    
                    {/* Departure Column */}
                    <div className="stepper-col-left">
                      <span className="stepper-label">Departure</span>
                      <strong className="stepper-date">{pkg.departureDate || "12-2-26"}</strong>
                    </div>

                    {/* Vertical Dot Stepper Line */}
                    <div className="stepper-col-center">
                      <div className="stepper-top-marker">
                        <span className="stepper-triangle">▼</span>
                      </div>
                      <div className="stepper-dashed-line"></div>
                      <div className="stepper-bottom-marker">
                        <span className="stepper-circle-dot"></span>
                      </div>
                    </div>

                    {/* Category & Arrival Column */}
                    <div className="stepper-col-right">
                      <div className="category-block">
                        <span className="stepper-label">Category</span>
                        <strong className="stepper-category-val">{pkg.category || "Food"}</strong>
                      </div>
                      <div className="arrival-block">
                        <span className="stepper-label">Arrival</span>
                        <strong className="stepper-date">{pkg.arrivalDate || "17-2-26"}</strong>
                      </div>
                    </div>

                  </div>

                  {/* Bottom Row: Driver Name + Phone & Chat Action Buttons */}
                  <div className="card-bottom-actions">
                    <div className="driver-name-block">
                      <span className="driver-label">Driver</span>
                      <strong className="driver-name-text">{pkg.driver?.name || "Mr. Arjun Sharma"}</strong>
                    </div>

                    <div className="driver-btn-group">
                      <button 
                        className="driver-action-btn phone-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onCallDriver(pkg.driver?.name || "Mr. Arjun Sharma");
                        }}
                        title={`Call ${pkg.driver?.name}`}
                      >
                        <Phone size={15} />
                      </button>

                      <button 
                        className="driver-action-btn chat-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          onChatDriver(pkg.driver?.name || "Mr. Arjun Sharma", pkg.shipmentNumber);
                        }}
                        title={`Chat with ${pkg.driver?.name}`}
                      >
                        <MessageSquare size={15} />
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}

          </div>
        </div>

        {/* RIGHT COLUMN: REALISTIC CITY STREET MAP */}
        <div className="map-view-column">
          <InteractiveMap 
            selectedPackage={selectedPackage}
            isDarkMode={isDarkMode}
          />
        </div>

      </div>

    </div>
  );
}
