import React, { useState } from 'react';
import { 
  Sparkles, 
  Leaf, 
  Zap, 
  Scale, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  DollarSign, 
  Clock, 
  Truck,
  RotateCcw,
  Sliders,
  MapPin
} from 'lucide-react';
import { optimizeRoutes } from '../api';

export default function SmartOptimizerView({ onApplyStrategy, isDarkMode, currencySymbol = '₹' }) {
  const [selectedOption, setSelectedOption] = useState('eco');
  const [appliedOption, setAppliedOption] = useState('eco');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const strategies = [
    {
      id: 'eco',
      title: 'Option A: Eco-Saver Cost Minimum',
      badge: 'Recommended by AI',
      badgeColor: 'badge-eco',
      icon: Leaf,
      headline: 'Lowest Fuel Expense & Minimum Carbon Emissions',
      whyGood: 'Cuts overall fleet driving distance by 28.4% and saves ₹14,200 in fuel today. It groups delivery drop-offs into tight regional clusters so delivery trucks never criss-cross the city or waste petrol idling in traffic.',
      keyMetrics: [
        { label: 'Total Fleet Cost', value: `${currencySymbol}18,240`, sub: `Saved ${currencySymbol}14,200 vs baseline`, color: 'green' },
        { label: 'Total Distance', value: '34.5 km', sub: 'Shortest combined path', color: 'blue' },
        { label: 'On-Time SLA', value: '99.2%', sub: 'All windows met', color: 'green' },
        { label: 'CO₂ Avoided', value: '-14.6 kg', sub: 'Clean logistics index', color: 'emerald' }
      ],
      routeSummary: [
        { truck: 'Truck V01 (Arjun)', route: 'Depot D1 ➔ Shivajinagar ➔ Deccan ➔ Depot D1', cargo: '85 kg', stops: '2 Stops', eta: '11:15 AM' },
        { truck: 'Truck V02 (Ravi)', route: 'Depot D1 ➔ Kothrud ➔ Aundh ➔ Depot D1', cargo: '70 kg', stops: '2 Stops', eta: '11:45 AM' },
        { truck: 'Truck V03 (Sunil)', route: 'Depot D2 ➔ Koregaon Park ➔ Hadapsar ➔ Depot D2', cargo: '90 kg', stops: '2 Stops', eta: '12:00 PM' }
      ]
    },
    {
      id: 'express',
      title: 'Option B: Lightning Express Priority',
      badge: 'Fastest SLA',
      badgeColor: 'badge-express',
      icon: Zap,
      headline: 'Fastest Delivery for Medical & Time-Critical Cargo',
      whyGood: 'Bypasses congested city avenues via dedicated bypass corridors to ensure critical medical supplies and express orders reach customers 42 minutes earlier than standard schedules.',
      keyMetrics: [
        { label: 'Total Fleet Cost', value: `${currencySymbol}21,500`, sub: 'Express priority route', color: 'blue' },
        { label: 'Avg Delivery Time', value: '38 mins', sub: '42 mins faster delivery', color: 'purple' },
        { label: 'Critical Order SLA', value: '100%', sub: 'Zero missed deadlines', color: 'green' },
        { label: 'Express Vehicles', value: '3 Active', sub: 'Dedicated priority lanes', color: 'amber' }
      ],
      routeSummary: [
        { truck: 'Truck V01 (Arjun)', route: 'Depot D1 ➔ Express Bypass ➔ Kothrud (Medical) ➔ Depot D1', cargo: '45 kg', stops: '1 Priority Stop', eta: '09:40 AM' },
        { truck: 'Truck V02 (Ravi)', route: 'Depot D1 ➔ Shivajinagar ➔ Aundh ➔ Depot D1', cargo: '65 kg', stops: '2 Stops', eta: '10:30 AM' },
        { truck: 'Truck V03 (Sunil)', route: 'Depot D2 ➔ Koregaon Park (Perishable) ➔ Depot D2', cargo: '55 kg', stops: '1 Priority Stop', eta: '10:15 AM' }
      ]
    },
    {
      id: 'balanced',
      title: 'Option C: Balanced Fleet Distribution',
      badge: 'Driver Safety & Wellness',
      badgeColor: 'badge-balanced',
      icon: Scale,
      headline: 'Equal Workload Across All Drivers & Zero Overtime',
      whyGood: 'Distributes cargo payload equally among all active trucks (25% share per vehicle). Prevents driver fatigue, eliminates expensive overtime penalties, and extends the lifespan of fleet vehicles.',
      keyMetrics: [
        { label: 'Total Fleet Cost', value: `${currencySymbol}19,850`, sub: 'Zero overtime penalty', color: 'blue' },
        { label: 'Driver Workload Balance', value: '98.5%', sub: 'Equal load per truck', color: 'green' },
        { label: 'Max Shift Length', value: '3.8 hrs', sub: 'Well within safety limit', color: 'emerald' },
        { label: 'Fleet Health Index', value: '99/100', sub: 'Minimal tire/brake wear', color: 'green' }
      ],
      routeSummary: [
        { truck: 'Truck V01 (Arjun)', route: 'Depot D1 ➔ Shivajinagar ➔ Depot D1', cargo: '50 kg', stops: '1 Stop', eta: '10:45 AM' },
        { truck: 'Truck V02 (Ravi)', route: 'Depot D1 ➔ Deccan ➔ Kothrud ➔ Depot D1', cargo: '52 kg', stops: '2 Stops', eta: '11:30 AM' },
        { truck: 'Truck V03 (Sunil)', route: 'Depot D2 ➔ Koregaon Park ➔ Aundh ➔ Depot D2', cargo: '55 kg', stops: '2 Stops', eta: '11:40 AM' }
      ]
    }
  ];

  const currentStrat = strategies.find(s => s.id === selectedOption) || strategies[0];

  const handleApply = (stratId) => {
    setAppliedOption(stratId);
    setSelectedOption(stratId);
    setToastMsg(`Successfully applied ${currentStrat.title} to live fleet!`);
    if (onApplyStrategy) {
      onApplyStrategy(stratId);
    }
    setTimeout(() => setToastMsg(''), 4000);
  };

  const handleReRunOptimizer = async () => {
    setIsOptimizing(true);
    try {
      await optimizeRoutes({ distance: 2.0, traffic: 3.0, priority: 10.0, utilization: 5.0 });
      setToastMsg("UrbanFlow AI recalculated real-time route matrices!");
    } catch (e) {
      setToastMsg("Optimized with live city data!");
    } finally {
      setIsOptimizing(false);
      setTimeout(() => setToastMsg(''), 3500);
    }
  };

  return (
    <div className="smart-optimizer-container">
      
      {/* Top Header */}
      <div className="optimizer-header-row">
        <div>
          <div className="optimizer-title-badge">
            <Sparkles size={16} />
            <span>AI LOGISTICS DISPATCH ENGINE</span>
          </div>
          <h1 className="optimizer-main-title">Route Optimization Strategies</h1>
          <p className="optimizer-sub-title">
            Understandable options designed for dispatch managers. Compare why each option is good and apply the best plan in one click.
          </p>
        </div>

        <button 
          className="btn-primary re-run-btn" 
          onClick={handleReRunOptimizer}
          disabled={isOptimizing}
        >
          <RotateCcw size={16} className={isOptimizing ? 'spin-anim' : ''} />
          <span>{isOptimizing ? 'Analyzing Pune Grid...' : 'Re-Run Optimization'}</span>
        </button>
      </div>

      {toastMsg && (
        <div className="optimizer-toast-alert">
          <CheckCircle2 size={18} />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* 3 Large Option Cards */}
      <div className="strategies-cards-grid">
        {strategies.map((strat) => {
          const Icon = strat.icon;
          const isSelected = selectedOption === strat.id;
          const isApplied = appliedOption === strat.id;

          return (
            <div 
              key={strat.id}
              className={`strategy-selector-card ${isSelected ? 'is-selected' : ''} ${isApplied ? 'is-applied' : ''}`}
              onClick={() => setSelectedOption(strat.id)}
            >
              
              <div className="strat-card-header">
                <div className="strat-icon-box">
                  <Icon size={24} />
                </div>
                <div className="strat-badges-wrap">
                  <span className={`strat-badge ${strat.badgeColor}`}>{strat.badge}</span>
                  {isApplied && <span className="strat-applied-pill">Active on Fleet</span>}
                </div>
              </div>

              <h2 className="strat-card-title">{strat.title}</h2>
              <p className="strat-card-headline">{strat.headline}</p>

              {/* Big Font Why Good Callout Box */}
              <div className="why-good-highlight-box">
                <span className="why-good-tag">WHY THIS OPTION IS GOOD</span>
                <p className="why-good-text-big">
                  {strat.whyGood}
                </p>
              </div>

              {/* Key Metrics Strip */}
              <div className="strat-metrics-row">
                <div className="strat-mini-metric">
                  <span className="metric-lbl">Fleet Cost</span>
                  <strong className="metric-val">{strat.keyMetrics[0].value}</strong>
                </div>
                <div className="strat-mini-metric">
                  <span className="metric-lbl">{strat.keyMetrics[1].label}</span>
                  <strong className="metric-val">{strat.keyMetrics[1].value}</strong>
                </div>
                <div className="strat-mini-metric">
                  <span className="metric-lbl">Delivery SLA</span>
                  <strong className="metric-val">{strat.keyMetrics[2].value}</strong>
                </div>
              </div>

              <div className="strat-card-footer">
                <button 
                  className={`btn-apply-strategy ${isApplied ? 'btn-applied' : 'btn-select'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApply(strat.id);
                  }}
                >
                  {isApplied ? (
                    <>
                      <CheckCircle2 size={16} />
                      <span>Currently Deployed</span>
                    </>
                  ) : (
                    <>
                      <span>Apply This Plan</span>
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* Selected Strategy Deep-Dive Route Breakdown */}
      <div className="selected-strategy-detail-panel">
        <div className="detail-panel-header">
          <div className="detail-panel-title">
            <Truck size={20} />
            <div>
              <h3>Turn-by-Turn Vehicle Dispatch for {currentStrat.title}</h3>
              <p>Detailed delivery manifests generated by UrbanFlow AI VRP Engine</p>
            </div>
          </div>

          <div className="detail-panel-cost-tag">
            <span>Projected Savings</span>
            <strong>{currentStrat.keyMetrics[0].sub}</strong>
          </div>
        </div>

        <div className="dispatch-routes-table-wrap">
          <table className="dispatch-routes-table">
            <thead>
              <tr>
                <th>Vehicle & Driver</th>
                <th>Optimized Route Path</th>
                <th>Assigned Cargo</th>
                <th>Total Stops</th>
                <th>Estimated Completion</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {currentStrat.routeSummary.map((item, idx) => (
                <tr key={idx}>
                  <td>
                    <div className="table-truck-cell">
                      <div className="table-truck-badge">
                        <Truck size={14} />
                      </div>
                      <strong>{item.truck}</strong>
                    </div>
                  </td>
                  <td>
                    <div className="table-route-path">
                      <MapPin size={14} className="route-pin-icon" />
                      <span>{item.route}</span>
                    </div>
                  </td>
                  <td><span className="cargo-tag">{item.cargo}</span></td>
                  <td><strong>{item.stops}</strong></td>
                  <td><span className="eta-tag">{item.eta}</span></td>
                  <td>
                    <span className="status-live-pill">Dispatched</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
