import React, { useState } from 'react';
import { Headphones, Send, Star, ExternalLink, CheckCircle, MessageSquare, Copy } from 'lucide-react';

export default function CustomerView({ isDarkMode }) {
  const [trackingNumber, setTrackingNumber] = useState('BH-2017287528');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerateLink = (e) => {
    e.preventDefault();
    const link = `https://urbanflow.ai/track/${trackingNumber}`;
    setGeneratedLink(link);
    setCopied(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="customer-view-container">
      
      <div className="customer-header">
        <div>
          <h1 className="view-title">Customer Experience & Support Portal</h1>
          <p className="view-sub-desc">Generate branded live tracking links for recipients and manage client inquiries in real time.</p>
        </div>
      </div>

      <div className="customer-grid-layout">
        
        {/* Tracking Link Generator */}
        <div className="customer-card">
          <div className="card-header-styled">
            <ExternalLink size={18} className="header-icon-accent" />
            <h3 className="card-title-txt">Generate Recipient Live Tracking Link</h3>
          </div>

          <p className="card-sub-info">
            Send this live SMS/Email link to customers so they can see their driver approaching with exact real-time GPS arrival times.
          </p>

          <form onSubmit={handleGenerateLink} className="link-generator-form">
            <label className="form-label-txt">Shipment / Consignment Number</label>
            <div className="input-with-button">
              <input 
                type="text" 
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="e.g. BH-2017287528"
                className="portal-input"
              />
              <button type="submit" className="btn-primary">Generate Link</button>
            </div>
          </form>

          {generatedLink && (
            <div className="generated-link-box">
              <div className="link-text-wrap">
                <span className="link-title">Customer Public Tracking URL:</span>
                <code className="link-code">{generatedLink}</code>
              </div>
              <button className="btn-copy" onClick={handleCopy}>
                <Copy size={14} />
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Customer Reviews & Feedback */}
        <div className="customer-card">
          <div className="card-header-styled">
            <Star size={18} className="header-icon-amber" />
            <h3 className="card-title-txt">Recent Customer Delivery Ratings</h3>
          </div>

          <div className="ratings-list">
            {[
              { name: 'Dr. Ramesh Kulkarni', shipment: 'BH-2017287528', stars: 5, comment: 'Exceptional speed on the medical consignment! Driver Mr. Arjun called 5 mins before arrival.' },
              { name: 'Pooja Deshmukh', shipment: 'BH-2017287529', stars: 5, comment: 'Very smooth delivery. The live tracking map was remarkably accurate.' },
              { name: 'Vikas Shah', shipment: 'BH-2017287530', stars: 5, comment: 'Bypassed the traffic jam and still delivered on time. Highly recommended.' }
            ].map((r, i) => (
              <div key={i} className="rating-item-card">
                <div className="rating-top">
                  <strong className="customer-name-txt">{r.name}</strong>
                  <div className="stars-row">
                    {'★'.repeat(r.stars)}
                  </div>
                </div>
                <p className="rating-comment">"{r.comment}"</p>
                <span className="rating-shipment-id">Order Ref: {r.shipment}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
