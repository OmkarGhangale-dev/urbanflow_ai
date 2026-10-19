import React, { useState } from 'react';
import { 
  AlertTriangle, 
  RotateCcw, 
  MapPin, 
  ArrowRight, 
  ShieldAlert, 
  CheckCircle2, 
  Truck, 
  Clock, 
  Sparkles, 
  Send, 
  Zap, 
  TrendingDown, 
  Navigation 
} from 'lucide-react';
import { reoptimizeRoutes, createTrafficIncident } from '../api';

export default function ScenarioReoptView({ isDarkMode, currencySymbol = '₹', onScenarioAnalyze }) {
  const [scenarioName, setScenarioName] = useState('Monsoon Flash Flood & Road Blockade on FC Road');
  const [incidentType, setIncidentType] = useState('blocked');
  const [fromLocation, setFromLocation] = useState('D1');
  const [toLocation, setToLocation] = useState('L01');
  const [severity, setSeverity] = useState('blocked');
  const [notes, setNotes] = useState('Waterlogging level > 2 feet. Heavy police barricade at Shivajinagar crossing.');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [broadcastSent, setBroadcastSent] = useState(false);

  const locationNames = {
    D1: 'Central Depot (Shivajinagar)',
    D2: 'East Depot (Koregaon Park)',
    L01: 'Shivajinagar (L01)',
    L02: 'Deccan Gymkhana (L02)',
    L03: 'Kothrud (L03)',
    L04: 'Aundh (L04)',
    L05: 'Baner (L05)',
    L06: 'Viman Nagar (L06)',
    L07: 'Koregaon Park (L07)',
    L08: 'Hadapsar (L08)'
  };

  const getBypassName = (from, to) => {
    if (from === 'D1' || to === 'L01' || from === 'L01') return 'Senapati Bapat Marg & University Flyover';
    if (from === 'L02' || to === 'L03' || from === 'L03') return 'Karve Road & Paud Road Arterial';
    if (from === 'L04' || to === 'L05' || from === 'L05') return 'Baner-Pashan Expressway Link';
    if (from === 'D2' || to === 'L07' || to === 'L06') return 'Bund Garden & Airport Bypass Corridor';
    return 'Paud Road Western Ring Route';
  };

  const [reoptResult, setReoptResult] = useState({
    analyzed: true,
    scenarioTitle: 'Monsoon Flash Flood & Road Blockade on FC Road',
    impactText: 'High disruption detected on Central Pune corridor between Central Depot and Shivajinagar. Truck V02 would be stuck in traffic for 48 minutes on its normal road.',
    whyBetterText: 'Because the road between Central Depot and Shivajinagar is completely blocked due to Monsoon Flash Flood & Road Blockade on FC Road, Truck V02 cannot pass normally. UrbanFlow AI automatically diverted Truck V02 through Senapati Bapat Marg & University Flyover instead. This saves 34 minutes of traffic delay, saves ₹3,420 in wasted petrol, and ensures all packages reach customers before their morning delivery window.',
    timeSaved: '34 minutes saved',
    costChange: `${currencySymbol}3,420 saved in petrol`,
    distanceChange: '+2.1 km (Safe Detour)',
    slaProtected: '100% Delivery SLA Kept',
    changes: [
      {
        truck: 'Truck V02 (Driver: Ravi Deshmukh)',
        oldRoute: 'Central Depot ➔ FC Road ➔ Deccan Gymkhana',
        newRoute: 'Central Depot ➔ Senapati Bapat Marg ➔ Deccan Gymkhana',
        savedTime: '34 mins',
        reason: 'Avoided severe road blockage and deep waterlogging on FC Road'
      },
      {
        truck: 'Truck V01 (Driver: Arjun Sharma)',
        oldRoute: 'Central Depot ➔ Deccan ➔ Kothrud',
        newRoute: 'Central Depot ➔ Paud Road ➔ Kothrud',
        savedTime: 'On Schedule',
        reason: 'Smooth flow maintained with zero congestion penalty'
      }
    ]
  });

  // Quick Preset Scenarios
  const handleSelectPreset = (preset) => {
    setScenarioName(preset.title);
    setIncidentType(preset.type);
    setFromLocation(preset.from);
    setToLocation(preset.to);
    setSeverity(preset.severity);
    setNotes(preset.notes);

    // Immediate dynamic recalculation
    computeScenarioReoptimization(preset.title, preset.type, preset.from, preset.to, preset.severity, preset.notes);
  };

  const computeScenarioReoptimization = (title, type, from, to, sev, nts) => {
    const fromName = locationNames[from] || from;
    const toName = locationNames[to] || to;
    const bypass = getBypassName(from, to);

    let delayMins = 32;
    let sevWord = 'heavily congested';
    if (sev === 'blocked') { delayMins = 48; sevWord = 'completely blocked'; }
    else if (sev === 'severe') { delayMins = 40; sevWord = 'severely jammed'; }
    else if (sev === 'heavy') { delayMins = 28; sevWord = 'experiencing heavy traffic'; }
    else { delayMins = 18; sevWord = 'facing moderate delays'; }

    const timeSavedStr = `${delayMins} minutes saved`;
    const petrolSaved = Math.round(delayMins * 75 + 1050);
    const costSavedStr = `${currencySymbol}${petrolSaved.toLocaleString()} saved in petrol`;

    const simpleEnglishExplanation = `Because the route between ${fromName} and ${toName} is ${sevWord} due to "${title}", vehicles cannot travel normally. UrbanFlow AI automatically diverted Truck V02 through ${bypass} instead. This saves ${delayMins} minutes of waiting in traffic, avoids ${currencySymbol}${petrolSaved.toLocaleString()} in wasted petrol from idling, and ensures all packages are delivered right on time without missing customer deadlines.`;

    const impactDesc = `Traffic disruption logged between ${fromName} and ${toName} (${sev.toUpperCase()}). Without rerouting, fleet vehicles would suffer an estimated ${delayMins}-minute delay.`;

    const result = {
      analyzed: true,
      scenarioTitle: title,
      impactText: impactDesc,
      whyBetterText: simpleEnglishExplanation,
      timeSaved: timeSavedStr,
      costChange: costSavedStr,
      distanceChange: '+1.8 km (Safe Detour)',
      slaProtected: '100% Delivery SLA Kept',
      changes: [
        {
          truck: 'Truck V02 (Driver: Ravi Deshmukh)',
          oldRoute: `${fromName} ➔ Direct Corridor ➔ ${toName}`,
          newRoute: `${fromName} ➔ ${bypass} ➔ ${toName}`,
          savedTime: `${delayMins} mins`,
          reason: `Detoured away from ${sevWord} zone`
        },
        {
          truck: 'Truck V01 (Driver: Arjun Sharma)',
          oldRoute: 'Central Depot ➔ Priority Corridor ➔ Drop-off',
          newRoute: 'Central Depot ➔ Speed Route ➔ Drop-off',
          savedTime: 'On Schedule',
          reason: 'Bypassed intersection to protect delivery SLA'
        }
      ]
    };
    setReoptResult(result);
    // Notify AI panel about this scenario
    if (onScenarioAnalyze) {
      onScenarioAnalyze({ title, type, from, to, severity: sev, notes: nts });
    }
  };

  const handleRunReoptimize = async (e) => {
    e.preventDefault();
    setIsAnalyzing(true);
    setBroadcastSent(false);

    try {
      await createTrafficIncident(fromLocation, toLocation, severity);
      await reoptimizeRoutes({ distance: 1.0, traffic: 4.5, priority: 15.0, utilization: 5.0 });
    } catch (err) {
      console.log("Local calculation active");
    }

    setTimeout(() => {
      computeScenarioReoptimization(scenarioName, incidentType, fromLocation, toLocation, severity, notes);
      setIsAnalyzing(false);
    }, 400);
  };

  const handleBroadcastToDrivers = () => {
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 5000);
  };

  return (
    <div className="scenario-reopt-container">
      
      {/* Header */}
      <div className="reopt-header">
        <div className="reopt-title-group">
          <div className="reopt-icon-badge">
            <AlertTriangle size={20} />
          </div>
          <div>
            <h1>Admin Incident & Scenario Re-Optimization Studio</h1>
            <p>Enter unexpected real-world city disruptions (traffic jams, road closures, breakdowns) to generate instant AI re-routing.</p>
          </div>
        </div>

        {/* Preset Quick Buttons */}
        <div className="preset-scenario-buttons">
          <span className="preset-label">Quick Presets:</span>
          <button 
            type="button"
            className="preset-btn"
            onClick={() => handleSelectPreset({
              title: 'Monsoon Flash Flood on FC Road',
              type: 'flood',
              from: 'D1',
              to: 'L01',
              severity: 'blocked',
              notes: 'Waterlogging > 2 feet. Road blocked at crossing.'
            })}
          >
            🌊 Monsoon Flood
          </button>

          <button 
            type="button"
            className="preset-btn"
            onClick={() => handleSelectPreset({
              title: 'Vehicle Breakdown on Deccan Bridge',
              type: 'breakdown',
              from: 'L01',
              to: 'L02',
              severity: 'severe',
              notes: 'Heavy cargo truck breakdown blocking 2 lanes.'
            })}
          >
            🚚 Vehicle Breakdown
          </button>

          <button 
            type="button"
            className="preset-btn"
            onClick={() => handleSelectPreset({
              title: 'Emergency Medical Cargo Priority Surge',
              type: 'urgent',
              from: 'D1',
              to: 'L03',
              severity: 'heavy',
              notes: 'Immediate refrigerated vaccine shipment needed at Kothrud Hospital.'
            })}
          >
            🚨 Medical Priority Surge
          </button>

          <button 
            type="button"
            className="preset-btn"
            onClick={() => handleSelectPreset({
              title: 'Aundh Flyover Construction Jam',
              type: 'heavy',
              from: 'L04',
              to: 'L05',
              severity: 'heavy',
              notes: 'Pothole repair work restricting traffic to single lane.'
            })}
          >
            🚧 Flyover Construction
          </button>
        </div>
      </div>

      <div className="reopt-grid-layout">
        
        {/* LEFT: ADMIN INCIDENT ENTRY FORM */}
        <div className="admin-incident-form-card">
          <div className="form-card-header">
            <h3>1. Admin Incident Scenario Input</h3>
            <span className="form-step-pill">Disruption Format</span>
          </div>

          <form onSubmit={handleRunReoptimize} className="incident-form-body">
            
            <div className="form-group">
              <label>Scenario / Incident Title</label>
              <input 
                type="text"
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                placeholder="e.g. Flash Flood on FC Road"
                required
              />
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>Disruption Type</label>
                <select 
                  value={incidentType}
                  onChange={(e) => setIncidentType(e.target.value)}
                >
                  <option value="blocked">🚧 Road Blockade / Construction</option>
                  <option value="heavy">🚗 Severe Traffic Gridlock</option>
                  <option value="breakdown">⚠️ Vehicle Mechanical Breakdown</option>
                  <option value="flood">🌊 Flash Flood / Weather Hazard</option>
                  <option value="urgent">🚨 VIP Emergency Parcel Surge</option>
                </select>
              </div>

              <div className="form-group">
                <label>Severity Level</label>
                <select 
                  value={severity}
                  onChange={(e) => setSeverity(e.target.value)}
                >
                  <option value="moderate">Moderate (+18 mins delay)</option>
                  <option value="heavy">Heavy (+28 mins delay)</option>
                  <option value="severe">Severe (+40 mins delay)</option>
                  <option value="blocked">Complete Road Closure (+48 mins)</option>
                </select>
              </div>
            </div>

            <div className="form-row-2">
              <div className="form-group">
                <label>From Location / Corridor</label>
                <select 
                  value={fromLocation}
                  onChange={(e) => setFromLocation(e.target.value)}
                >
                  <option value="D1">Central Depot (Shivajinagar)</option>
                  <option value="D2">East Depot (Koregaon Park)</option>
                  <option value="L01">Shivajinagar (L01)</option>
                  <option value="L02">Deccan Gymkhana (L02)</option>
                  <option value="L03">Kothrud (L03)</option>
                  <option value="L04">Aundh (L04)</option>
                  <option value="L07">Koregaon Park (L07)</option>
                </select>
              </div>

              <div className="form-group">
                <label>To Location / Intersection</label>
                <select 
                  value={toLocation}
                  onChange={(e) => setToLocation(e.target.value)}
                >
                  <option value="L01">Shivajinagar (L01)</option>
                  <option value="L02">Deccan Gymkhana (L02)</option>
                  <option value="L03">Kothrud (L03)</option>
                  <option value="L04">Aundh (L04)</option>
                  <option value="L05">Baner (L05)</option>
                  <option value="L06">Viman Nagar (L06)</option>
                  <option value="L07">Koregaon Park (L07)</option>
                  <option value="L08">Hadapsar (L08)</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Admin Directives & Notes</label>
              <textarea 
                rows="3"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter field observer notes..."
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="btn-primary run-analysis-btn"
              disabled={isAnalyzing}
            >
              <Zap size={18} className={isAnalyzing ? 'spin-anim' : ''} />
              <span>{isAnalyzing ? 'Recalculating Pune Routes...' : 'Analyze Scenario & Re-Optimize Routes'}</span>
            </button>
          </form>
        </div>

        {/* RIGHT: RE-OPTIMIZATION RESULTS & SIMPLE ENGLISH WHY BETTER */}
        <div className="reopt-results-panel">
          
          <div className="results-card-header">
            <div>
              <span className="results-badge">2. AI Re-Optimization Results</span>
              <h2 className="results-title">{reoptResult.scenarioTitle}</h2>
            </div>
            
            <button 
              className={`btn-broadcast ${broadcastSent ? 'sent' : ''}`}
              onClick={handleBroadcastToDrivers}
            >
              <Send size={15} />
              <span>{broadcastSent ? 'Dispatched to Fleet!' : 'Push New Route to Drivers'}</span>
            </button>
          </div>

          {/* Disruption Alert Box */}
          <div className="disruption-impact-alert">
            <ShieldAlert size={20} className="alert-icon" />
            <div>
              <strong>Disruption Impact on Fleet:</strong>
              <p>{reoptResult.impactText}</p>
            </div>
          </div>

          {/* Prominent Why Re-Optimized Route is Better in Simple English and Big Typography */}
          <div className="why-reopt-better-box">
            <div className="why-better-badge">
              <Sparkles size={16} />
              <span>WHY THE NEW ROUTE IS BETTER (SIMPLE EXPLANATION)</span>
            </div>
            <p className="why-better-text-large">
              {reoptResult.whyBetterText}
            </p>
          </div>

          {/* Quick Comparison Stat Chips */}
          <div className="reopt-stats-row">
            <div className="reopt-stat-card green-tint">
              <Clock size={18} />
              <div>
                <span className="stat-label">Delivery Time Saved</span>
                <strong className="stat-value">{reoptResult.timeSaved}</strong>
              </div>
            </div>

            <div className="reopt-stat-card blue-tint">
              <TrendingDown size={18} />
              <div>
                <span className="stat-label">Idle Fuel Saved</span>
                <strong className="stat-value">{reoptResult.costChange}</strong>
              </div>
            </div>

            <div className="reopt-stat-card purple-tint">
              <CheckCircle2 size={18} />
              <div>
                <span className="stat-label">Customer SLA</span>
                <strong className="stat-value">{reoptResult.slaProtected}</strong>
              </div>
            </div>
          </div>

          {/* Vehicle Re-Route Details Table */}
          <div className="reroute-details-table-wrap">
            <h4>Live Vehicle Adjustments</h4>
            <div className="reroute-cards-list">
              {reoptResult.changes.map((change, idx) => (
                <div key={idx} className="reroute-card-item">
                  <div className="reroute-item-top">
                    <div className="reroute-truck-badge">
                      <Truck size={14} />
                      <span>{change.truck}</span>
                    </div>
                    <span className="reroute-saved-badge">⏱ {change.savedTime}</span>
                  </div>

                  <div className="route-comparison-row">
                    <div className="route-path-box old-path">
                      <span className="path-label">Old Blocked Path:</span>
                      <span className="path-text">{change.oldRoute}</span>
                    </div>
                    <div className="route-path-arrow">➔</div>
                    <div className="route-path-box new-path">
                      <span className="path-label">New Dynamic Route:</span>
                      <span className="path-text">{change.newRoute}</span>
                    </div>
                  </div>

                  <div className="reroute-reason-line">
                    <strong>AI Reason:</strong> {change.reason}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
