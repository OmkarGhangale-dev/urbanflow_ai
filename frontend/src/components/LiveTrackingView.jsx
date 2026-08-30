import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  Navigation, 
  MapPin, 
  Radio, 
  Battery, 
  Fuel, 
  Gauge, 
  Phone, 
  MessageSquare, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Sliders,
  Layers,
  ChevronRight
} from 'lucide-react';
import InteractiveMap from './InteractiveMap';

export default function LiveTrackingView({ isDarkMode, onCallDriver, onChatDriver, currencySymbol = '₹' }) {
  const [selectedVehicleId, setSelectedVehicleId] = useState('V01');
  const [vehicles, setVehicles] = useState([
    {
      id: 'V01',
      code: 'Truck V01 (MH-12-UF-01)',
      driver: 'Mr. Arjun Sharma',
      avatar: 'AS',
      status: 'En Route',
      statusClass: 'status-active',
      currentLocation: '3 Birrel Avenue, Pune',
      destination: 'Shivajinagar Express Hub',
      speed: '38 km/h',
      fuel: '84%',
      fuelVal: 84,
      battery: '98%',
      cargoWeight: '145 kg / 250 kg',
      currentPackage: 'BH-2017287528',
      eta: '11:15 AM (6 mins)',
      stopsCompleted: 2,
      totalStops: 4,
      route: ['Central Depot (D1)', '3 Birrel Avenue', 'Shivajinagar (L01)', 'Deccan (L02)', 'Central Depot (D1)']
    },
    {
      id: 'V02',
      code: 'Truck V02 (MH-12-UF-02)',
      driver: 'Mr. Ravi Deshmukh',
      avatar: 'RD',
      status: 'Dynamic Detour',
      statusClass: 'status-detour',
      currentLocation: 'Senapati Bapat Bypass',
      destination: 'Kothrud Medical Center',
      speed: '42 km/h',
      fuel: '68%',
      fuelVal: 68,
      battery: '92%',
      cargoWeight: '190 kg / 250 kg',
      currentPackage: 'BH-2017287532',
      eta: '11:40 AM (14 mins)',
      stopsCompleted: 1,
      totalStops: 3,
      route: ['Central Depot (D1)', 'Senapati Bapat Bypass', 'Kothrud Hospital (L03)', 'Central Depot (D1)']
    },
    {
      id: 'V03',
      code: 'Truck V03 (MH-12-UF-03)',
      driver: 'Mr. Sunil Patil',
      avatar: 'SP',
      status: 'En Route',
      statusClass: 'status-active',
      currentLocation: 'Koregaon Park Road',
      destination: 'Hadapsar Retail Mall',
      speed: '34 km/h',
      fuel: '91%',
      fuelVal: 91,
      battery: '99%',
      cargoWeight: '110 kg / 250 kg',
      currentPackage: 'BH-2017287533',
      eta: '12:05 PM (22 mins)',
      stopsCompleted: 3,
      totalStops: 5,
      route: ['East Depot (D2)', 'Koregaon Park (L07)', 'Hadapsar (L08)', 'East Depot (D2)']
    },
    {
      id: 'V04',
      code: 'Truck V04 (MH-12-UF-04)',
      driver: 'Mr. Kiran Jadhav',
      avatar: 'KJ',
      status: 'Standby / Loading',
      statusClass: 'status-idle',
      currentLocation: 'Central Pune Depot (D1)',
      destination: 'Aundh Industrial Link',
      speed: '0 km/h',
      fuel: '95%',
      fuelVal: 95,
      battery: '100%',
      cargoWeight: '0 kg / 250 kg',
      currentPackage: 'Scheduled Batch #04',
      eta: '12:30 PM Departure',
      stopsCompleted: 0,
      totalStops: 3,
      route: ['Central Depot (D1)', 'Aundh (L04)', 'Baner (L05)', 'Central Depot (D1)']
    }
  ]);

  const activeVehicle = vehicles.find(v => v.id === selectedVehicleId) || vehicles[0];

  return (
    <div className="live-tracking-view-container">
      
      {/* Top Header */}
      <div className="tracking-view-header">
        <div>
          <h1>Live Fleet Telemetry & GPS Tracking</h1>
          <p>Real-time vehicle positioning, speed telemetry, fuel levels, and dynamic corridor monitoring across Pune.</p>
        </div>

        <div className="fleet-quick-stats">
          <div className="quick-stat-item">
            <span className="stat-num">3 Active</span>
            <span className="stat-label">On Road</span>
          </div>
          <div className="quick-stat-item">
            <span className="stat-num">1 Standby</span>
            <span className="stat-label">Depot D1</span>
          </div>
          <div className="quick-stat-item green-glow">
            <span className="stat-num">100%</span>
            <span className="stat-label">GPS Health</span>
          </div>
        </div>
      </div>

      <div className="tracking-view-grid">
        
        {/* LEFT COLUMN: VEHICLES TELEMETRY LIST */}
        <div className="vehicles-telemetry-sidebar">
          <div className="sidebar-section-title">
            <span>ACTIVE FLEET CARRIERS</span>
            <span className="count-tag">{vehicles.length} Trucks</span>
          </div>

          <div className="vehicles-list-cards">
            {vehicles.map((v) => {
              const isSelected = v.id === activeVehicle.id;
              return (
                <div 
                  key={v.id} 
                  className={`vehicle-tracking-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedVehicleId(v.id)}
                >
                  <div className="vehicle-card-top">
                    <div className="vehicle-badge-pill">
                      <Truck size={15} />
                      <strong>{v.id}</strong>
                    </div>
                    <span className={`vehicle-live-status ${v.statusClass}`}>
                      {v.status}
                    </span>
                  </div>

                  <div className="vehicle-driver-info">
                    <strong className="vehicle-code-title">{v.code}</strong>
                    <span className="vehicle-driver-sub">Driver: {v.driver}</span>
                  </div>

                  <div className="vehicle-location-row">
                    <MapPin size={13} className="loc-icon" />
                    <span className="loc-text">{v.currentLocation}</span>
                  </div>

                  <div className="vehicle-telemetry-bar">
                    <div className="telemetry-chip">
                      <Gauge size={12} />
                      <span>{v.speed}</span>
                    </div>
                    <div className="telemetry-chip">
                      <Fuel size={12} />
                      <span>Fuel: {v.fuel}</span>
                    </div>
                    <div className="telemetry-chip eta">
                      <Clock size={12} />
                      <span>ETA: {v.eta.split(' ')[0]}</span>
                    </div>
                  </div>

                  <div className="vehicle-card-footer">
                    <span className="stops-progress">
                      Stops: <strong>{v.stopsCompleted}/{v.totalStops} Done</strong>
                    </span>
                    <ChevronRight size={16} className="arrow-icon" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT COLUMN: INTERACTIVE MAP & ACTIVE VEHICLE DASHBOARD */}
        <div className="active-vehicle-map-section">
          
          {/* Active Vehicle Floating Stats Ribbon */}
          <div className="active-vehicle-ribbon">
            <div className="ribbon-driver-col">
              <div className="ribbon-avatar">{activeVehicle.avatar}</div>
              <div>
                <h3>{activeVehicle.driver}</h3>
                <p>{activeVehicle.code} · Active Consignment #{activeVehicle.currentPackage}</p>
              </div>
            </div>

            <div className="ribbon-stats-group">
              <div className="ribbon-stat-item">
                <span className="r-label">Speed</span>
                <strong className="r-val">{activeVehicle.speed}</strong>
              </div>
              <div className="ribbon-stat-item">
                <span className="r-label">Fuel Level</span>
                <strong className="r-val green-text">{activeVehicle.fuel}</strong>
              </div>
              <div className="ribbon-stat-item">
                <span className="r-label">Payload</span>
                <strong className="r-val">{activeVehicle.cargoWeight}</strong>
              </div>
              <div className="ribbon-stat-item">
                <span className="r-label">Arrival ETA</span>
                <strong className="r-val blue-text">{activeVehicle.eta}</strong>
              </div>
            </div>

            <div className="ribbon-actions">
              <button 
                className="btn-ribbon call"
                onClick={() => onCallDriver(activeVehicle.driver)}
                title="Radio Call Driver"
              >
                <Phone size={15} />
                <span>Call</span>
              </button>
              <button 
                className="btn-ribbon chat"
                onClick={() => onChatDriver(activeVehicle.driver, activeVehicle.currentPackage)}
                title="Send Dispatch Message"
              >
                <MessageSquare size={15} />
                <span>Message</span>
              </button>
            </div>
          </div>

          {/* Map View */}
          <div className="tracking-map-wrapper">
            <InteractiveMap 
              selectedPackage={{
                deliveryAddress: activeVehicle.currentLocation
              }}
              isDarkMode={isDarkMode}
            />
          </div>

          {/* Turn-by-Turn Route Stepper for selected vehicle */}
          <div className="route-stepper-panel">
            <h4>Live Delivery Corridor Milestones for {activeVehicle.id}</h4>
            <div className="milestones-horizontal-stepper">
              {activeVehicle.route.map((stop, idx) => {
                const isPassed = idx <= activeVehicle.stopsCompleted;
                const isCurrent = idx === activeVehicle.stopsCompleted;

                return (
                  <div key={idx} className={`milestone-step ${isPassed ? 'passed' : ''} ${isCurrent ? 'current' : ''}`}>
                    <div className="step-marker">
                      {isPassed ? <CheckCircle2 size={14} /> : <span>{idx + 1}</span>}
                    </div>
                    <div className="step-text">
                      <strong>{stop}</strong>
                      <span className="step-sub">{isCurrent ? 'Approaching Now' : isPassed ? 'Completed' : 'Pending Drop'}</span>
                    </div>
                    {idx < activeVehicle.route.length - 1 && <div className="step-connector"></div>}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
