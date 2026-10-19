import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Leaf, 
  Clock, 
  DollarSign, 
  ShieldCheck, 
  Truck, 
  Download, 
  Calendar 
} from 'lucide-react';

export default function ReportsView({ isDarkMode, currencySymbol = '₹' }) {
  return (
    <div className="reports-view-container">
      
      <div className="reports-header-row">
        <div>
          <h1 className="view-title">Fleet Performance & Logistics Analytics</h1>
          <p className="view-sub-desc">Key operational performance indicators, fuel optimization metrics, and SLA achievement rates in {currencySymbol} INR.</p>
        </div>

        <button className="btn-primary" onClick={() => alert("Exporting monthly analytics report (PDF/CSV)...")}>
          <Download size={16} />
          <span>Export Analytics Report</span>
        </button>
      </div>

      {/* KPI Highlight Summary Cards */}
      <div className="kpi-cards-grid">
        
        <div className="kpi-card green-border">
          <div className="kpi-card-header">
            <span className="kpi-title">On-Time SLA Delivery</span>
            <div className="kpi-icon-wrap green-bg">
              <Clock size={18} />
            </div>
          </div>
          <div className="kpi-number">98.8%</div>
          <span className="kpi-trend positive">+2.4% vs last month</span>
        </div>

        <div className="kpi-card blue-border">
          <div className="kpi-card-header">
            <span className="kpi-title">Monthly Fuel Savings</span>
            <div className="kpi-icon-wrap blue-bg">
              <span style={{ fontSize: '18px', fontWeight: '800' }}>{currencySymbol}</span>
            </div>
          </div>
          <div className="kpi-number">{currencySymbol}4,82,000</div>
          <span className="kpi-trend positive">Saved via AI Routing</span>
        </div>

        <div className="kpi-card emerald-border">
          <div className="kpi-card-header">
            <span className="kpi-title">Carbon Offset (CO₂)</span>
            <div className="kpi-icon-wrap emerald-bg">
              <Leaf size={18} />
            </div>
          </div>
          <div className="kpi-number">412.5 kg</div>
          <span className="kpi-trend positive">Eco-saver strategy</span>
        </div>

        <div className="kpi-card purple-border">
          <div className="kpi-card-header">
            <span className="kpi-title">Average Route Efficiency</span>
            <div className="kpi-icon-wrap purple-bg">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="kpi-number">94.2%</div>
          <span className="kpi-trend positive">Optimal capacity utilization</span>
        </div>

      </div>

      {/* Analytics Breakdown Sections */}
      <div className="analytics-details-grid">
        
        {/* Fuel Consumption Efficiency Chart */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <h3 className="card-title-txt">Weekly Fuel Savings via AI Rerouting</h3>
            <span className="badge-sub">Pune Metro Zone</span>
          </div>

          <div className="chart-bar-container">
            {[
              { day: 'Mon', savings: 82, baseline: 100 },
              { day: 'Tue', savings: 74, baseline: 100 },
              { day: 'Wed', savings: 68, baseline: 100 },
              { day: 'Thu', savings: 72, baseline: 100 },
              { day: 'Fri', savings: 65, baseline: 100 },
              { day: 'Sat', savings: 60, baseline: 100 },
              { day: 'Sun', savings: 55, baseline: 100 },
            ].map((bar, i) => (
              <div key={i} className="chart-col">
                <div className="bar-stack">
                  <div className="bar-baseline" style={{ height: `${bar.baseline}%` }}></div>
                  <div className="bar-savings" style={{ height: `${bar.savings}%` }}></div>
                </div>
                <span className="bar-label">{bar.day}</span>
              </div>
            ))}
          </div>
          <div className="chart-legend">
            <span className="legend-item"><span className="dot dot-baseline"></span> Standard Un-optimized Cost</span>
            <span className="legend-item"><span className="dot dot-savings"></span> UrbanFlow AI Optimized Fuel Spend</span>
          </div>
        </div>

        {/* Carrier SLA Distribution */}
        <div className="analytics-card">
          <div className="analytics-card-header">
            <h3 className="card-title-txt">Carrier & Driver SLA Ranking</h3>
            <span className="badge-sub">Active 4 Drivers</span>
          </div>

          <div className="drivers-rank-list">
            {[
              { name: 'Mr. Arjun Sharma', vehicle: 'MH-12-UF-01', score: 99.4, deliveries: 142, rating: '4.95 ★' },
              { name: 'Mr. Ravi Deshmukh', vehicle: 'MH-12-UF-02', score: 98.6, deliveries: 128, rating: '4.90 ★' },
              { name: 'Mr. Sunil Patil', vehicle: 'MH-12-UF-03', score: 98.1, deliveries: 115, rating: '4.85 ★' },
              { name: 'Mr. Kiran Jadhav', vehicle: 'MH-12-UF-04', score: 97.5, deliveries: 98, rating: '4.78 ★' },
            ].map((d, i) => (
              <div key={i} className="driver-rank-row">
                <div className="driver-rank-left">
                  <div className="rank-number">{i + 1}</div>
                  <div>
                    <strong className="driver-name-bold">{d.name}</strong>
                    <span className="driver-rank-sub">{d.vehicle} · {d.deliveries} parcels</span>
                  </div>
                </div>

                <div className="driver-rank-right">
                  <div className="driver-score-pill">{d.score}% SLA</div>
                  <span className="driver-rating-tag">{d.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
