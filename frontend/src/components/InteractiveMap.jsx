import React, { useState, useEffect } from 'react';
import { 
  Navigation, 
  MapPin, 
  Compass, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  CornerUpLeft,
  Truck,
  AlertTriangle,
  Radio,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function InteractiveMap({ 
  selectedPackage, 
  routeData = null, 
  isDarkMode = false,
  activeIncident = null 
}) {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [showTraffic, setShowTraffic] = useState(true);
  const [showSatellite, setShowSatellite] = useState(false);
  const [navProgress, setNavProgress] = useState(38); // percentage along route
  const [isSimulating, setIsSimulating] = useState(true);

  // Smooth simulation of vehicle moving along route
  useEffect(() => {
    if (!isSimulating) return;
    const interval = setInterval(() => {
      setNavProgress(prev => {
        if (prev >= 92) return 18;
        return prev + 0.8;
      });
    }, 600);
    return () => clearInterval(interval);
  }, [isSimulating]);

  // Current street and step based on package or defaults
  const currentStep = selectedPackage ? {
    direction: "Turn left",
    street: selectedPackage.deliveryAddress || "3 Birrel Avenue",
    distance: "10 Mtr Left",
    eta: "4 mins away",
    speed: "34 km/h"
  } : {
    direction: "Turn left",
    street: "3 Birrel Avenue",
    distance: "10 Mtr Left",
    eta: "4 mins away",
    speed: "32 km/h"
  };

  // Map theme colors
  const mapBg = isDarkMode ? "#121826" : "#F4F6F9";
  const roadColor = isDarkMode ? "#1E293B" : "#FFFFFF";
  const majorRoadColor = isDarkMode ? "#2D3B55" : "#E2E8F0";
  const roadBorder = isDarkMode ? "#334155" : "#CBD5E1";
  const textColor = isDarkMode ? "#94A3B8" : "#64748B";
  const waterColor = isDarkMode ? "#0F2B48" : "#E0F2FE";
  const parkColor = isDarkMode ? "#132D24" : "#DCFCE7";
  const blockColor = isDarkMode ? "#182234" : "#F8FAFC";

  // Calculate vehicle coordinates along a bezier-like path based on progress
  const getNavMarkerPos = (progress) => {
    // Waypoints along main avenue
    const p = progress / 100;
    // Path points from (120, 380) -> (190, 260) -> (310, 180) -> (450, 110) -> (520, 60)
    const x = 120 + p * (480 - 120) + Math.sin(p * Math.PI * 3) * 20;
    const y = 390 - p * (390 - 70) + Math.cos(p * Math.PI * 2) * 15;
    const angle = -45 + Math.sin(p * Math.PI * 2) * 25;
    return { x, y, angle };
  };

  const navMarker = getNavMarkerPos(navProgress);

  return (
    <div className={`map-container-wrapper ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      
      {/* Top Map Control Bar */}
      <div className="map-top-bar">
        <div className="map-live-pill">
          <span className="live-pulse-dot"></span>
          <span className="live-text">LIVE GPS TRACKING</span>
          <span className="live-speed">{currentStep.speed}</span>
        </div>

        <div className="map-action-buttons">
          <button 
            className={`map-ctrl-btn ${showTraffic ? 'active' : ''}`}
            onClick={() => setShowTraffic(!showTraffic)}
            title="Toggle Live Traffic Overlay"
          >
            <Radio size={14} />
            <span>Traffic</span>
          </button>
          <button 
            className="map-ctrl-btn" 
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.2, 1.6))}
            title="Zoom In"
          >
            <ZoomIn size={14} />
          </button>
          <button 
            className="map-ctrl-btn" 
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.2, 0.8))}
            title="Zoom Out"
          >
            <ZoomOut size={14} />
          </button>
          <button 
            className={`map-ctrl-btn ${isSimulating ? 'active' : ''}`}
            onClick={() => setIsSimulating(!isSimulating)}
            title="Toggle Live Vehicle Drive"
          >
            <Truck size={14} />
          </button>
        </div>
      </div>

      {/* SVG Canvas Map */}
      <div className="map-canvas-area" style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center center' }}>
        <svg 
          viewBox="0 0 600 500" 
          className="city-map-svg"
          preserveAspectRatio="xMidYMid slice"
        >
          {/* Background Map Land */}
          <rect width="600" height="500" fill={mapBg} />

          {/* City Parks / Greenery */}
          <path 
            d="M 20 40 Q 90 20 130 70 T 170 140 Q 110 180 40 130 Z" 
            fill={parkColor} 
            opacity="0.85" 
          />
          <path 
            d="M 420 320 Q 520 290 560 360 T 510 460 Q 430 450 410 380 Z" 
            fill={parkColor} 
            opacity="0.85" 
          />

          {/* City River / Waterway */}
          <path 
            d="M -20 480 Q 150 440 280 470 T 620 450 L 620 520 L -20 520 Z" 
            fill={waterColor} 
            opacity="0.9" 
          />

          {/* Urban Building Blocks / Layout */}
          {/* Top Left Sector */}
          <rect x="30" y="80" width="85" height="60" rx="6" fill={blockColor} stroke={roadBorder} strokeWidth="1" />
          <rect x="130" y="80" width="80" height="60" rx="6" fill={blockColor} stroke={roadBorder} strokeWidth="1" />
          <rect x="30" y="160" width="85" height="75" rx="6" fill={blockColor} stroke={roadBorder} strokeWidth="1" />
          <rect x="130" y="160" width="80" height="75" rx="6" fill={blockColor} stroke={roadBorder} strokeWidth="1" />
          <rect x="30" y="255" width="85" height="90" rx="6" fill={blockColor} stroke={roadBorder} strokeWidth="1" />
          <rect x="130" y="255" width="80" height="90" rx="6" fill={blockColor} stroke={roadBorder} strokeWidth="1" />

          {/* Center Column Sector */}
          <rect x="235" y="40" width="130" height="70" rx="6" fill={blockColor} stroke={roadBorder} strokeWidth="1" />
          <rect x="235" y="130" width="130" height="85" rx="6" fill={blockColor} stroke={roadBorder} strokeWidth="1" />
          <rect x="235" y="235" width="130" height="80" rx="6" fill={blockColor} stroke={roadBorder} strokeWidth="1" />
          <rect x="235" y="335" width="130" height="85" rx="6" fill={blockColor} stroke={roadBorder} strokeWidth="1" />

          {/* Right Column Sector */}
          <rect x="390" y="40" width="170" height="80" rx="6" fill={blockColor} stroke={roadBorder} strokeWidth="1" />
          <rect x="390" y="140" width="170" height="70" rx="6" fill={blockColor} stroke={roadBorder} strokeWidth="1" />
          <rect x="390" y="230" width="170" height="65" rx="6" fill={blockColor} stroke={roadBorder} strokeWidth="1" />

          {/* Minor Local Streets */}
          <g stroke={roadColor} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round">
            <line x1="20" y1="150" x2="580" y2="150" />
            <line x1="20" y1="245" x2="580" y2="245" />
            <line x1="20" y1="350" x2="580" y2="350" />
            <line x1="120" y1="20" x2="120" y2="460" />
            <line x1="380" y1="20" x2="380" y2="460" />
          </g>

          {/* Major Avenues (Jawaharlal Nehru Road, Birrel Ave, 19th Ave) */}
          <g stroke={majorRoadColor} strokeWidth="22" strokeLinecap="round" strokeLinejoin="round">
            {/* Jawaharlal Nehru Road (Main Diagonal North-South Spine) */}
            <path d="M 225 10 L 225 460" />
            {/* 3rd Avenue / Cross Boulevard */}
            <path d="M 10 320 L 590 320" />
            {/* Birrel Avenue Arterial Route */}
            <path d="M 40 420 Q 200 360 320 220 T 560 70" />
          </g>

          {/* Road Center Dotted Lines */}
          <path 
            d="M 225 15 L 225 455" 
            stroke={isDarkMode ? "#475569" : "#E2E8F0"} 
            strokeWidth="2" 
            strokeDasharray="8 6" 
          />
          <path 
            d="M 15 320 L 585 320" 
            stroke={isDarkMode ? "#475569" : "#E2E8F0"} 
            strokeWidth="2" 
            strokeDasharray="8 6" 
          />

          {/* Live Traffic Congestion Heat Overlay */}
          {showTraffic && (
            <g opacity="0.85">
              {/* Green Smooth Flow Corridor */}
              <path 
                d="M 40 420 Q 200 360 320 220" 
                stroke="#10B981" 
                strokeWidth="7" 
                strokeLinecap="round" 
                fill="none" 
              />
              {/* Moderate Amber Traffic Zone */}
              <path 
                d="M 320 220 T 430 140" 
                stroke="#F59E0B" 
                strokeWidth="7" 
                strokeLinecap="round" 
                fill="none" 
              />
              {/* Slow / Congested Area near destination */}
              <path 
                d="M 430 140 T 560 70" 
                stroke="#3B82F6" 
                strokeWidth="7" 
                strokeLinecap="round" 
                fill="none" 
              />
              {/* Incident Alert Road Blockade if active */}
              {activeIncident && (
                <g>
                  <path 
                    d="M 225 160 L 225 240" 
                    stroke="#EF4444" 
                    strokeWidth="9" 
                    strokeDasharray="6 4" 
                    strokeLinecap="round" 
                  />
                  <circle cx="225" cy="200" r="14" fill="#EF4444" opacity="0.9" />
                  <text x="225" y="204" fill="#FFF" fontSize="11" fontWeight="bold" textAnchor="middle">✕</text>
                </g>
              )}
            </g>
          )}

          {/* Active Navigation Delivery Path (Glowing Purple/Navy Route Line) */}
          <path 
            d="M 60 410 Q 180 370 280 260 T 490 95" 
            stroke="#2B2D42" 
            strokeWidth="8" 
            strokeLinecap="round" 
            fill="none" 
            opacity="0.3" 
          />
          <path 
            d="M 60 410 Q 180 370 280 260 T 490 95" 
            stroke="#6366F1" 
            strokeWidth="4.5" 
            strokeLinecap="round" 
            strokeDasharray="8 4" 
            fill="none" 
            className="animated-flow-line" 
          />

          {/* Street Name Typography Labels (as shown in reference mockup) */}
          <g fill={textColor} fontSize="10" fontWeight="600" letterSpacing="0.4px">
            {/* Jawaharlal Nehru Road (Vertical label) */}
            <text 
              x="215" 
              y="180" 
              transform="rotate(90, 215, 180)" 
              textAnchor="middle"
            >
              Jawaharlal Nehru Road
            </text>
            <text 
              x="215" 
              y="320" 
              transform="rotate(90, 215, 320)" 
              textAnchor="middle"
            >
              19th Avenue
            </text>
            <text 
              x="105" 
              y="220" 
              transform="rotate(90, 105, 220)" 
              textAnchor="middle"
            >
              18th Avenue
            </text>
            <text 
              x="370" 
              y="190" 
              transform="rotate(90, 370, 190)" 
              textAnchor="middle"
            >
              8th Avenue
            </text>
            
            {/* Horizontal Cross Streets */}
            <text x="320" y="55" textAnchor="middle">3rd Ave</text>
            <text x="140" y="145" textAnchor="middle">86th St</text>
            <text x="490" y="240" textAnchor="middle">46th Street</text>
            <text x="490" y="280" textAnchor="middle">47th Street</text>
            <text x="560" y="475" textAnchor="middle">53rd Ave</text>
            <text x="100" y="325" textAnchor="middle" fontSize="9" opacity="0.75">Police Training College</text>
          </g>

          {/* Pickup Waypoint Pin (Start Depot) */}
          <g transform="translate(60, 410)">
            <circle r="14" fill="#6366F1" opacity="0.2" className="pulse-ring" />
            <circle r="7" fill="#6366F1" stroke="#FFFFFF" strokeWidth="2" />
            <text y="-14" fill={isDarkMode ? "#FFF" : "#1E293B"} fontSize="9" fontWeight="bold" textAnchor="middle">Pickup Depot</text>
          </g>

          {/* Delivery Waypoint Pin (Target Destination with concentric rings) */}
          <g transform="translate(490, 95)">
            <circle r="20" fill="#2B2D42" opacity="0.15" />
            <circle r="13" fill="#2B2D42" opacity="0.3" className="pulse-ring-slow" />
            <circle r="7" fill="#2B2D42" stroke="#FFFFFF" strokeWidth="2" />
            <circle r="3.5" fill="#FFFFFF" />
            <text y="-14" fill={isDarkMode ? "#F8FAFC" : "#0F172A"} fontSize="10" fontWeight="bold" textAnchor="middle">
              {selectedPackage?.deliveryAddress || "3 Birrel Avenue"}
            </text>
          </g>

          {/* Moving Navigation Vehicle Marker with Direction Arrow (Exact Reference Look) */}
          <g transform={`translate(${navMarker.x}, ${navMarker.y})`}>
            {/* Outer soft shadow ring */}
            <circle r="22" fill="#2B2D42" opacity="0.22" />
            
            {/* Dark Circular Base */}
            <circle r="15" fill="#2B2D42" stroke="#FFFFFF" strokeWidth="2.5" />
            
            {/* Directional Navigation Compass / Arrow */}
            <g transform={`rotate(${navMarker.angle})`}>
              <polygon 
                points="0,-8 6,6 0,3 -6,6" 
                fill="#FFFFFF" 
              />
            </g>
          </g>
        </svg>
      </div>

      {/* Floating Navigation Prompt Card at Bottom (Matching Reference UI: "Turn left 3 Birrel Avenue 10 Mtr Left") */}
      <div className="floating-nav-card">
        <div className="nav-card-header">
          <div className="nav-turn-indicator">
            <CornerUpLeft size={16} className="nav-turn-icon" />
            <span className="nav-instruction-text">{currentStep.direction}</span>
          </div>
          <span className="nav-corner-bracket">⌝</span>
        </div>

        <div className="nav-card-body">
          <h3 className="nav-street-title">{currentStep.street}</h3>
          <div className="nav-distance-row">
            <span className="nav-loc-pin">📍</span>
            <span className="nav-distance-text">{currentStep.distance}</span>
            <span className="nav-eta-badge">{currentStep.eta}</span>
          </div>
        </div>
      </div>

    </div>
  );
}
