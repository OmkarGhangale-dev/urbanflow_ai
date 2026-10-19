import React, { useState, useEffect, useRef } from 'react';
import {
  Brain, Leaf, Zap, Scale, CheckCircle2, ChevronRight,
  AlertTriangle, Truck, MapPin, Plus, Clock, Droplets, Package,
  ArrowRight, Send, Star, Info, Navigation, RefreshCw, TrendingUp,
  MousePointerClick, Sparkles, Route, BarChart3, DollarSign,
  Timer, Gauge, ShieldCheck, Activity, ChevronDown, Loader2,
  PackageCheck, AlertCircle, Lightbulb, TreePine, Flame
} from 'lucide-react';
import { getAIRouteOptions, getAIScenarioAnalysis } from '../api';

// Vehicle capacity data
const VEHICLE_CAPACITY = [
  { id: 'V01', driver: 'Mr. Arjun Sharma',  plate: 'MH-12-UF-01', totalCap: 600, used: 520, route: 'Depot D1 → Shivajinagar → Deccan', stops: ['Shivajinagar', 'Deccan'], status: 'In-transit' },
  { id: 'V02', driver: 'Mr. Ravi Deshmukh', plate: 'MH-12-UF-02', totalCap: 600, used: 460, route: 'Depot D1 → FC Road → Koregaon', stops: ['FC Road', 'Koregaon Park'], status: 'In-transit' },
  { id: 'V03', driver: 'Mr. Sunil Patil',   plate: 'MH-12-UF-03', totalCap: 600, used: 310, route: 'Depot D2 → Kothrud → Paud', stops: ['Kothrud', 'Paud Road'], status: 'In-transit' },
  { id: 'V04', driver: 'Mr. Kiran Jadhav',  plate: 'MH-12-UF-04', totalCap: 600, used: 210, route: 'Depot D2 → Viman Nagar → Hadapsar', stops: ['Viman Nagar', 'Hadapsar'], status: 'Active' },
];

function findCompatibleVehicles(formData) {
  const weight = parseFloat(formData.weight) || 25;
  return VEHICLE_CAPACITY.map(v => {
    const remaining = v.totalCap - v.used;
    const canFit = remaining >= weight;
    const pct = Math.round((remaining / v.totalCap) * 100);
    return { ...v, remaining, canFit, pct };
  }).filter(v => v.status !== 'Completed');
}

const iconMap = {
  leaf: <Leaf size={20} />,
  zap: <Zap size={20} />,
  scale: <Scale size={20} />,
};
const colorMap = { green: 'var(--green-text)', blue: 'var(--blue-text)', purple: 'var(--purple-text)' };
const bgMap = { green: 'var(--green-bg)', blue: 'var(--blue-bg)', purple: 'var(--purple-bg)' };

// ─── Status dot for the header ─────────────────────────────────────────────
function StatusDot({ mode, isLoading }) {
  if (isLoading) return <div className="aip-status-dot aip-status-loading"><Loader2 size={10} className="spin-anim" /> Processing</div>;
  if (mode === 'idle') return <div className="aip-status-dot aip-status-live">LIVE</div>;
  if (mode === 'consignment-detail') return <div className="aip-status-dot aip-status-active">AI Ready</div>;
  if (mode === 'newconsignment') return <div className="aip-status-dot aip-status-active">Analyzing</div>;
  if (mode === 'scenario') return <div className="aip-status-dot aip-status-active">Re-Routing</div>;
  return <div className="aip-status-dot aip-status-live">LIVE</div>;
}

// ─── Subtitle text based on mode ────────────────────────────────────────────
function panelSubtitle(mode, isLoading) {
  if (isLoading) return 'AI is thinking — generating intelligent route options…';
  switch (mode) {
    case 'idle': return 'Select a consignment to see AI route reasoning';
    case 'consignment-detail': return 'AI explanation — why this route was chosen';
    case 'newconsignment': return 'AI calculating optimal dispatch options for new consignment';
    case 'scenario': return 'AI analyzing disruption & generating re-routing plans';
    default: return 'Real-time route optimization insights';
  }
}

