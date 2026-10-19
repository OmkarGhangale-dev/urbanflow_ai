import React, { useState } from 'react';
import { 
  Route as RouteIcon, 
  Package, 
  MapPin, 
  ClipboardList, 
  Mail, 
  Search, 
  Bell, 
  User, 
  MoreVertical, 
  X, 
  Warehouse, 
  Clock, 
  Truck, 
  Sparkles
} from 'lucide-react';

export default function LiveFleetDashboard({ deliveries, centers }) {
  const [activeDeliveryTab, setActiveDeliveryTab] = useState('delivering');
  const [selectedDeliveryId, setSelectedDeliveryId] = useState(deliveries[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Logistics Centers filters
  const [capacityFilterActive, setCapacityFilterActive] = useState(true);
  const [dayNightFilterActive, setDayNightFilterActive] = useState(false);
  const [isFacilityCardVisible, setIsFacilityCardVisible] = useState(true);

  // Filter deliveries based on tab and search query
  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesTab = 
      activeDeliveryTab === 'all' || 
      delivery.tab === activeDeliveryTab;
    
    const matchesSearch = 
      delivery.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.trackingNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.from.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delivery.to.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesTab && matchesSearch;
  });

  // Filter logistics centers based on filter pills
  const filteredCenters = centers.filter(center => {
    if (capacityFilterActive) {
      const capPct = parseInt(center.capacity);
      if (capPct <= 30) return false;
    }
    return true;
  });

  const selectedDelivery = deliveries.find(d => d.id === selectedDeliveryId) || filteredDeliveries[0];

  // Dynamic coordinates and path based on the selected delivery to make the map interactive
  const getMapData = () => {
    if (!selectedDelivery) return {
      polylinePoints: "470,450 550,410 600,350 680,300 770,330 850,250",
      truckLeft: "53%", truckTop: "56%",
      activeMarkerLeft: "62%", activeMarkerTop: "48%"
    };

    switch(selectedDelivery.id) {
      case 'DEL-101': // Sneakers
        return {
          polylinePoints: "470,450 550,410 600,350 680,300 770,330 850,250",
          truckLeft: "53%", truckTop: "56%",
          activeMarkerLeft: "62%", activeMarkerTop: "48%"
        };
      case 'DEL-102': // Macbook
        return {
          polylinePoints: "200,200 290,280 400,280 520,380 610,380 730,340",
          truckLeft: "36%", truckTop: "39%",
          activeMarkerLeft: "47%", activeMarkerTop: "19%"
        };
      case 'DEL-103': // Hoodies
        return {
          polylinePoints: "700,500 730,400 780,340 850,250",
          truckLeft: "71%", truckTop: "53%",
          activeMarkerLeft: "73%", activeMarkerTop: "34%"
        };
      case 'DEL-104': // Food Pack
        return {
          polylinePoints: "300,100 400,150 500,150 610,300",
          truckLeft: "55%", truckTop: "30%",
          activeMarkerLeft: "61%", activeMarkerTop: "75%"
        };
      case 'DEL-105': // Sony headphones
        return {
          polylinePoints: "100,500 200,450 290,280 470,190",
          truckLeft: "26%", truckTop: "50%",
          activeMarkerLeft: "29%", activeMarkerTop: "28%"
        };
      case 'DEL-106': // Office chair
        return {
          polylinePoints: "520,600 610,750 770,690 850,600",
          truckLeft: "70%", truckTop: "90%",
          activeMarkerLeft: "77%", activeMarkerTop: "69%"
        };
      default:
        return {
          polylinePoints: "470,450 550,410 600,350 680,300 770,330 850,250",
          truckLeft: "53%", truckTop: "56%",
          activeMarkerLeft: "62%", activeMarkerTop: "48%"
        };
    }
  };

  const mapData = getMapData();

  return (
    <div className="live-fleet-layout">
      
      {/* ================= TOP BAR ================= */}
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">
            <RouteIcon size={20} />
          </div>
          <strong>UrbanFlow</strong>
        </div>

        <nav className="top-navigation">
          <button title="Orders Dashboard">
            <Package size={19} />
          </button>
          <button className="active" title="Live Fleet Map">
            <MapPin size={19} />
          </button>
          <button title="Logistics Centers">
            <ClipboardList size={19} />
          </button>
          <button title="Messages">
            <Mail size={19} />
          </button>
        </nav>

        <div className="top-actions">
          <div className="track-search">
            <Search size={15} />
            <input 
              type="text" 
              placeholder="Track order / vehicle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <button className="top-button" title="Notifications">
            <Bell size={17} />
            <span className="notification-dot"></span>
          </button>

          <button className="top-button" title="User Profile">
            <User size={17} />
          </button>
        </div>
      </header>

      {/* ================= MAIN MAP AREA ================= */}
      <main className="map-area">
        
        <div className="city-map">
          {/* Graphical Roads Overlay */}
          <div className="road horizontal r1"></div>
          <div className="road horizontal r2"></div>
          <div className="road horizontal r3"></div>
          <div className="road vertical r4"></div>
          <div className="road vertical r5"></div>
          <div className="road vertical r6"></div>
          <div className="road diagonal r7"></div>
          <div className="road diagonal r8"></div>

          {/* CITY LABELS */}
          <span className="city-label label-golden">Golden Gate</span>
          <span className="city-label label-richmond">Richmond District</span>
          <span className="city-label label-mission">Mission</span>
          <span className="city-label label-twin">Twin Peaks</span>
          <span className="city-label label-sf">CITY CENTER</span>

          {/* STATIC DELIVERY LOCATIONS */}
          <div className="location-marker green m1" title="Richmond Warehouse"><Package size={13} /></div>
          <div className="location-marker green m2" title="Sunset Depot"><Package size={13} /></div>
          <div className="location-marker green m3" title="Embarcadero Hub"><Package size={13} /></div>
          <div className="location-marker green m4" title="Mission Center"><Package size={13} /></div>
          <div className="location-marker green m5" title="Bernal Heights Stop"><Package size={13} /></div>

          {/* ACTIVE DELIVERY MARKER */}
          <div 
            className="location-marker yellow active-marker" 
            style={{ left: mapData.activeMarkerLeft, top: mapData.activeMarkerTop }}
            title="Destination"
          >
            <Package size={13} />
          </div>

          {/* CURRENT VEHICLE */}
          <div 
            className="vehicle-marker" 
            style={{ 
              left: mapData.truckLeft, 
              top: mapData.truckTop,
              transition: 'left 0.8s ease-in-out, top 0.8s ease-in-out'
            }}
            title="Active Truck"
          >
            <Truck size={19} />
          </div>

          {/* MAP ROUTE PATH */}
          <svg className="map-route" viewBox="0 0 1100 700" preserveAspectRatio="none">
            <polyline
              points={mapData.polylinePoints}
              fill="none"
              stroke="#00f2fe"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ transition: 'all 0.8s ease-in-out' }}
            />
          </svg>

          {/* MAP CONTROLS */}
          <div className="map-controls-bottom">
            <button>+</button>
            <button>−</button>
          </div>
        </div>

        {/* ================= LEFT DELIVERY PANEL ================= */}
        <section className="delivery-panel">
          <div className="tabs">
            <button 
              className={activeDeliveryTab === 'delivering' ? 'selected' : ''} 
              onClick={() => setActiveDeliveryTab('delivering')}
            >
              Delivering
            </button>
            <button 
              className={activeDeliveryTab === 'received' ? 'selected' : ''} 
              onClick={() => setActiveDeliveryTab('received')}
            >
              Received
            </button>
            <button 
              className={activeDeliveryTab === 'all' ? 'selected' : ''} 
              onClick={() => setActiveDeliveryTab('all')}
            >
              All
            </button>
          </div>

          <div className="delivery-list">
            {filteredDeliveries.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--muted)', fontSize: '11px' }}>
                No active deliveries in this list.
              </div>
            ) : (
              filteredDeliveries.map((delivery) => (
                <div 
                  key={delivery.id} 
                  className={`delivery-card ${selectedDeliveryId === delivery.id ? 'active' : ''}`}
                  onClick={() => setSelectedDeliveryId(delivery.id)}
                >
                  <div className={`package-icon ${delivery.statusClass}`}>
                    <Package size={16} />
                  </div>

                  <div className="delivery-content">
                    <div className="delivery-title">
                      <strong>{delivery.title}</strong>
                      <button title="More options">
                        <MoreVertical size={14} />
                      </button>
                    </div>
                    <small>{delivery.trackingNo}</small>

                    <div className="delivery-route">
                      <div>
                        <span>From</span>
                        <strong>{delivery.from}</strong>
                      </div>
                      <div>
                        <span>Status</span>
                        <strong>{delivery.status}</strong>
                      </div>
                    </div>

                    <div className="delivery-bottom">
                      <div>
                        <span>To</span>
                        <strong>{delivery.to}</strong>
                      </div>
                      <div className="price">
                        {delivery.price}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* ================= RIGHT SEARCH/FACILITY PANEL ================= */}
        {isFacilityCardVisible && (
          <section className="facility-card">
            <div className="facility-header">
              <h2>Find Logistics Center</h2>
              <button onClick={() => setIsFacilityCardVisible(false)} title="Close Panel">
                <X size={16} />
              </button>
            </div>

            <div className="facility-filters">
              <button 
                className={dayNightFilterActive ? 'active' : ''}
                onClick={() => setDayNightFilterActive(!dayNightFilterActive)}
              >
                Day-and-night
              </button>
              
              <button 
                className={capacityFilterActive ? 'active' : ''}
                onClick={() => setCapacityFilterActive(!capacityFilterActive)}
              >
                Capacity &gt; 30%
                {capacityFilterActive && <X size={10} style={{ marginLeft: '4px' }} />}
              </button>
            </div>

            <div className="facility-list">
              {filteredCenters.map((center) => (
                <div key={center.id} className="facility">
                  <div className="facility-icon">
                    <Warehouse size={16} />
                  </div>
                  
                  <div className="facility-info">
                    <strong>{center.name}</strong>
                    <p>{center.address}</p>
                    
                    <div className="facility-meta">
                      <span className="time">
                        <Clock size={10} />
                        {center.timeLeft}
                      </span>
                      <span className="walk">
                        <Truck size={10} />
                        {center.duration}
                      </span>
                      <span className="capacity" style={{ marginLeft: 'auto', fontWeight: 'bold', color: parseInt(center.capacity) > 60 ? 'var(--orange)' : 'var(--green-dark)' }}>
                        Cap: {center.capacity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredCenters.length === 0 && (
                <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--muted)', fontSize: '11px' }}>
                  No logistics centers match the filter criteria.
                </div>
              )}
            </div>

            {/* AI RECOMMENDATION BOX */}
            <div className="ai-recommendation">
              <div className="ai-icon">
                <Sparkles size={13} />
              </div>
              <div>
                <strong>AI Recommendation</strong>
                <p>
                  {capacityFilterActive 
                    ? "Logistics Center A (Central) and Center C (Golden Gate) have optimized space profiles and low predicted grid congestion." 
                    : "Center A has the lowest predicted congestion and enough spare capacity."}
                </p>
              </div>
            </div>
          </section>
        )}
        
        {/* Toggle details drawer button if hidden */}
        {!isFacilityCardVisible && (
          <button 
            onClick={() => setIsFacilityCardVisible(true)}
            style={{
              position: 'absolute',
              right: '25px',
              top: '24px',
              zIndex: 19,
              background: 'var(--bg-card)',
              border: '1px solid var(--border-glow)',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0,0,0,0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: 'var(--accent-cyan)'
            }}
          >
            <Warehouse size={13} />
            Show Centers
          </button>
        )}

        {/* LIVE STATUS BAR */}
        <div className="live-status">
          <span className="live-dot"></span>
          <strong>LIVE</strong>
          <span>24 vehicles active</span>
        </div>

      </main>
    </div>
  );
}
