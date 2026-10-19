import React, { useState } from 'react';
import { Settings, Moon, Sun, Bell, Shield, Sliders, Check, Globe } from 'lucide-react';

export default function SettingsView({ 
  isDarkMode, 
  onToggleDarkMode,
  currentCurrency = 'INR',
  onCurrencyChange 
}) {
  const [trafficAlerts, setTrafficAlerts] = useState(true);
  const [autoReroute, setAutoReroute] = useState(true);
  const [audioNotifications, setAudioNotifications] = useState(true);
  const [distanceUnit, setDistanceUnit] = useState('km');
  const [currency, setCurrency] = useState(currentCurrency);
  const [saved, setSaved] = useState(false);

  const handleCurrencySelect = (e) => {
    const val = e.target.value;
    setCurrency(val);
    if (onCurrencyChange) {
      onCurrencyChange(val);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (onCurrencyChange) {
      onCurrencyChange(currency);
    }
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="settings-view-container">
      
      <div className="settings-header">
        <div>
          <h1>Platform Settings & Dispatch Preferences</h1>
          <p>Configure theme appearance, dynamic routing automation, and active currency format.</p>
        </div>

        {saved && (
          <div className="saved-toast">
            <Check size={16} />
            <span>Preferences saved successfully! Active currency: {currency === 'INR' ? '₹ INR' : currency}</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSave} className="settings-cards-grid">
        
        {/* Appearance Card */}
        <div className="settings-card">
          <div className="settings-card-header">
            <Moon size={18} />
            <h3>Interface Appearance</h3>
          </div>

          <div className="setting-toggle-row">
            <div>
              <strong>Dark Mode Theme</strong>
              <p>Switch between light and dark UI styling</p>
            </div>
            <button 
              type="button" 
              className={`toggle-switch-btn ${isDarkMode ? 'active' : ''}`}
              onClick={onToggleDarkMode}
            >
              <span className="toggle-slider"></span>
            </button>
          </div>
        </div>

        {/* Currency & Localization Card */}
        <div className="settings-card">
          <div className="settings-card-header">
            <Globe size={18} />
            <h3>Currency & Regional Format</h3>
          </div>

          <div className="setting-select-row">
            <label>Active Currency (Default: Indian Rupee ₹ INR)</label>
            <select value={currency} onChange={handleCurrencySelect}>
              <option value="INR">₹ Indian Rupee (INR) - Active</option>
              <option value="USD">$ US Dollar (USD)</option>
              <option value="EUR">€ Euro (EUR)</option>
            </select>
          </div>

          <div className="setting-select-row">
            <label>Distance Measurement Unit</label>
            <select value={distanceUnit} onChange={(e) => setDistanceUnit(e.target.value)}>
              <option value="km">Kilometers (km) - Indian Standard</option>
              <option value="miles">Miles (mi)</option>
            </select>
          </div>
        </div>

        {/* Dynamic AI Routing Card */}
        <div className="settings-card">
          <div className="settings-card-header">
            <Sliders size={18} />
            <h3>AI Dispatch & Routing Engine</h3>
          </div>

          <div className="setting-toggle-row">
            <div>
              <strong>Autonomous Incident Rerouting</strong>
              <p>Automatically recalculate routes when traffic is severe</p>
            </div>
            <button 
              type="button" 
              className={`toggle-switch-btn ${autoReroute ? 'active' : ''}`}
              onClick={() => setAutoReroute(!autoReroute)}
            >
              <span className="toggle-slider"></span>
            </button>
          </div>

          <div className="setting-toggle-row">
            <div>
              <strong>Real-Time Road Congestion Monitor</strong>
              <p>Poll Pune traffic incidents every 30 seconds</p>
            </div>
            <button 
              type="button" 
              className={`toggle-switch-btn ${trafficAlerts ? 'active' : ''}`}
              onClick={() => setTrafficAlerts(!trafficAlerts)}
            >
              <span className="toggle-slider"></span>
            </button>
          </div>
        </div>

        {/* Notifications & Audio Card */}
        <div className="settings-card">
          <div className="settings-card-header">
            <Bell size={18} />
            <h3>Notifications & Radio Alerts</h3>
          </div>

          <div className="setting-toggle-row">
            <div>
              <strong>Radio Audio Alerts</strong>
              <p>Play chime when driver initiates radio contact</p>
            </div>
            <button 
              type="button" 
              className={`toggle-switch-btn ${audioNotifications ? 'active' : ''}`}
              onClick={() => setAudioNotifications(!audioNotifications)}
            >
              <span className="toggle-slider"></span>
            </button>
          </div>
        </div>

        <div className="settings-save-footer">
          <button type="submit" className="btn-primary">
            Save Preferences
          </button>
        </div>

      </form>

    </div>
  );
}
