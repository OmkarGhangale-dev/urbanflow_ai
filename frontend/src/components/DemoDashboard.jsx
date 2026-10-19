import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Truck, 
  Package, 
  AlertTriangle, 
  RotateCcw, 
  Play, 
  Compass, 
  TrendingUp, 
  Clock, 
  MapPin, 
  ArrowRight,
  Sliders,
  CheckCircle2
} from 'lucide-react';
import { 
  resetDemoScenario, 
  optimizeRoutes, 
  createTrafficIncident, 
  reoptimizeRoutes 
} from '../api';

const COORDS = {
  D1: { x: 400, y: 320, name: "Central Depot (D1)", type: "depot" },
  D2: { x: 600, y: 220, name: "East Depot (D2)", type: "depot" },
  L01: { x: 350, y: 240, name: "Shivajinagar (L01)", type: "delivery", priority: "high" },
  L02: { x: 320, y: 350, name: "Deccan (L02)", type: "delivery", priority: "normal" },
  L03: { x: 160, y: 410, name: "Kothrud (L03)", type: "delivery", priority: "critical" },
  L04: { x: 180, y: 110, name: "Aundh (L04)", type: "delivery", priority: "normal" },
  L05: { x: 60, y: 130, name: "Baner (L05)", type: "delivery", priority: "low" },
  L06: { x: 700, y: 80, name: "Viman Nagar (L06)", type: "delivery", priority: "normal" },
  L07: { x: 530, y: 180, name: "Koregaon Park (L07)", type: "delivery", priority: "high" },
  L08: { x: 740, y: 380, name: "Hadapsar (L08)", type: "delivery", priority: "normal" }
};

const VEHICLE_COLORS = {
  V01: { stroke: "#00f2fe", glow: "rgba(0, 242, 254, 0.4)" },
  V02: { stroke: "#a855f7", glow: "rgba(168, 85, 247, 0.4)" },
  V03: { stroke: "#eab308", glow: "rgba(234, 179, 8, 0.4)" },
  V04: { stroke: "#ec4899", glow: "rgba(236, 72, 153, 0.4)" },
  V05: { stroke: "#10b981", glow: "rgba(16, 185, 129, 0.4)" }
};

