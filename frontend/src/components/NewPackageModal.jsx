import React, { useState, useEffect, useCallback } from 'react';
import { X, Package, MapPin, Scale, Brain, Sparkles, CheckCircle2, Leaf, Zap, Navigation, Send, Loader2, ArrowLeft, ArrowRight, Clock, Droplets, Star } from 'lucide-react';
import { getAIRouteOptions } from '../api';

const DRIVERS = [
  { value: 'Mr. Arjun Sharma',   label: 'Mr. Arjun Sharma',   phone: '+91 98201 11023', rating: '4.9' },
  { value: 'Mr. Ravi Deshmukh',  label: 'Mr. Ravi Deshmukh',  phone: '+91 98201 11024', rating: '4.8' },
  { value: 'Mr. Sunil Patil',    label: 'Mr. Sunil Patil',    phone: '+91 98201 11025', rating: '4.9' },
  { value: 'Mr. Kiran Jadhav',   label: 'Mr. Kiran Jadhav',   phone: '+91 98201 11026', rating: '4.7' },
];

const iconMap = { leaf: <Leaf size={18} />, zap: <Zap size={18} />, scale: <Star size={18} /> };
const bgMap   = { green: '#D1FAE522', blue: '#DBEAFE22', purple: '#EDE9FE22' };
const colMap  = { green: '#10B981',   blue: '#3B82F6',   purple: '#8B5CF6' };

