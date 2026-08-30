import React, { useState } from 'react';
import { FileText, Download, Eye, Search, Filter, CheckCircle2, AlertCircle } from 'lucide-react';

export default function DocumentsView({ isDarkMode }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [previewDoc, setPreviewDoc] = useState(null);

  const documents = [
    {
      id: 'DOC-8821',
      title: 'Electronic Bill of Lading (e-BOL) #BH-2017287528',
      type: 'Bill of Lading',
      consignee: 'Food Cargo Logistics Pvt Ltd',
      route: 'Central Depot D1 ➔ 3 Birrel Avenue',
      date: '2026-02-12',
      size: '245 KB',
      status: 'Verified & Signed'
    },
    {
      id: 'DOC-8822',
      title: 'Dispatch Manifest & Hazmat Clearance #ORD-003',
      type: 'Manifest',
      consignee: 'Kothrud Medical Hospital',
      route: 'East Depot D2 ➔ Kothrud Care Center',
      date: '2026-02-12',
      size: '180 KB',
      status: 'Verified & Signed'
    },
    {
      id: 'DOC-8823',
      title: 'Carbon Footprint & Eco-Route Certificate #ECO-94',
      type: 'Compliance',
      consignee: 'Pune Green Logistics Initiative',
      route: 'Fleet V01, V02, V03 City Routes',
      date: '2026-02-11',
      size: '512 KB',
      status: 'Approved'
    },
    {
      id: 'DOC-8824',
      title: 'Commercial Cargo Customs Clearance #EXP-5510',
      type: 'Customs Waybill',
      consignee: 'Apparel Textiles Export Hub',
      route: 'Shivajinagar Depot ➔ JNPT Corridor',
      date: '2026-02-10',
      size: '320 KB',
      status: 'Completed'
    }
  ];

  const filteredDocs = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    doc.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="documents-view-container">
      
      <div className="documents-header">
        <div>
          <h1>Logistics Documents & Manifests</h1>
          <p>Instant access to electronic waybills, bills of lading, and verified dispatch certificates.</p>
        </div>

        <div className="doc-search-bar">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search document ID, waybill, consignee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="documents-table-card">
        <table className="docs-table">
          <thead>
            <tr>
              <th>Document Title & ID</th>
              <th>Category</th>
              <th>Consignee / Client</th>
              <th>Route Corridor</th>
              <th>Issued Date</th>
              <th>Verification Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredDocs.map((doc) => (
              <tr key={doc.id}>
                <td>
                  <div className="doc-name-cell">
                    <div className="doc-icon-badge">
                      <FileText size={16} />
                    </div>
                    <div>
                      <strong>{doc.title}</strong>
                      <span className="doc-id-sub">{doc.id} · {doc.size}</span>
                    </div>
                  </div>
                </td>
                <td><span className="doc-type-pill">{doc.type}</span></td>
                <td>{doc.consignee}</td>
                <td><span className="route-sub-text">{doc.route}</span></td>
                <td>{doc.date}</td>
                <td>
                  <span className="status-badge-verified">
                    <CheckCircle2 size={12} />
                    <span>{doc.status}</span>
                  </span>
                </td>
                <td>
                  <div className="doc-actions-cell">
                    <button 
                      className="btn-doc-action"
                      onClick={() => setPreviewDoc(doc)}
                      title="Preview Document"
                    >
                      <Eye size={15} />
                    </button>
                    <button 
                      className="btn-doc-action"
                      onClick={() => alert(`Downloading verified PDF for ${doc.id}...`)}
                      title="Download PDF"
                    >
                      <Download size={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {previewDoc && (
        <div className="modal-overlay" onClick={() => setPreviewDoc(null)}>
          <div className="modal-card doc-preview-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{previewDoc.title}</h2>
              <button className="modal-close-btn" onClick={() => setPreviewDoc(null)}>✕</button>
            </div>
            <div className="doc-preview-body">
              <div className="preview-certificate-header">
                <h3>URBANFLOW AI LOGISTICS PLATFORM</h3>
                <p>Verified Electronic Consignment Certificate · SHA-256 Validated</p>
              </div>
              <div className="preview-grid">
                <div><strong>Document Ref:</strong> {previewDoc.id}</div>
                <div><strong>Document Type:</strong> {previewDoc.type}</div>
                <div><strong>Consignee:</strong> {previewDoc.consignee}</div>
                <div><strong>Dispatch Corridor:</strong> {previewDoc.route}</div>
                <div><strong>Date Authorized:</strong> {previewDoc.date}</div>
                <div><strong>Audit Status:</strong> {previewDoc.status}</div>
              </div>
              <div className="preview-stamp">
                ✓ DIGITALLY AUTHENTICATED
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
