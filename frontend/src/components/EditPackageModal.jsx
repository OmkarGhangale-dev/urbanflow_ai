import React, { useState, useEffect } from 'react';
import { X, Package, Edit3, CheckCircle2, AlertCircle, Save, Truck, Calendar, MapPin, Scale, Clock, ShieldCheck } from 'lucide-react';

const DRIVERS = [
  { value: 'Mr. Arjun Sharma',   label: 'Mr. Arjun Sharma',   phone: '+91 98201 11023', rating: '4.9' },
  { value: 'Mr. Ravi Deshmukh',  label: 'Mr. Ravi Deshmukh',  phone: '+91 98201 11024', rating: '4.8' },
  { value: 'Mr. Sunil Patil',    label: 'Mr. Sunil Patil',    phone: '+91 98201 11025', rating: '4.9' },
  { value: 'Mr. Kiran Jadhav',   label: 'Mr. Kiran Jadhav',   phone: '+91 98201 11026', rating: '4.7' },
];

export default function EditPackageModal({
  isOpen,
  onClose,
  packageData,
  onUpdatePackage,
  isDarkMode
}) {
  const [formData, setFormData] = useState({
    title: '',
    shipmentNumber: '',
    category: 'Food',
    pickup: 'Central Pune Depot (D1)',
    deliveryAddress: '',
    departureDate: '12-2-26',
    arrivalDate: '17-2-26',
    weight: '25',
    priority: 'Normal',
    driver: DRIVERS[0].value,
    status: 'Prepared',
    paymentStatus: 'Prepaid',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (packageData && isOpen) {
      setFormData({
        title: packageData.title || '',
        shipmentNumber: packageData.shipmentNumber || '',
        category: packageData.category || 'Food',
        pickup: packageData.pickup || 'Central Pune Depot (D1)',
        deliveryAddress: packageData.deliveryAddress || packageData.delivery || '',
        departureDate: packageData.departureDate || '12-2-26',
        arrivalDate: packageData.arrivalDate || '17-2-26',
        weight: (packageData.weight || '25').toString().replace(/[^0-9.]/g, '') || '25',
        priority: packageData.priority || 'Normal',
        driver: packageData.driver?.name || DRIVERS[0].value,
        status: packageData.status || 'Prepared',
        paymentStatus: packageData.paymentStatus || 'Prepaid',
      });
      setSavedSuccess(false);
    }
  }, [packageData, isOpen]);

  if (!isOpen || !packageData) return null;

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.deliveryAddress.trim()) return;

    setIsSubmitting(true);
    const driverInfo = DRIVERS.find(d => d.value === formData.driver) || DRIVERS[0];

    const updatedPackage = {
      ...packageData,
      title: formData.title || `${formData.category} Consignment`,
      category: formData.category,
      pickup: formData.pickup,
      delivery: formData.deliveryAddress,
      deliveryAddress: formData.deliveryAddress,
      departureDate: formData.departureDate,
      arrivalDate: formData.arrivalDate,
      weight: `${formData.weight} kg`,
      priority: formData.priority,
      status: formData.status,
      paymentStatus: formData.paymentStatus,
      driver: {
        ...packageData.driver,
        name: driverInfo.value,
        phone: driverInfo.phone,
        rating: driverInfo.rating,
        avatar: driverInfo.value.split(' ').slice(1).map(w => w[0]).join(''),
      }
    };

    setTimeout(() => {
      onUpdatePackage(updatedPackage);
      setIsSubmitting(false);
      setSavedSuccess(true);
      setTimeout(() => {
        onClose();
      }, 400);
    }, 300);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className={`modal-card modal-wider ${isDarkMode ? 'dark-modal' : 'light-modal'}`}
        style={{ maxWidth: '580px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge" style={{ background: '#10B98122', color: '#10B981' }}>
              <Edit3 size={20} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2>Edit Consignment Details</h2>
                <span className="prepaid-verified-pill">
                  <ShieldCheck size={12} /> Prepaid Verified
                </span>
              </div>
              <p style={{ fontSize: '12px', opacity: 0.65, marginTop: 2 }}>
                Shipment #{packageData.shipmentNumber} · Allowed for Prepaid Consignments
              </p>
            </div>
          </div>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            
            {/* Shipment Number & Payment Status */}
            <div className="form-group">
              <label>Shipment Number</label>
              <input 
                type="text" 
                value={formData.shipmentNumber} 
                readOnly 
                className="input-readonly" 
              />
            </div>

            <div className="form-group">
              <label>Payment Status</label>
              <select 
                value={formData.paymentStatus} 
                onChange={e => updateField('paymentStatus', e.target.value)}
                style={{ borderColor: '#10B981', background: '#ECFDF5', color: '#065F46', fontWeight: 600 }}
              >
                <option value="Prepaid">Prepaid (Editable)</option>
                <option value="COD">Cash on Delivery (COD)</option>
                <option value="Postpaid">Postpaid / B2B Invoice</option>
              </select>
            </div>

            {/* Title / Description */}
            <div className="form-group full-width">
              <label>Consignment Description / Title</label>
              <input
                type="text"
                placeholder="e.g. Perishable Food & Grocery Consignment"
                value={formData.title}
                onChange={e => updateField('title', e.target.value)}
                required
              />
            </div>

            {/* Category */}
            <div className="form-group">
              <label>Package Category</label>
              <select 
                value={formData.category} 
                onChange={e => updateField('category', e.target.value)}
              >
                <option value="Food">Food &amp; Perishables</option>
                <option value="Clothes">Apparel &amp; Textiles</option>
                <option value="Medical">Medical Supplies (Critical)</option>
                <option value="Electronics">Electronics &amp; Hardware</option>
                <option value="Furniture">Furniture &amp; Heavy Cargo</option>
              </select>
            </div>

            {/* Consignment Status */}
            <div className="form-group">
              <label>Consignment Status</label>
              <select 
                value={formData.status} 
                onChange={e => updateField('status', e.target.value)}
              >
                <option value="Prepared">Prepared</option>
                <option value="In-transit">In-transit</option>
                <option value="Completed">Completed</option>
                <option value="Failed">Failed</option>
              </select>
            </div>

            {/* Pickup Location */}
            <div className="form-group">
              <label>Pickup Depot / Location</label>
              <select 
                value={formData.pickup} 
                onChange={e => updateField('pickup', e.target.value)}
              >
                <option value="Central Pune Depot (D1)">Central Pune Depot (D1)</option>
                <option value="East Pune Depot (D2)">East Pune Depot (D2)</option>
                <option value="Shivajinagar Hub">Shivajinagar Hub</option>
                <option value="Pune Tech Corridor">Pune Tech Corridor</option>
              </select>
            </div>

            {/* Delivery Address */}
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

            {/* Departure Date */}
            <div className="form-group">
              <label>Departure Date</label>
              <input 
                type="text" 
                value={formData.departureDate} 
                onChange={e => updateField('departureDate', e.target.value)} 
              />
            </div>

            {/* Expected Arrival Date */}
            <div className="form-group">
              <label>Expected Arrival Date</label>
              <input 
                type="text" 
                value={formData.arrivalDate} 
                onChange={e => updateField('arrivalDate', e.target.value)} 
              />
            </div>

            {/* Weight */}
            <div className="form-group">
              <label>Cargo Weight (kg)</label>
              <input 
                type="number" 
                value={formData.weight} 
                onChange={e => updateField('weight', e.target.value)} 
                min="1" 
                max="1000" 
                required 
              />
            </div>

            {/* Priority */}
            <div className="form-group">
              <label>Priority Level</label>
              <select 
                value={formData.priority} 
                onChange={e => updateField('priority', e.target.value)}
              >
                <option value="Normal">Normal</option>
                <option value="High">High</option>
                <option value="Critical">Critical (Medical/Urgent)</option>
                <option value="Low">Low</option>
              </select>
            </div>

            {/* Assigned Carrier Driver */}
            <div className="form-group full-width">
              <label>Assigned Carrier Driver</label>
              <select 
                value={formData.driver} 
                onChange={e => updateField('driver', e.target.value)}
              >
                {DRIVERS.map(d => (
                  <option key={d.value} value={d.value}>
                    {d.label} ({d.phone}) — {d.rating}★
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Edit info pill */}
          <div style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: 10,
            padding: '10px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginTop: 12,
            marginBottom: 16,
            fontSize: 12,
            color: '#047857',
          }}>
            <ShieldCheck size={16} style={{ flexShrink: 0 }} />
            <span>
              Changes will immediately update active telemetry, waybill manifest, and driver dispatch records across the platform.
            </span>
          </div>

          {/* Modal Actions */}
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isSubmitting || !formData.deliveryAddress.trim()}
              style={{ background: '#10B981', display: 'flex', alignItems: 'center', gap: 6 }}
            >
              {isSubmitting ? (
                <span>Saving changes...</span>
              ) : savedSuccess ? (
                <><CheckCircle2 size={16} /> Saved!</>
              ) : (
                <><Save size={16} /> Save Consignment Details</>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