export default function NewPackageModal({ isOpen, onClose, onAddPackage, onFormChange, isDarkMode }) {
  const [step, setStep]         = useState(1); // 1 = form, 2 = pick route
  const [formData, setFormData] = useState({
    title: '',
    shipmentNumber: `BH-${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    category: 'Food',
    pickupLocation: 'Central Pune Depot (D1)',
    deliveryAddress: '',
    departureDate: '12-2-26',
    arrivalDate: '17-2-26',
    weight: '25',
    priority: 'high',
    driver: DRIVERS[0].value,
    status: 'Prepared',
    paymentStatus: 'Prepaid',
  });

  const [routeOptions,    setRouteOptions]    = useState(null);
  const [selectedRoute,   setSelectedRoute]   = useState(null);
  const [loadingRoutes,   setLoadingRoutes]   = useState(false);
  const [routeError,      setRouteError]      = useState(null);
  const [aiPowered,       setAiPowered]       = useState(false);
  const [isSubmitting,    setIsSubmitting]    = useState(false);

  const triggerFormChange = useCallback((data) => {
    if (onFormChange) onFormChange(data);
  }, [onFormChange]);

  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setRouteOptions(null);
      setSelectedRoute(null);
      setRouteError(null);
      triggerFormChange(formData);
    }
  }, [isOpen]); // eslint-disable-line

  const updateField = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    triggerFormChange(updated);
  };

  if (!isOpen) return null;

  /* ── Step 1 → Step 2: fetch AI route options ─────────────────── */
  const handleGetRoutes = async (e) => {
    e.preventDefault();
    if (!formData.deliveryAddress.trim()) return;
    setLoadingRoutes(true);
    setRouteError(null);
    setRouteOptions(null);
    setSelectedRoute(null);
    setStep(2);

    try {
      const res = await getAIRouteOptions(formData);
      setRouteOptions(res.options);
      setAiPowered(res.ai_powered);
    } catch {
      setRouteError('AI unreachable — showing calculated estimates.');
      const w = parseFloat(formData.weight) || 25;
      const dest = formData.deliveryAddress || 'Destination';
      const cat  = formData.category || 'General';
      setRouteOptions([
        {
          id: 'eco', label: 'Option A: Cost-Effective Route', badge: 'Most Cost Effective',
          badgeColor: 'green', icon: 'leaf',
          cost: `₹${Math.round(w * 14).toLocaleString()}`,
          time: `${Math.round(w * 0.6 + 38)} mins`,
          distance: `${(w * 0.18 + 22).toFixed(1)} km`,
          fuel: `${(w * 0.08 + 3.2).toFixed(1)} L`,
          sla: '98.5%', co2: `${(w * 0.04 + 1.2).toFixed(1)} kg saved`,
          route: `Depot → Senapati Bapat Marg → Karve Road → ${dest}`,
          why: `This route uses Senapati Bapat Marg and Karve Road — two of Pune's least-congested arterial roads during peak hours — saving ₹${Math.round(w * 5).toLocaleString()} compared to the express option. For ${cat} cargo weighing ${w} kg this is ideal because the slightly longer travel time (${Math.round(w * 0.6 + 38)} mins) poses no risk to delivery quality. The main trade-off is speed: if there's any urgency, choose Option B instead.`,
          color: '#10B981',
        },
        {
          id: 'express', label: 'Option B: Quick Service Route', badge: 'Fastest Delivery',
          badgeColor: 'blue', icon: 'zap',
          cost: `₹${Math.round(w * 19).toLocaleString()}`,
          time: `${Math.round(w * 0.32 + 20)} mins`,
          distance: `${(w * 0.12 + 14).toFixed(1)} km`,
          fuel: `${(w * 0.11 + 4.5).toFixed(1)} L`,
          sla: '100%', co2: `${(w * 0.06 + 2.1).toFixed(1)} kg`,
          route: `Depot → FC Road Flyover → Bypass Corridor → ${dest}`,
          why: `This route takes the FC Road Flyover and the Pune bypass corridor, completely skipping city intersections and traffic signals — arriving ${Math.round(w * 0.28 + 18)} mins faster than the eco route. ${cat === 'Medical' ? 'This is MANDATORY for medical cargo — select this option immediately.' : `Choose this when your customer has a strict time window or the ${cat} cargo is time-sensitive.`} The higher cost (₹${Math.round(w * 19).toLocaleString()}) is justified by the 100% SLA guarantee.`,
          color: '#3B82F6',
        },
        {
          id: 'balanced', label: 'Option C: Best Overall Route', badge: 'Best Overall',
          badgeColor: 'purple', icon: 'scale',
          cost: `₹${Math.round(w * 16).toLocaleString()}`,
          time: `${Math.round(w * 0.47 + 30)} mins`,
          distance: `${(w * 0.15 + 18).toFixed(1)} km`,
          fuel: `${(w * 0.09 + 3.8).toFixed(1)} L`,
          sla: '99.5%', co2: `${(w * 0.045 + 1.6).toFixed(1)} kg`,
          route: `Depot → Paud Road → Karve Road → ${dest}`,
          why: `The Paud Road–Karve Road corridor gives the best balance of speed and cost for this ${cat} shipment of ${w} kg. It's ${Math.round(w * 0.13 + 8)} mins faster than Option A while costing ₹${Math.round(w * 3).toLocaleString()} less than Option B, maintaining a strong 99.5% SLA. This is the recommended default for most standard consignments — reliable, cost-efficient, and safe.`,
          color: '#8B5CF6',
        },
      ]);
      setAiPowered(false);
    } finally {
      setLoadingRoutes(false);
    }
  };

  /* ── Step 2 → Dispatch ───────────────────────────────────────── */
  const handleDispatch = () => {
    if (!selectedRoute) return;
    setIsSubmitting(true);
    const chosen = routeOptions.find(o => o.id === selectedRoute);
    const driverInfo = DRIVERS.find(d => d.value === formData.driver) || DRIVERS[0];

    setTimeout(() => {
      onAddPackage({
        id: `ORD-${Date.now().toString().slice(-4)}`,
        shipmentNumber: formData.shipmentNumber,
        title: formData.title || `${formData.category} Cargo Consignment`,
        category: formData.category,
        pickup: formData.pickupLocation,
        delivery: formData.deliveryAddress,
        deliveryAddress: formData.deliveryAddress,
        departureDate: formData.departureDate,
        arrivalDate: formData.arrivalDate,
        weight: `${formData.weight} kg`,
        priority: formData.priority,
        status: formData.status,
        paymentStatus: formData.paymentStatus || 'Prepaid',
        isDeletedFromDashboard: false,
        driver: {
          name: driverInfo.value,
          phone: driverInfo.phone,
          rating: driverInfo.rating,
          avatar: driverInfo.value.split(' ').slice(1).map(w => w[0]).join(''),
        },
        routeExplanation: {
          chosenRoute: chosen?.route || '',
          whyChosen:   chosen?.why  || '',
          savings:     chosen ? `${chosen.cost} · ${chosen.fuel} fuel · CO₂ ${chosen.co2 || '—'}` : '',
          eta:         chosen?.time || '—',
          sla:         chosen?.sla  || '—',
        },
      });
      setIsSubmitting(false);
      onClose();
    }, 400);
  };

  return (
    <div className="modal-overlay">
      <div className={`modal-card modal-wider ${isDarkMode ? 'dark-modal' : 'light-modal'}`} style={{ maxWidth: '560px' }}>

        {/* ── HEADER ── */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge"><Package size={20} /></div>
            <div>
              <h2>{step === 1 ? 'Create New Shipment' : 'Choose Your Route'}</h2>
              <p style={{ fontSize: '12px', opacity: 0.65, marginTop: 2 }}>
                {step === 1
                  ? 'Fill in consignment details — AI will suggest optimal routes next'
                  : 'AI has calculated 3 route options. Pick one to dispatch.'}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Step pills */}
            <div style={{ display: 'flex', gap: 6 }}>
              {[1, 2].map(s => (
                <div key={s} style={{
                  width: 28, height: 6, borderRadius: 3,
                  background: s <= step ? '#6366F1' : '#E5E7EB',
                  transition: 'background 0.3s',
                }} />
              ))}
            </div>
            <button className="modal-close-btn" onClick={onClose}><X size={18} /></button>
          </div>
        </div>

        {/* ══════════════ STEP 1 — FORM ══════════════ */}
        {step === 1 && (
          <form onSubmit={handleGetRoutes} className="modal-form">
            <div className="form-grid">

              <div className="form-group full-width">
                <label>Shipment Number (Auto-Generated)</label>
                <input type="text" value={formData.shipmentNumber} readOnly className="input-readonly" />
              </div>

              <div className="form-group">
                <label>Package Category</label>
                <select value={formData.category} onChange={e => updateField('category', e.target.value)}>
                  <option value="Food">Food &amp; Perishables</option>
                  <option value="Clothes">Apparel &amp; Textiles</option>
                  <option value="Medical">Medical Supplies (Critical)</option>
                  <option value="Electronics">Electronics &amp; Hardware</option>
                  <option value="Furniture">Furniture &amp; Heavy Cargo</option>
                </select>
              </div>

              <div className="form-group">
                <label>Initial Status</label>
                <select value={formData.status} onChange={e => updateField('status', e.target.value)}>
                  <option value="Prepared">Prepared</option>
                  <option value="In-transit">In-transit</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="form-group">
                <label>Payment Status</label>
                <select value={formData.paymentStatus} onChange={e => updateField('paymentStatus', e.target.value)}>
                  <option value="Prepaid">Prepaid (Edit Enabled)</option>
                  <option value="COD">Cash on Delivery (COD)</option>
                  <option value="Postpaid">Postpaid / B2B Invoice</option>
                </select>
              </div>

              <div className="form-group">
                <label>Pickup Depot</label>
                <select value={formData.pickupLocation} onChange={e => updateField('pickupLocation', e.target.value)}>
                  <option value="Central Pune Depot (D1)">Central Pune Depot (D1)</option>
                  <option value="East Pune Depot (D2)">East Pune Depot (D2)</option>
                  <option value="Shivajinagar Hub">Shivajinagar Hub</option>
                </select>
              </div>

              <div className="form-group">
                <label>Delivery Address / Street <span style={{ color: '#EF4444' }}>*</span></label>
                <input
                  type="text"
                  placeholder="e.g. 3 Birrel Avenue, Kothrud"
                  value={formData.deliveryAddress}
                  onChange={e => updateField('deliveryAddress', e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Departure Date</label>
                <input type="text" value={formData.departureDate} onChange={e => updateField('departureDate', e.target.value)} />
              </div>

              <div className="form-group">
                <label>Expected Arrival Date</label>
                <input type="text" value={formData.arrivalDate} onChange={e => updateField('arrivalDate', e.target.value)} />
              </div>

              <div className="form-group">
                <label>Weight (kg)</label>
                <input type="number" value={formData.weight} onChange={e => updateField('weight', e.target.value)} min="1" max="500" />
              </div>

              <div className="form-group">
                <label>Assigned Driver</label>
                <select value={formData.driver} onChange={e => updateField('driver', e.target.value)}>
                  {DRIVERS.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                </select>
              </div>

            </div>

            <div style={{
              background: '#EEF2FF', borderRadius: 10, padding: '10px 14px',
              display: 'flex', alignItems: 'center', gap: 8,
              marginBottom: 16, fontSize: 13, color: '#4338CA',
            }}>
              <Brain size={14} />
              <span>Next step: AI will suggest <strong>3 optimised route options</strong> with full explanations — you choose before dispatching.</span>
            </div>

            <div className="modal-actions">
              <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn-primary" disabled={!formData.deliveryAddress.trim()}>
                <Sparkles size={15} /> Get AI Route Options →
              </button>
            </div>
          </form>
        )}

        {/* ══════════════ STEP 2 — ROUTE OPTIONS ══════════════ */}
        {step === 2 && (
          <div className="modal-form" style={{ paddingTop: 0 }}>

            {/* Loading */}
            {loadingRoutes && (
              <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                <Loader2 size={32} className="spin-anim" style={{ color: '#6366F1', margin: '0 auto 12px' }} />
                <p style={{ fontWeight: 600, marginBottom: 4 }}>AI is calculating routes…</p>
                <p style={{ fontSize: 12, opacity: 0.6 }}>Analysing traffic on Pune roads, cargo type, and priority level</p>
              </div>
            )}

            {/* Error notice */}
            {routeError && !loadingRoutes && (
              <div style={{ background: '#FEF3C7', borderRadius: 8, padding: '8px 12px', fontSize: 12, color: '#92400E', marginBottom: 12, display: 'flex', gap: 6 }}>
                <span>⚠️</span> {routeError}
              </div>
            )}

            {/* AI badge */}
            {aiPowered && !loadingRoutes && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#7C3AED', background: '#EDE9FE', borderRadius: 20, padding: '4px 12px', width: 'fit-content', marginBottom: 10 }}>
                <Sparkles size={11} /> Powered by Groq AI · llama3-8b-8192
              </div>
            )}

            {/* Route cards */}
            {!loadingRoutes && routeOptions && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16, maxHeight: '420px', overflowY: 'auto' }}>
                {routeOptions.map(opt => {
                  const isSelected = selectedRoute === opt.id;
                  const col = colMap[opt.badgeColor] || opt.color || '#6366F1';
                  return (
                    <div
                      key={opt.id}
                      onClick={() => setSelectedRoute(opt.id)}
                      style={{
                        border: `2px solid ${isSelected ? col : '#E5E7EB'}`,
                        borderRadius: 12,
                        padding: '14px',
                        cursor: 'pointer',
                        background: isSelected ? `${col}08` : 'transparent',
                        transition: 'all 0.2s',
                      }}
                    >
                      {/* Card header */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 8, background: `${col}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: col, flexShrink: 0 }}>
                          {iconMap[opt.icon]}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 13 }}>{opt.label}</div>
                          <span style={{ fontSize: 11, background: `${col}18`, color: col, padding: '2px 8px', borderRadius: 20, fontWeight: 600 }}>{opt.badge}</span>
                        </div>
                        {isSelected && <CheckCircle2 size={20} style={{ color: col, flexShrink: 0 }} />}
                      </div>

                      {/* Metrics */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, marginBottom: 10 }}>
                        {[['Cost', opt.cost], ['ETA', opt.time], ['Distance', opt.distance], ['SLA', opt.sla]].map(([k, v]) => (
                          <div key={k} style={{ background: '#F9FAFB', borderRadius: 8, padding: '6px 8px', textAlign: 'center' }}>
                            <div style={{ fontSize: 10, opacity: 0.55, marginBottom: 2 }}>{k}</div>
                            <div style={{ fontWeight: 700, fontSize: 12, color: k === 'SLA' ? '#10B981' : 'inherit' }}>{v}</div>
                          </div>
                        ))}
                      </div>

                      {/* Fuel & CO2 */}
                      {opt.fuel && (
                        <div style={{ display: 'flex', gap: 12, fontSize: 11, opacity: 0.65, marginBottom: 10 }}>
                          <span><Droplets size={11} style={{ display: 'inline', verticalAlign: 'middle' }} /> {opt.fuel} fuel</span>
                          {opt.co2 && <span>🌿 {opt.co2} CO₂</span>}
                        </div>
                      )}

                      {/* Route path */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: col, background: `${col}10`, borderRadius: 6, padding: '5px 8px', marginBottom: 10 }}>
                        <Navigation size={11} /> <span>{opt.route}</span>
                      </div>

                      {/* WHY explanation — the key improvement */}
                      <div style={{ background: '#F8FAFC', borderRadius: 8, padding: '10px 12px' }}>
                        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.06em', color: '#6B7280', marginBottom: 6, textTransform: 'uppercase' }}>
                          💡 Why this route?
                        </div>
                        <p style={{ fontSize: 12, lineHeight: 1.6, color: '#374151', margin: 0 }}>{opt.why}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="modal-actions" style={{ paddingTop: 8, borderTop: '1px solid #F3F4F6' }}>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => { setStep(1); setRouteOptions(null); setSelectedRoute(null); }}
                style={{ display: 'flex', alignItems: 'center', gap: 6 }}
              >
                <ArrowLeft size={14} /> Back
              </button>
              <button
                type="button"
                className="btn-primary"
                disabled={!selectedRoute || isSubmitting || loadingRoutes}
                onClick={handleDispatch}
                style={{ display: 'flex', alignItems: 'center', gap: 6, opacity: (!selectedRoute || loadingRoutes) ? 0.5 : 1 }}
              >
                {isSubmitting
                  ? <><Loader2 size={14} className="spin-anim" /> Dispatching…</>
                  : <><Send size={14} /> Dispatch with Selected Route</>}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