export default function AIExplainPanel({
  mode = 'idle',
  selectedConsignment = null,
  newConsignmentData = null,
  scenarioData = null,
  packages = [],
  onPushToDriver,
  onSelectRoute,
  isDarkMode
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [pushed, setPushed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [aiRouteOptions, setAiRouteOptions] = useState(null);
  const [aiScenarioResult, setAiScenarioResult] = useState(null);
  const [aiPowered, setAiPowered] = useState(false);
  const [error, setError] = useState(null);
  const prevModeRef = useRef(null);
  const prevDataRef = useRef(null);

  // Reset when mode/data changes
  useEffect(() => {
    const dataKey = JSON.stringify({ mode, newConsignmentData, scenarioData });
    if (dataKey === prevDataRef.current) return;
    prevDataRef.current = dataKey;

    setSelectedOption(null);
    setPushed(false);
    setError(null);

    // ── Fetch AI route options when new consignment data arrives ────────────
    if (mode === 'newconsignment' && newConsignmentData) {
      setIsLoading(true);
      setAiRouteOptions(null);
      getAIRouteOptions(newConsignmentData)
        .then(res => {
          setAiRouteOptions(res.options);
          setAiPowered(res.ai_powered);
        })
        .catch(err => {
          setError('Could not reach AI. Showing calculated estimates.');
          // Fallback: compute locally
          const w = parseFloat(newConsignmentData.weight) || 25;
          const dest = newConsignmentData.deliveryAddress || 'Destination';
          const cat = newConsignmentData.category || 'General';
          setAiRouteOptions([
            {
              id: 'eco', label: 'Option A: Cost-Effective Route', badge: 'Most Cost Effective',
              badgeColor: 'green', icon: 'leaf', cost: `₹${(w * 14).toLocaleString()}`,
              time: `${Math.round(w * 0.6 + 38)} mins`, distance: `${(w * 0.18 + 22).toFixed(1)} km`,
              fuel: `${(w * 0.08 + 3.2).toFixed(1)} L`, sla: '98%', co2: `${(w * 0.04 + 1.2).toFixed(1)} kg saved`,
              route: `Depot → Senapati Bapat Marg → ${dest}`,
              why: `Most economical route for ${cat} cargo. Uses Senapati Bapat Marg to avoid FC Road tolls and peak-hour congestion. Saves up to 22% fuel vs express routing.`,
              color: '#10B981'
            },
            {
              id: 'express', label: 'Option B: Quick Service Route', badge: 'Fastest Delivery',
              badgeColor: 'blue', icon: 'zap', cost: `₹${(w * 19).toLocaleString()}`,
              time: `${Math.round(w * 0.35 + 22)} mins`, distance: `${(w * 0.12 + 14).toFixed(1)} km`,
              fuel: `${(w * 0.11 + 4.5).toFixed(1)} L`, sla: '100%', co2: `${(w * 0.06 + 2.1).toFixed(1)} kg`,
              route: `Depot → Bypass Corridor → FC Road Flyover → ${dest}`,
              why: `Fastest possible delivery using dedicated bypass flyover. Avoids all city junctions and traffic signals. ${cat === 'Medical' ? 'Mandatory for critical medical cargo.' : 'Best for time-sensitive deliveries.'}`,
              color: '#3B82F6'
            },
            {
              id: 'balanced', label: 'Option C: Best Overall Route', badge: 'Best Overall',
              badgeColor: 'purple', icon: 'scale', cost: `₹${(w * 16).toLocaleString()}`,
              time: `${Math.round(w * 0.48 + 30)} mins`, distance: `${(w * 0.15 + 18).toFixed(1)} km`,
              fuel: `${(w * 0.09 + 3.8).toFixed(1)} L`, sla: '99.2%', co2: `${(w * 0.045 + 1.6).toFixed(1)} kg`,
              route: `Depot → Paud Road → Karve Road → ${dest}`,
              why: `Perfect balance of cost and speed. Moderate route through Paud Road and Karve Road — avoids heaviest traffic without the extreme long detour of the eco route. Recommended for most standard deliveries.`,
              color: '#8B5CF6'
            }
          ]);
          setAiPowered(false);
        })
        .finally(() => setIsLoading(false));
    }

    // ── Fetch AI scenario analysis when scenario data arrives ───────────────
    if (mode === 'scenario' && scenarioData) {
      setIsLoading(true);
      setAiScenarioResult(null);
      getAIScenarioAnalysis(scenarioData)
        .then(res => {
          setAiScenarioResult(res.analysis);
          setAiPowered(res.ai_powered);
        })
        .catch(err => {
          setError('AI unreachable. Using calculated estimates.');
          const sev = scenarioData.severity || 'blocked';
          const delayMap = { blocked: 48, severe: 40, heavy: 28, moderate: 18 };
          const d = delayMap[sev] || 30;
          const fuel = d * 75 + 800;
          setAiScenarioResult({
            summary: `${d}-minute disruption on the corridor due to "${scenarioData.title}".`,
            impactText: `Trucks V01 and V02 would be delayed by ${d} minutes without rerouting. This wastes ₹${fuel.toLocaleString()} in idle fuel and risks missed delivery SLAs.`,
            options: [
              {
                id: 'bypass1', label: 'Route via Senapati Bapat Marg & University Flyover',
                saves: `${d} mins`, fuelSaved: `₹${fuel.toLocaleString()}`, distanceAdded: '+2.1 km',
                why: `The blocked corridor is bypassed via Senapati Bapat Marg — a parallel road currently free of incidents. Trucks V01 and V02 take this detour and arrive on time.`,
                vehicles: ['V01', 'V02'], recommended: true
              },
              {
                id: 'bypass2', label: 'Detour via Paud Road & Karve Nagar',
                saves: `${Math.round(d * 0.7)} mins`, fuelSaved: `₹${Math.round(fuel * 0.6).toLocaleString()}`, distanceAdded: '+3.4 km',
                why: `Truck V03 reroutes via Paud Road for wider lane access. Adds distance but avoids the incident zone for heavy cargo vehicles.`,
                vehicles: ['V03'], recommended: false
              }
            ]
          });
          setAiPowered(false);
        })
        .finally(() => setIsLoading(false));
    }
  }, [mode, newConsignmentData, scenarioData]);

  const handlePush = (optionId) => {
    setSelectedOption(optionId);
    setPushed(false);
    setTimeout(() => {
      setPushed(true);
      if (onPushToDriver) onPushToDriver(optionId);
    }, 900);
  };

  const compatibleVehicles = mode === 'newconsignment' && newConsignmentData
    ? findCompatibleVehicles(newConsignmentData)
    : [];

  // ── Status colour for consignment ──────────────────────────────────────
  const statusColorMap = {
    'in-transit': '#3B82F6',
    'completed': '#10B981',
    'failed': '#EF4444',
    'prepared': '#F59E0B',
  };

  return (
    <div className="ai-explain-panel">

      {/* ── PANEL HEADER ── */}
      <div className="aip-header">
        <div className="aip-header-left">
          <div className="aip-icon-badge">
            {isLoading ? <Loader2 size={18} className="spin-anim" /> : <Brain size={18} />}
          </div>
          <div>
            <h3 className="aip-title">AI Route Intelligence</h3>
            <p className="aip-subtitle">{panelSubtitle(mode, isLoading)}</p>
          </div>
        </div>
        <StatusDot mode={mode} isLoading={isLoading} />
      </div>

      {/* AI Powered badge */}
      {aiPowered && (
        <div className="aip-groq-badge">
          <Sparkles size={11} />
          <span>Powered by Groq AI · llama3-8b-8192</span>
        </div>
      )}

      {/* Error notice */}
      {error && (
        <div className="aip-error-notice">
          <AlertCircle size={13} />
          <span>{error}</span>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          MODE: IDLE — Empty state, prompt user to click
      ══════════════════════════════════════════════════════ */}
      {mode === 'idle' && !isLoading && (
        <div className="aip-idle-state">
          <div className="aip-idle-graphic">
            <div className="aip-idle-orbit">
              <div className="aip-idle-center-icon"><Brain size={32} /></div>
              <div className="aip-orbit-dot dot-1"><MapPin size={14} /></div>
              <div className="aip-orbit-dot dot-2"><Truck size={14} /></div>
              <div className="aip-orbit-dot dot-3"><Route size={14} /></div>
            </div>
          </div>
          <h4 className="aip-idle-title">AI Route Intelligence</h4>
          <p className="aip-idle-desc">
            Click any consignment card to see exactly why that route was chosen by the AI — costs, traffic conditions, driver assignment logic, and more.
          </p>
          <div className="aip-idle-hints">
            <div className="aip-idle-hint">
              <MousePointerClick size={14} />
              <span>Click a consignment → route explanation</span>
            </div>
            <div className="aip-idle-hint">
              <Plus size={14} />
              <span>Add new consignment → 3 AI route options</span>
            </div>
          </div>

          {/* Live fleet overview */}
          <div className="aip-section-label" style={{ marginTop: '20px' }}>
            <Truck size={12} /> LIVE VEHICLE CAPACITY
          </div>
          {VEHICLE_CAPACITY.map(v => (
            <div key={v.id} className="aip-vehicle-row aip-vehicle-ok">
              <div className="aip-veh-left">
                <div className="aip-veh-icon veh-icon-ok"><Truck size={14} /></div>
                <div>
                  <strong className="aip-veh-name">{v.id} · {v.driver}</strong>
                  <span className="aip-veh-route">{v.route}</span>
                </div>
              </div>
              <div className="aip-veh-right">
                <div className="aip-space-bar-wrap">
                  <div className="aip-space-bar">
                    <div className="aip-space-fill" style={{ width: `${(v.used / v.totalCap) * 100}%`, background: '#4F46E5' }} />
                  </div>
                  <span className="aip-space-label">{v.totalCap - v.used} kg free</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          MODE: CONSIGNMENT DETAIL — Why this route was chosen
      ══════════════════════════════════════════════════════ */}
      {mode === 'consignment-detail' && selectedConsignment && (
        <div className="aip-scroll-body">

          {/* Consignment identity strip */}
          <div className="aip-detail-header-strip">
            <div className="aip-detail-pkg-icon">
              <Package size={18} />
            </div>
            <div style={{ flex: 1 }}>
              <div className="aip-detail-title">{selectedConsignment.title}</div>
              <div className="aip-detail-shipnum">{selectedConsignment.shipmentNumber}</div>
            </div>
            <span
              className="aip-detail-status-pill"
              style={{ background: `${statusColorMap[selectedConsignment.status?.toLowerCase()] || '#6B7280'}22`, color: statusColorMap[selectedConsignment.status?.toLowerCase()] || '#6B7280' }}
            >
              {selectedConsignment.status}
            </span>
          </div>

          {/* Route path */}
          <div className="aip-route-path-display">
            <div className="aip-section-label"><Navigation size={12} /> ASSIGNED ROUTE</div>
            <div className="aip-route-path-pill">
              {selectedConsignment.routeExplanation?.chosenRoute || `${selectedConsignment.pickup} → ${selectedConsignment.deliveryAddress}`}
            </div>
          </div>

          {/* Metrics row */}
          <div className="aip-metrics-strip" style={{ marginTop: '12px' }}>
            <div className="aip-metric">
              <span>ETA</span>
              <strong>{selectedConsignment.routeExplanation?.eta || '—'}</strong>
            </div>
            <div className="aip-metric">
              <span>SLA</span>
              <strong style={{ color: '#10B981' }}>{selectedConsignment.routeExplanation?.sla || '—'}</strong>
            </div>
            <div className="aip-metric">
              <span>Weight</span>
              <strong>{selectedConsignment.weight}</strong>
            </div>
            <div className="aip-metric">
              <span>Priority</span>
              <strong style={{ color: selectedConsignment.priority === 'Critical' ? '#EF4444' : selectedConsignment.priority === 'High' ? '#F59E0B' : '#6B7280' }}>
                {selectedConsignment.priority}
              </strong>
            </div>
          </div>

          {/* AI Explanation box */}
          <div className="aip-section-label" style={{ marginTop: '16px' }}>
            <Lightbulb size={12} /> WHY THIS ROUTE WAS CHOSEN BY AI
          </div>
          <div className="aip-why-explanation-card">
            <div className="aip-why-glow" />
            <p className="aip-why-explanation-text">
              {selectedConsignment.routeExplanation?.whyChosen || 'Route was selected based on distance, traffic conditions, vehicle capacity, and delivery priority.'}
            </p>
          </div>

          {/* Savings */}
          {selectedConsignment.routeExplanation?.savings && (
            <div className="aip-savings-banner">
              <Leaf size={14} />
              <span>{selectedConsignment.routeExplanation.savings}</span>
            </div>
          )}

          {/* Driver info */}
          <div className="aip-section-label" style={{ marginTop: '16px' }}>
            <Truck size={12} /> ASSIGNED DRIVER
          </div>
          <div className="aip-driver-info-card">
            <div className="aip-driver-avatar">{selectedConsignment.driver?.avatar || '?'}</div>
            <div>
              <strong>{selectedConsignment.driver?.name}</strong>
              <span className="aip-driver-phone">{selectedConsignment.driver?.phone}</span>
              <div className="aip-driver-rating">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={11} fill={i < Math.floor(parseFloat(selectedConsignment.driver?.rating || 4)) ? '#F59E0B' : 'none'} stroke="#F59E0B" />
                ))}
                <span>{selectedConsignment.driver?.rating}★</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          MODE: LOADING SPINNER
      ══════════════════════════════════════════════════════ */}
      {isLoading && (
        <div className="aip-loading-state">
          <div className="aip-loading-rings">
            <div className="ring ring-1" />
            <div className="ring ring-2" />
            <div className="ring ring-3" />
            <Brain size={24} className="aip-loading-brain" />
          </div>
          <p className="aip-loading-text">AI is analyzing routes…</p>
          <p className="aip-loading-sub">Calculating distances, traffic patterns,<br />fuel costs & delivery SLA for Pune routes</p>
          <div className="aip-loading-steps">
            <div className="aip-load-step active"><CheckCircle2 size={12} /> Reading cargo parameters</div>
            <div className="aip-load-step active"><CheckCircle2 size={12} /> Checking live traffic feeds</div>
            <div className="aip-load-step pulse"><Loader2 size={12} className="spin-anim" /> Computing 3 optimal routes</div>
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          MODE: NEW CONSIGNMENT — 3 AI route options
      ══════════════════════════════════════════════════════ */}
      {mode === 'newconsignment' && newConsignmentData && !isLoading && aiRouteOptions && (
        <div className="aip-scroll-body">

          {/* Consignment Summary Strip */}
          <div className="aip-consignment-summary">
            <div className="aip-summary-item">
              <Package size={14} />
              <div>
                <span className="aip-sum-label">Cargo</span>
                <strong className="aip-sum-val">{newConsignmentData.category || 'General'}</strong>
              </div>
            </div>
            <div className="aip-summary-item">
              <MapPin size={14} />
              <div>
                <span className="aip-sum-label">Deliver To</span>
                <strong className="aip-sum-val">{newConsignmentData.deliveryAddress || '—'}</strong>
              </div>
            </div>
            <div className="aip-summary-item">
              <Scale size={14} />
              <div>
                <span className="aip-sum-label">Weight</span>
                <strong className="aip-sum-val">{newConsignmentData.weight || '—'} kg</strong>
              </div>
            </div>
          </div>

          <div className="aip-section-label" style={{ marginTop: '14px' }}>
            <Brain size={12} /> CHOOSE YOUR DISPATCH STRATEGY — 3 MANDATORY OPTIONS
          </div>

          {aiRouteOptions.map((opt) => (
            <div
              key={opt.id}
              className={`aip-route-option-card ${selectedOption === opt.id ? 'aip-route-selected' : ''}`}
              onClick={() => setSelectedOption(opt.id)}
              style={selectedOption === opt.id ? { borderColor: opt.color } : {}}
            >
              <div className="aip-route-header">
                <div className="aip-route-icon" style={{ background: bgMap[opt.badgeColor], color: opt.color }}>
                  {iconMap[opt.icon]}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="aip-route-title">{opt.label}</div>
                  <span className="aip-route-badge" style={{ background: bgMap[opt.badgeColor], color: opt.color }}>
                    {opt.badge}
                  </span>
                </div>
                {selectedOption === opt.id && <CheckCircle2 size={18} style={{ color: opt.color }} />}
              </div>

              <div className="aip-metrics-strip">
                <div className="aip-metric"><span>Cost</span><strong>{opt.cost}</strong></div>
                <div className="aip-metric"><span>ETA</span><strong>{opt.time}</strong></div>
                <div className="aip-metric"><span>Distance</span><strong>{opt.distance}</strong></div>
                <div className="aip-metric"><span>SLA</span><strong style={{ color: '#10B981' }}>{opt.sla}</strong></div>
              </div>

              {opt.fuel && (
                <div className="aip-metric-row-secondary">
                  <span><Droplets size={11} /> {opt.fuel} fuel</span>
                  {opt.co2 && <span><TreePine size={11} /> {opt.co2} CO₂</span>}
                </div>
              )}

              <div className="aip-why-box">
                <div className="aip-why-label">WHY THIS IS A GOOD CHOICE</div>
                <p className="aip-why-text">{opt.why}</p>
              </div>

              <div className="aip-route-path-row">
                <Navigation size={12} className="aip-icon-accent" />
                <span className="aip-route-path-text">{opt.route}</span>
              </div>

              {selectedOption === opt.id && (
                <button
                  className={`aip-push-btn ${pushed ? 'aip-push-done' : ''}`}
                  onClick={(e) => { e.stopPropagation(); handlePush(opt.id); }}
                  style={!pushed ? { background: opt.color } : {}}
                >
                  {pushed
                    ? <><CheckCircle2 size={14} /> Route Applied & Consignment Dispatched!</>
                    : <><Send size={14} /> Apply This Route & Dispatch</>}
                </button>
              )}
            </div>
          ))}

          {/* ── VEHICLE SPACE MATCHING ── */}
          <div className="aip-section-label" style={{ marginTop: '18px' }}>
            <Truck size={12} /> ADD TO AN ONGOING TRIP (Vehicle Space Check)
          </div>

          <div className="aip-vehicle-space-note">
            <Info size={14} />
            <span>AI checked all active vehicles. Ones below have space and their route passes near <strong>{newConsignmentData.deliveryAddress || 'your destination'}</strong>.</span>
          </div>

          {compatibleVehicles.map(v => {
            const weight = parseFloat(newConsignmentData?.weight) || 25;
            const routeMatch = v.stops.some(s =>
              (newConsignmentData?.deliveryAddress || '').toLowerCase().includes(s.toLowerCase()) ||
              s.toLowerCase().includes((newConsignmentData?.deliveryAddress || '').toLowerCase())
            );
            return (
              <div key={v.id} className={`aip-vehicle-row ${!v.canFit ? 'aip-vehicle-full' : routeMatch ? 'aip-vehicle-match' : 'aip-vehicle-ok'}`}>
                <div className="aip-veh-left">
                  <div className={`aip-veh-icon ${v.canFit ? 'veh-icon-ok' : 'veh-icon-full'}`}>
                    <Truck size={15} />
                  </div>
                  <div>
                    <strong className="aip-veh-name">{v.id} · {v.driver}</strong>
                    <span className="aip-veh-route">{v.route}</span>
                    {routeMatch && v.canFit && (
                      <span className="aip-route-match-tag"><CheckCircle2 size={11} /> Route passes near destination</span>
                    )}
                  </div>
                </div>
                <div className="aip-veh-right">
                  <div className="aip-space-bar-wrap">
                    <div className="aip-space-bar">
                      <div
                        className="aip-space-fill"
                        style={{ width: `${(v.used / v.totalCap) * 100}%`, background: v.canFit ? '#3B82F6' : '#EF4444' }}
                      />
                    </div>
                    <span className="aip-space-label">{v.remaining} kg free</span>
                  </div>
                  {v.canFit ? (
                    <button className="aip-add-to-trip-btn" onClick={() => alert(`Adding consignment to ${v.id} (${v.driver})'s active route. GPS updated.`)}>
                      <Plus size={12} /> Add to Trip
                    </button>
                  ) : (
                    <span className="aip-no-space">No space</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          MODE: SCENARIO — AI re-routing analysis
      ══════════════════════════════════════════════════════ */}
      {mode === 'scenario' && !isLoading && aiScenarioResult && (
        <div className="aip-scroll-body">

          <div className="aip-disruption-alert">
            <AlertTriangle size={16} />
            <div>
              <strong>Disruption Detected</strong>
              <p>{aiScenarioResult.summary}</p>
            </div>
          </div>

          <div className="aip-impact-box">
            <div className="aip-section-label">
              <Info size={12} /> WHAT IS HAPPENING
            </div>
            <p className="aip-explain-text">{aiScenarioResult.impactText}</p>
          </div>

          <div className="aip-section-label" style={{ marginTop: '16px' }}>
            <Navigation size={12} /> CHOOSE A RE-ROUTE PLAN TO PUSH TO DRIVERS
          </div>

          {(aiScenarioResult.options || []).map((opt) => (
            <div
              key={opt.id}
              className={`aip-scenario-option ${selectedOption === opt.id ? 'aip-option-selected' : ''} ${opt.recommended ? 'aip-option-recommended' : ''}`}
              onClick={() => setSelectedOption(opt.id)}
            >
              <div className="aip-scenario-option-header">
                <div className="aip-scenario-title">
                  <Navigation size={14} className="aip-icon-accent" />
                  <strong>{opt.label}</strong>
                  {opt.recommended && <span className="aip-rec-tag">★ Recommended</span>}
                </div>
                <div className="aip-savings-row">
                  <span className="aip-saves-badge"><Clock size={11} /> Saves {opt.saves}</span>
                  <span className="aip-saves-badge green-save"><Droplets size={11} /> {opt.fuelSaved} fuel</span>
                  {opt.distanceAdded && <span className="aip-saves-badge"><Route size={11} /> {opt.distanceAdded}</span>}
                </div>
              </div>

              <div className="aip-why-box">
                <div className="aip-why-label">WHY THIS ROUTE IS BETTER</div>
                <p className="aip-why-text">{opt.why}</p>
              </div>

              <div className="aip-affected-trucks">
                {(opt.vehicles || []).map(vid => {
                  const v = VEHICLE_CAPACITY.find(vc => vc.id === vid);
                  return v ? (
                    <div key={vid} className="aip-truck-pill">
                      <Truck size={12} />
                      <span>{v.id} · {v.driver.split(' ').slice(1).join(' ')}</span>
                    </div>
                  ) : null;
                })}
              </div>

              {selectedOption === opt.id && (
                <button
                  className={`aip-push-btn ${pushed ? 'aip-push-done' : ''}`}
                  onClick={(e) => { e.stopPropagation(); handlePush(opt.id); }}
                >
                  {pushed ? <><CheckCircle2 size={14} /> Route Pushed to Drivers!</> : <><Send size={14} /> Push This Route to Drivers</>}
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════
          SCENARIO mode: waiting for data (no scenario yet)
      ══════════════════════════════════════════════════════ */}
      {mode === 'scenario' && !isLoading && !aiScenarioResult && (
        <div className="aip-idle-state">
          <div className="aip-idle-graphic" style={{ marginBottom: '12px' }}>
            <div className="aip-idle-orbit">
              <div className="aip-idle-center-icon"><AlertTriangle size={28} /></div>
              <div className="aip-orbit-dot dot-1"><Navigation size={14} /></div>
              <div className="aip-orbit-dot dot-2"><Truck size={14} /></div>
              <div className="aip-orbit-dot dot-3"><Route size={14} /></div>
            </div>
          </div>
          <h4 className="aip-idle-title">Scenario Analysis Ready</h4>
          <p className="aip-idle-desc">Submit a disruption scenario on the left to get instant AI-powered re-routing recommendations for your fleet.</p>
        </div>
      )}

    </div>
  );
}