export default function DemoDashboard() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Optimizer Config Weights
  const [weights, setWeights] = useState({
    distance: 1.0,
    traffic: 2.5,
    priority: 10.0,
    utilization: 5.0
  });

  // Data Store
  const [vehicles, setVehicles] = useState([]);
  const [orders, setOrders] = useState([]);
  const [baselineData, setBaselineData] = useState(null);
  const [reoptimizedData, setReoptimizedData] = useState(null);
  const [trafficIncidentActive, setTrafficIncidentActive] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Load Seed / Reset Scenario
  const handleReset = async () => {
    setLoading(true);
    setError('');
    setReoptimizedData(null);
    setBaselineData(null);
    setTrafficIncidentActive(false);
    setSelectedVehicle(null);
    try {
      const data = await resetDemoScenario();
      setVehicles([
        { vehicle_code: "V01", capacity: 100.0, current_location: "D1" },
        { vehicle_code: "V02", capacity: 80.0, current_location: "D1" },
        { vehicle_code: "V03", capacity: 120.0, current_location: "D2" }
      ]);
      setOrders([
        { order_code: "O01", delivery_location: "L01", weight: 20.0, priority: "high" },
        { order_code: "O02", delivery_location: "L02", weight: 30.0, priority: "normal" },
        { order_code: "O03", delivery_location: "L03", weight: 15.0, priority: "critical" },
        { order_code: "O04", delivery_location: "L04", weight: 40.0, priority: "normal" },
        { order_code: "O05", delivery_location: "L07", weight: 25.0, priority: "high" }
      ]);
      
      // Auto-populate baseline if backend seeded it
      if (data.baseline_routes) {
        setBaselineData({
          routes: data.baseline_routes,
          metrics: data.baseline_metrics
        });
      }
      setStep(2);
    } catch (err) {
      setError(err.message || 'Failed to seed demo scenario');
    } finally {
      setLoading(false);
    }
  };

  // Run Baseline Optimize
  const handleOptimize = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await optimizeRoutes(weights);
      setBaselineData(data);
      setStep(3);
    } catch (err) {
      setError(err.message || 'Optimization failed');
    } finally {
      setLoading(false);
    }
  };

  // Simulate Traffic Incident
  const handleSimulateIncident = async () => {
    setLoading(true);
    setError('');
    try {
      // D2 -> L04 severe congestion (affects V03 route)
      await createTrafficIncident("D2", "L04", "severe");
      setTrafficIncidentActive(true);
      setStep(4);
    } catch (err) {
      setError(err.message || 'Incident simulation failed');
    } finally {
      setLoading(false);
    }
  };

  // Run Re-Optimization
  const handleReoptimize = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await reoptimizeRoutes(weights);
      setReoptimizedData(data);
      setStep(5);
    } catch (err) {
      setError(err.message || 'Re-optimization failed');
    } finally {
      setLoading(false);
    }
  };

  // Reset demo back to beginning
  const restartDemo = () => {
    setStep(1);
    setBaselineData(null);
    setReoptimizedData(null);
    setTrafficIncidentActive(false);
    setSelectedVehicle(null);
  };

  // Midpoint calculation for the warning incident
  const incidentMid = {
    x: (COORDS.D2.x + COORDS.L04.x) / 2,
    y: (COORDS.D2.y + COORDS.L04.y) / 2
  };

  const activeRoutes = reoptimizedData ? reoptimizedData.routes : (baselineData ? baselineData.routes : []);
  const activeMetrics = reoptimizedData ? reoptimizedData.metrics : (baselineData ? baselineData.metrics : null);

  return (
    <div className="orders-dashboard-layout" style={{ gridTemplateColumns: '320px 1fr 340px' }}>
      
      {/* ================= COLUMN 1: CONTROL PANEL ================= */}
      <section className="orders-panel" style={{ padding: '20px' }}>
        <div className="panel-header" style={{ marginBottom: '15px' }}>
          <div>
            <h1 style={{ fontSize: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={20} className="text-yellow" style={{ color: 'var(--orange)' }} />
              Demo Center
            </h1>
            <p>One-click logic validation flow</p>
          </div>
        </div>

        {/* STEP-BY-STEP FLOW */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flex: 1, overflowY: 'auto' }}>
          
          {/* STEP 1: LOAD SCENARIO */}
          <div className={`order-card ${step === 1 ? 'selected' : ''}`} style={{ opacity: step >= 1 ? 1 : 0.4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="status green" style={{ fontSize: '9px' }}>Step 1</span>
              {step > 1 && <CheckCircle2 size={14} style={{ color: 'var(--green)' }} />}
            </div>
            <h3 style={{ margin: '6px 0 3px 0', fontSize: '12px' }}>Load Seed Scenario</h3>
            <p style={{ fontSize: '10px', color: 'var(--text-gray)', marginBottom: '8px' }}>
              Reset SQLite DB and seed V01-V03 and orders O01-O04.
            </p>
            {step === 1 && (
              <button 
                className="filter-btn" 
                style={{ width: '100%', justifyContent: 'center', background: 'var(--accent-indigo)' }}
                onClick={handleReset}
                disabled={loading}
              >
                {loading ? 'Seeding...' : 'Load Scenario'}
              </button>
            )}
          </div>

          {/* STEP 2: RUN BASELINE OPTIMIZATION */}
          <div className={`order-card ${step === 2 ? 'selected' : ''}`} style={{ opacity: step >= 2 ? 1 : 0.4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="status green" style={{ fontSize: '9px' }}>Step 2</span>
              {step > 2 && <CheckCircle2 size={14} style={{ color: 'var(--green)' }} />}
            </div>
            <h3 style={{ margin: '6px 0 3px 0', fontSize: '12px' }}>Run Optimization</h3>
            <p style={{ fontSize: '10px', color: 'var(--text-gray)', marginBottom: '8px' }}>
              Solve multi-depot routing using OR-Tools under clear conditions.
            </p>
            {step === 2 && (
              <button 
                className="filter-btn" 
                style={{ width: '100%', justifyContent: 'center', background: 'var(--accent-indigo)' }}
                onClick={handleOptimize}
                disabled={loading}
              >
                {loading ? 'Optimizing...' : 'Calculate Routes'}
              </button>
            )}
          </div>

          {/* STEP 3: SIMULATE TRAFFIC INCIDENT */}
          <div className={`order-card ${step === 3 ? 'selected' : ''}`} style={{ opacity: step >= 3 ? 1 : 0.4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="status green" style={{ fontSize: '9px' }}>Step 3</span>
              {step > 3 && <CheckCircle2 size={14} style={{ color: 'var(--green)' }} />}
            </div>
            <h3 style={{ margin: '6px 0 3px 0', fontSize: '12px' }}>Simulate Incident</h3>
            <p style={{ fontSize: '10px', color: 'var(--text-gray)', marginBottom: '8px' }}>
              Register SEVERE traffic incident on path between D2 (East Depot) and L04 (Aundh).
            </p>
            {step === 3 && (
              <button 
                className="filter-btn" 
                style={{ width: '100%', justifyContent: 'center', background: 'var(--red)', color: 'white' }}
                onClick={handleSimulateIncident}
                disabled={loading}
              >
                {loading ? 'Injecting...' : 'Trigger Incident'}
              </button>
            )}
          </div>

          {/* STEP 4: RE-OPTIMIZE */}
          <div className={`order-card ${step === 4 ? 'selected' : ''}`} style={{ opacity: step >= 4 ? 1 : 0.4 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="status green" style={{ fontSize: '9px' }}>Step 4</span>
              {step > 4 && <CheckCircle2 size={14} style={{ color: 'var(--green)' }} />}
            </div>
            <h3 style={{ margin: '6px 0 3px 0', fontSize: '12px' }}>Dynamic Rerouting</h3>
            <p style={{ fontSize: '10px', color: 'var(--text-gray)', marginBottom: '8px' }}>
              Trigger re-optimization. Compare baseline vs new congestion-aware routes.
            </p>
            {step === 4 && (
              <button 
                className="filter-btn" 
                style={{ width: '100%', justifyContent: 'center', background: 'var(--accent-indigo)' }}
                onClick={handleReoptimize}
                disabled={loading}
              >
                {loading ? 'Re-routing...' : 'Re-Optimize Routes'}
              </button>
            )}
          </div>

          {/* RESTART */}
          {step > 4 && (
            <button 
              className="filter-btn" 
              style={{ width: '100%', justifyContent: 'center', marginTop: '10px', border: '1px solid var(--border-light)' }}
              onClick={restartDemo}
            >
              <RotateCcw size={13} style={{ marginRight: '6px' }} />
              Reset Demo
            </button>
          )}

          {error && (
            <div style={{ color: 'var(--red)', fontSize: '11px', background: 'var(--red-glow)', border: '1px solid rgba(244,63,94,0.15)', padding: '10px', borderRadius: '8px', marginTop: '10px' }}>
              <strong>Error: </strong> {error}
            </div>
          )}
        </div>

        {/* SLIDERS FOR WEIGHTS CONFIG */}
        <div style={{ borderTop: '1px solid var(--border-glow)', paddingTop: '15px', marginTop: '15px' }}>
          <h3 style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-white)', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <Sliders size={12} style={{ color: 'var(--accent-cyan)' }} />
            Objective Weights
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '10px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span style={{ color: 'var(--text-slate)' }}>Distance Weight</span>
                <strong style={{ color: 'var(--accent-cyan)' }}>{weights.distance.toFixed(1)}</strong>
              </div>
              <input 
                type="range" min="0.1" max="5" step="0.1" 
                value={weights.distance} 
                onChange={(e) => setWeights({ ...weights, distance: parseFloat(e.target.value) })}
                style={{ width: '100%', height: '3px', accentColor: 'var(--accent-indigo)' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span style={{ color: 'var(--text-slate)' }}>Traffic Cost Weight</span>
                <strong style={{ color: 'var(--orange)' }}>{weights.traffic.toFixed(1)}</strong>
              </div>
              <input 
                type="range" min="0.5" max="10" step="0.5" 
                value={weights.traffic} 
                onChange={(e) => setWeights({ ...weights, traffic: parseFloat(e.target.value) })}
                style={{ width: '100%', height: '3px', accentColor: 'var(--accent-indigo)' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span style={{ color: 'var(--text-slate)' }}>Priority Urgency Weight</span>
                <strong style={{ color: 'var(--red)' }}>{weights.priority.toFixed(1)}</strong>
              </div>
              <input 
                type="range" min="1" max="25" step="1" 
                value={weights.priority} 
                onChange={(e) => setWeights({ ...weights, priority: parseFloat(e.target.value) })}
                style={{ width: '100%', height: '3px', accentColor: 'var(--accent-indigo)' }}
              />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                <span style={{ color: 'var(--text-slate)' }}>Utilization Weight</span>
                <strong style={{ color: 'var(--green)' }}>{weights.utilization.toFixed(1)}</strong>
              </div>
              <input 
                type="range" min="1" max="20" step="1" 
                value={weights.utilization} 
                onChange={(e) => setWeights({ ...weights, utilization: parseFloat(e.target.value) })}
                style={{ width: '100%', height: '3px', accentColor: 'var(--accent-indigo)' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= COLUMN 2: CITY MAP ================= */}
      <section style={{ position: 'relative', display: 'flex', flexDirection: 'column', height: '100%', background: 'var(--bg-dark)' }}>
        
        {/* TOP STATUS BAR */}
        <div style={{ padding: '15px 25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-glow)', background: 'var(--bg-panel)', zIndex: 10 }}>
          <div>
            <h2 style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-white)' }}>Pune Logistics Hub</h2>
            <span style={{ fontSize: '10px', color: 'var(--text-gray)' }}>Real-time coordinate routing map</span>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <span className="blue-badge" style={{ padding: '4px 8px', fontSize: '9px' }}>
              Scale: 1:1 Haversine
            </span>
            <span className="live-status" style={{ position: 'static' }}>
              <span className="live-dot"></span>
              <strong>ACTIVE</strong>
            </span>
          </div>
        </div>

        {/* MAP CANVAS */}
        <div className="city-map" style={{ flex: 1, position: 'relative', overflow: 'hidden', cursor: 'grab', background: '#0b111e' }}>
          
          {/* Roads Backdrop */}
          <div className="road horizontal" style={{ top: '35%', left: 0, width: '100%', height: '1px', opacity: 0.2 }}></div>
          <div className="road horizontal" style={{ top: '65%', left: 0, width: '100%', height: '1px', opacity: 0.2 }}></div>
          <div className="road vertical" style={{ left: '25%', top: 0, height: '100%', width: '1px', opacity: 0.2 }}></div>
          <div className="road vertical" style={{ left: '55%', top: 0, height: '100%', width: '1px', opacity: 0.2 }}></div>
          <div className="road diagonal" style={{ transform: 'rotate(15deg)', width: '120%', left: '-10%', top: '40%', opacity: 0.1 }}></div>
          
          <svg style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
            {/* Draw base routes (old routes) as dashed faint grey line if reoptimized exists */}
            {reoptimizedData && reoptimizedData.changes && reoptimizedData.changes.map((change, idx) => {
              const colorConfig = VEHICLE_COLORS[change.vehicle_code] || { stroke: "#7f92b0" };
              return (
                <polyline
                  key={`old-route-${idx}`}
                  points={change.old_route.map(loc => {
                    const c = COORDS[loc];
                    return c ? `${c.x},${c.y}` : "";
                  }).filter(Boolean).join(" ")}
                  fill="none"
                  stroke={colorConfig.stroke}
                  strokeWidth="2.5"
                  strokeDasharray="4,6"
                  opacity="0.35"
                />
              );
            })}

            {/* Draw active routes */}
            {activeRoutes.map((routeRes, idx) => {
              const vehicleCode = routeRes.vehicle_code;
              const colorConfig = VEHICLE_COLORS[vehicleCode] || { stroke: "#00f2fe" };
              const isSelected = selectedVehicle === vehicleCode;
              
              return (
                <polyline
                  key={`route-${idx}`}
                  points={routeRes.route.map(loc => {
                    const c = COORDS[loc];
                    return c ? `${c.x},${c.y}` : "";
                  }).filter(Boolean).join(" ")}
                  fill="none"
                  stroke={colorConfig.stroke}
                  strokeWidth={isSelected ? "5" : "3.5"}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray="6,6"
                  style={{
                    filter: isSelected ? `drop-shadow(0 0 8px ${colorConfig.stroke})` : 'none',
                    opacity: selectedVehicle ? (isSelected ? 1.0 : 0.2) : 0.85,
                    transition: 'all 0.4s ease',
                    animation: 'dashFlow 30s linear infinite'
                  }}
                  onClick={() => setSelectedVehicle(vehicleCode)}
                />
              );
            })}

            {/* Draw traffic incident connector line if active */}
            {trafficIncidentActive && (
              <line
                x1={COORDS.D2.x}
                y1={COORDS.D2.y}
                x2={COORDS.L04.x}
                y2={COORDS.L04.y}
                stroke="var(--red)"
                strokeWidth="4"
                strokeDasharray="2,3"
                style={{ opacity: 0.85 }}
              />
            )}
          </svg>

          {/* Pulsating Traffic Beacon on the Map */}
          {trafficIncidentActive && (
            <div 
              style={{
                position: 'absolute',
                left: `${incidentMid.x}px`,
                top: `${incidentMid.y}px`,
                transform: 'translate(-50%, -50%)',
                zIndex: 100
              }}
            >
              {/* Ripple Animation */}
              <div 
                style={{
                  position: 'absolute',
                  width: '32px',
                  height: '32px',
                  background: 'rgba(244, 63, 94, 0.25)',
                  border: '1.5px solid var(--red)',
                  borderRadius: '50%',
                  transform: 'translate(-50%, -50%)',
                  animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite'
                }}
              />
              <div 
                style={{
                  background: 'var(--bg-dark)',
                  border: '2px solid var(--red)',
                  color: 'var(--red)',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 15px rgba(244, 63, 94, 0.6)',
                  transform: 'translate(-50%, -50%)',
                  cursor: 'pointer'
                }}
                title="Traffic Block: D2 -> L04"
              >
                <AlertTriangle size={12} />
              </div>
            </div>
          )}

          {/* Render Location Nodes */}
          {Object.entries(COORDS).map(([code, loc]) => {
            const isDepot = loc.type === 'depot';
            const priorityColors = {
              critical: 'var(--red)',
              high: 'var(--orange)',
              normal: 'var(--accent-indigo)',
              low: 'var(--green)'
            };

            const nodeColor = isDepot ? 'var(--accent-cyan)' : (priorityColors[loc.priority] || 'var(--text-gray)');
            
            return (
              <div
                key={code}
                style={{
                  position: 'absolute',
                  left: `${loc.x}px`,
                  top: `${loc.y}px`,
                  transform: 'translate(-50%, -50%)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  cursor: 'pointer',
                  zIndex: 20
                }}
              >
                <div
                  style={{
                    width: isDepot ? '22px' : '16px',
                    height: isDepot ? '22px' : '16px',
                    borderRadius: isDepot ? '6px' : '50%',
                    background: isDepot ? 'var(--bg-card)' : nodeColor,
                    border: `2px solid ${nodeColor}`,
                    boxShadow: `0 0 10px ${nodeColor}80`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isDepot ? 'var(--accent-cyan)' : 'white',
                    fontSize: '9px',
                    fontWeight: 'bold',
                    transition: 'transform 0.2s'
                  }}
                  className="map-node-hover"
                  title={`${loc.name} (${code})`}
                >
                  {isDepot ? 'D' : code.replace('L0', '')}
                </div>
                <span
                  style={{
                    fontSize: '8px',
                    color: 'var(--text-slate)',
                    background: 'rgba(7, 9, 14, 0.85)',
                    padding: '2px 4px',
                    borderRadius: '4px',
                    marginTop: '4px',
                    border: '1px solid var(--border-glow)',
                    whiteSpace: 'nowrap',
                    fontWeight: 600
                  }}
                >
                  {code}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= COLUMN 3: RESULTS PANEL ================= */}
      <section className="details-panel" style={{ padding: '20px', background: 'var(--bg-panel)' }}>
        
        {/* HEADER SECTION */}
        <div className="details-header" style={{ marginBottom: '15px' }}>
          <h2>Optimization Results</h2>
        </div>

        {/* ERROR / EMPTY STATE */}
        {!baselineData && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '80%', alignItems: 'center', justifyContent: 'center', color: 'var(--text-gray)', textAlign: 'center', gap: '8px' }}>
            <Compass size={36} className="text-gray" style={{ opacity: 0.3 }} />
            <span style={{ fontSize: '11px' }}>
              Load scenario and click calculate routes to execute the OR-Tools optimization.
            </span>
          </div>
        )}

        {/* METRICS CARD GRID */}
        {baselineData && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            
            {/* GLOBAL STATS CARD */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-glow)', padding: '12px', borderRadius: '10px' }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-gray)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <TrendingUp size={11} style={{ color: 'var(--accent-cyan)' }} />
                Global System Metrics
              </div>

              {/* Rerouted stats comparing before/after */}
              {reoptimizedData ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
                    <span>Total Distance:</span>
                    <strong style={{ color: 'var(--text-white)' }}>
                      {reoptimizedData.global_metrics_change.old_total_distance_km} km
                      <ArrowRight size={10} style={{ margin: '0 4px', display: 'inline' }} />
                      <span style={{ color: 'var(--orange)' }}>
                        {reoptimizedData.global_metrics_change.new_total_distance_km} km
                      </span>
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
                    <span>Distance Change:</span>
                    <strong style={{ color: reoptimizedData.global_metrics_change.distance_change_km > 0 ? 'var(--orange)' : 'var(--green)' }}>
                      {reoptimizedData.global_metrics_change.distance_change_km > 0 ? '+' : ''}
                      {reoptimizedData.global_metrics_change.distance_change_km} km
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
                    <span>UrbanFlow Score:</span>
                    <strong>
                      {reoptimizedData.global_metrics_change.old_total_cost}
                      <ArrowRight size={10} style={{ margin: '0 4px', display: 'inline' }} />
                      <span style={{ color: 'var(--orange)' }}>{reoptimizedData.global_metrics_change.new_total_cost}</span>
                    </strong>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
                    <span>Total Distance:</span>
                    <strong style={{ color: 'var(--text-white)' }}>{baselineData.metrics.total_distance_km} km</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
                    <span>Vehicles Used:</span>
                    <strong style={{ color: 'var(--accent-cyan)' }}>
                      {baselineData.metrics.vehicles_used} / {baselineData.metrics.vehicles_available}
                    </strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
                    <span>Capacity Util:</span>
                    <strong style={{ color: 'var(--green)' }}>{baselineData.metrics.fleet_utilization_pct}%</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
                    <span>SLA Critical Served:</span>
                    <strong style={{ color: 'var(--red)' }}>{baselineData.metrics.critical_orders_served}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
                    <span>UrbanFlow Score:</span>
                    <strong style={{ color: 'var(--accent-indigo)' }}>{baselineData.metrics.total_cost}</strong>
                  </div>
                </div>
              )}
            </div>

            {/* VEHICLE ROUTE LIST CARD */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ fontSize: '10px', textTransform: 'uppercase', color: 'var(--text-gray)', paddingLeft: '4px' }}>
                Vehicle Routes List
              </div>
              
              {activeRoutes.map((routeRes, idx) => {
                const colorConfig = VEHICLE_COLORS[routeRes.vehicle_code] || { stroke: "#00f2fe" };
                const isSelected = selectedVehicle === routeRes.vehicle_code;
                
                return (
                  <div 
                    key={routeRes.vehicle_code}
                    onClick={() => setSelectedVehicle(routeRes.vehicle_code)}
                    style={{
                      background: 'var(--bg-card)',
                      border: isSelected ? `1.5px solid ${colorConfig.stroke}` : '1.5px solid var(--border-glow)',
                      padding: '10px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      boxShadow: isSelected ? `0 0 12px ${colorConfig.stroke}1c` : 'none',
                      transition: 'all 0.25s'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <strong style={{ fontSize: '11px', color: 'var(--text-white)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Truck size={12} style={{ color: colorConfig.stroke }} />
                        {routeRes.vehicle_code}
                      </strong>
                      <span className="status green" style={{ fontSize: '8px', background: 'rgba(16,185,129,0.1)', color: 'var(--green)', border: '1px solid rgba(16,185,129,0.2)' }}>
                        Util: {routeRes.utilization_pct}%
                      </span>
                    </div>

                    <div style={{ fontSize: '10px', color: 'var(--text-slate)', marginBottom: '4px' }}>
                      Route: <strong style={{ color: 'var(--accent-cyan)' }}>{routeRes.route.join(' → ')}</strong>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', color: 'var(--text-gray)' }}>
                      <span>Distance: {routeRes.distance_km} km</span>
                      <span>Score: {routeRes.urbanflow_score}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* DYNAMIC EXPLANATION CONTAINER */}
            <div className="ai-recommendation" style={{ margin: 0, border: '1px solid var(--border-glow)', background: 'rgba(99, 102, 241, 0.05)' }}>
              <div className="ai-icon" style={{ background: 'linear-gradient(135deg, var(--accent-indigo) 0%, var(--accent-cyan) 100%)' }}>
                <Sparkles size={13} style={{ color: 'white' }} />
              </div>
              <div style={{ flex: 1 }}>
                <strong style={{ fontSize: '11px', color: 'var(--text-white)', display: 'block', marginBottom: '4px' }}>
                  Why did UrbanFlow route this way?
                </strong>
                
                {/* Rerouted explanations take priority */}
                {reoptimizedData && reoptimizedData.changes && reoptimizedData.changes.length > 0 ? (
                  <div style={{ fontSize: '10px', lineHeight: '1.4', color: 'var(--text-slate)' }}>
                    {reoptimizedData.changes.map((change, idx) => (
                      <p key={idx} style={{ marginBottom: idx > 0 ? '8px' : 0 }}>
                        • {change.reason}
                      </p>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '10px', lineHeight: '1.4', color: 'var(--text-slate)' }}>
                    {selectedVehicle ? (
                      activeRoutes.find(r => r.vehicle_code === selectedVehicle)?.optimization_reason ||
                      "Select a vehicle to read its specific spatial routing reason."
                    ) : (
                      "Click on a route card above to view the OR-Tools optimization explanation for that specific vehicle."
                    )}
                  </p>
                )}
              </div>
            </div>

          </div>
        )}

      </section>
    </div>
  );
}
