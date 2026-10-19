import React, { useState, useMemo } from 'react';
import { 
  Package, 
  Search, 
  Filter, 
  Plus, 
  Eye, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowUpDown, 
  MapPin, 
  Calendar,
  FileText,
  Truck,
  Edit3,
  CreditCard,
  DollarSign,
  Archive,
  ShieldCheck
} from 'lucide-react';

export default function OrdersView({ 
  packages, 
  onNewPackageClick, 
  onEditPackage,
  onViewDetails,
  isDarkMode,
  currencySymbol = '₹' 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedPriority, setSelectedPriority] = useState('ALL');
  const [selectedPayment, setSelectedPayment] = useState('ALL');
  const [selectedDashboardFilter, setSelectedDashboardFilter] = useState('ALL');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const ordersList = useMemo(() => {
    return packages.map((p, idx) => {
      // Generate rich order data
      const prices = [1250, 850, 2400, 450, 3100, 950];
      const customers = [
        { name: 'Dr. Ramesh Kulkarni', company: 'Sahyadri Hospital', address: 'Kothrud, Pune', phone: '+91 98220 12345' },
        { name: 'Pooja Deshmukh', company: 'FabIndia Textiles', address: '19th Avenue, Pune', phone: '+91 98220 23456' },
        { name: 'Vikas Shah', company: 'Nature Fresh Organics', address: 'Koregaon Park, Pune', phone: '+91 98220 34567' },
        { name: 'Amitabh Joshi', company: 'TechSys Hardware', address: 'Shivajinagar, Pune', phone: '+91 98220 45678' }
      ];

      return {
        ...p,
        orderId: `ORD-${(1001 + idx)}`,
        price: p.price || prices[idx % prices.length],
        customer: customers[idx % customers.length],
        paymentStatus: p.paymentStatus || (idx % 2 === 0 ? 'Prepaid' : 'COD'),
        priority: p.priority || (idx === 4 ? 'Critical' : idx === 0 || idx === 1 ? 'High' : 'Normal'),
        timeWindow: idx === 4 ? '09:00 - 10:30 AM' : idx === 0 ? '10:00 - 12:00 PM' : '11:00 - 02:00 PM',
        itemsCount: Math.floor(Math.random() * 8) + 2
      };
    });
  }, [packages]);

  // Filter orders
  const filteredOrders = useMemo(() => {
    return ordersList.filter(o => {
      const matchSearch = 
        o.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.shipmentNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.deliveryAddress?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.paymentStatus?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchStatus = selectedStatus === 'ALL' || o.status?.toUpperCase() === selectedStatus.toUpperCase();
      const matchPriority = selectedPriority === 'ALL' || o.priority?.toUpperCase() === selectedPriority.toUpperCase();
      const matchPayment = selectedPayment === 'ALL' || o.paymentStatus?.toUpperCase() === selectedPayment.toUpperCase();
      const matchDashboard = 
        selectedDashboardFilter === 'ALL' ||
        (selectedDashboardFilter === 'ACTIVE' && !o.isDeletedFromDashboard) ||
        (selectedDashboardFilter === 'REMOVED' && o.isDeletedFromDashboard);

      return matchSearch && matchStatus && matchPriority && matchPayment && matchDashboard;
    });
  }, [ordersList, searchQuery, selectedStatus, selectedPriority, selectedPayment, selectedDashboardFilter]);

  const getPriorityBadgeClass = (priority) => {
    switch (priority.toLowerCase()) {
      case 'critical':
        return 'priority-critical';
      case 'high':
        return 'priority-high';
      case 'low':
        return 'priority-low';
      case 'normal':
      default:
        return 'priority-normal';
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status.toLowerCase()) {
      case 'in-transit':
        return 'badge-in-transit';
      case 'completed':
        return 'badge-completed';
      case 'failed':
        return 'badge-failed';
      case 'prepared':
      default:
        return 'badge-prepared';
    }
  };

  return (
    <div className="orders-view-container">
      
      {/* Top Header */}
      <div className="orders-view-header">
        <div>
          <h1>Consignment & Orders Repository</h1>
          <p>Manage customer shipments, dispatch manifests, priority delivery windows, and order SLAs in {currencySymbol} INR.</p>
        </div>

        <button className="btn-primary" onClick={onNewPackageClick}>
          <Plus size={16} />
          <span>New Consignment Order</span>
        </button>
      </div>

      {/* Quick Filter & Stats Bar */}
      <div className="orders-filters-bar">
        <div className="orders-search-input">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search order ID, shipment number, customer, street..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="filter-dropdowns-group">
          <select 
            value={selectedDashboardFilter} 
            onChange={(e) => setSelectedDashboardFilter(e.target.value)}
            className="filter-select-pill"
            style={{ fontWeight: 600 }}
          >
            <option value="ALL">All Records (DB)</option>
            <option value="ACTIVE">Active on Dashboard</option>
            <option value="REMOVED">Removed from Dashboard</option>
          </select>

          <select 
            value={selectedPayment} 
            onChange={(e) => setSelectedPayment(e.target.value)}
            className="filter-select-pill"
          >
            <option value="ALL">All Payments</option>
            <option value="PREPAID">Prepaid (Editable)</option>
            <option value="COD">COD / Unpaid</option>
          </select>

          <select 
            value={selectedStatus} 
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="filter-select-pill"
          >
            <option value="ALL">All Statuses</option>
            <option value="PREPARED">Prepared</option>
            <option value="IN-TRANSIT">In-transit</option>
            <option value="COMPLETED">Completed</option>
            <option value="FAILED">Failed</option>
          </select>

          <select 
            value={selectedPriority} 
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="filter-select-pill"
          >
            <option value="ALL">All Priorities</option>
            <option value="CRITICAL">Critical (Urgent)</option>
            <option value="HIGH">High Priority</option>
            <option value="NORMAL">Normal Priority</option>
          </select>
        </div>
      </div>

      {/* Orders Table Card */}
      <div className="orders-table-card">
        <table className="orders-data-table">
          <thead>
            <tr>
              <th>Order ID &amp; Shipment</th>
              <th>Category &amp; Description</th>
              <th>Customer / Consignee</th>
              <th>Delivery Address</th>
              <th>Payment</th>
              <th>Priority</th>
              <th>Status &amp; Dashboard</th>
              <th>Order Value</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="9" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  No orders match your filter criteria.
                </td>
              </tr>
            ) : (
              filteredOrders.map((order) => (
                <tr key={order.orderId} onClick={() => setSelectedOrder(order)}>
                  <td>
                    <div className="order-code-cell">
                      <strong className="order-id-txt">{order.orderId}</strong>
                      <span className="shipment-sub-txt">{order.shipmentNumber}</span>
                    </div>
                  </td>

                  <td>
                    <div className="order-desc-cell">
                      <strong>{order.category}</strong>
                      <span className="desc-sub-txt">{order.title}</span>
                    </div>
                  </td>

                  <td>
                    <div className="customer-cell">
                      <strong>{order.customer.name}</strong>
                      <span className="company-sub-txt">{order.customer.company}</span>
                    </div>
                  </td>

                  <td>
                    <div className="location-cell">
                      <MapPin size={13} className="loc-pin-icon" />
                      <span>{order.deliveryAddress}</span>
                    </div>
                  </td>

                  <td>
                    {order.paymentStatus?.toLowerCase() === 'prepaid' ? (
                      <span className="payment-table-pill prepaid" title="Prepaid Consignment — Editable">
                        <CreditCard size={11} /> Prepaid
                      </span>
                    ) : (
                      <span className="payment-table-pill cod" title="Non-prepaid consignment">
                        <DollarSign size={11} /> {order.paymentStatus || 'COD'}
                      </span>
                    )}
                  </td>

                  <td>
                    <span className={`priority-badge ${getPriorityBadgeClass(order.priority)}`}>
                      {order.priority}
                    </span>
                  </td>

                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-start' }}>
                      <span className={`card-status-badge ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                      {order.isDeletedFromDashboard && (
                        <span className="dashboard-archive-pill" title="Removed from Dashboard view, but data safely preserved in DB and Orders page">
                          <Archive size={10} /> Removed from Dashboard
                        </span>
                      )}
                    </div>
                  </td>

                  <td>
                    <strong className="price-tag-txt">{currencySymbol}{order.price.toLocaleString()}</strong>
                  </td>

                  <td>
                    <div className="order-actions-cell" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button 
                        className="btn-order-view"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOrder(order);
                        }}
                        title="View Full Waybill Details"
                      >
                        <Eye size={15} />
                      </button>

                      {/* EDIT OPTION — strictly for Prepaid consignments */}
                      {order.paymentStatus?.toLowerCase() === 'prepaid' && (
                        <button 
                          className="btn-order-edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onEditPackage) onEditPackage(order);
                          }}
                          title="Edit Prepaid Consignment Details"
                        >
                          <Edit3 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Order Deep-Dive Details Modal */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-card order-deep-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-wrap">
                <div className="modal-icon-badge">
                  <Package size={20} />
                </div>
                <div>
                  <h2>Consignment Details: {selectedOrder.orderId}</h2>
                  <p>Tracking Code #{selectedOrder.shipmentNumber}</p>
                </div>
              </div>
              <button className="modal-close-btn" onClick={() => setSelectedOrder(null)}>✕</button>
            </div>

            <div className="order-details-grid">
              <div className="detail-item">
                <span className="d-label">Customer Name</span>
                <strong className="d-val">{selectedOrder.customer.name} ({selectedOrder.customer.company})</strong>
              </div>
              <div className="detail-item">
                <span className="d-label">Delivery Destination</span>
                <strong className="d-val">{selectedOrder.deliveryAddress}</strong>
              </div>
              <div className="detail-item">
                <span className="d-label">Assigned Carrier Driver</span>
                <strong className="d-val">{selectedOrder.driver?.name || 'Mr. Arjun Sharma'}</strong>
              </div>
              <div className="detail-item">
                <span className="d-label">Declared Order Value</span>
                <strong className="d-val green-text">{currencySymbol}{selectedOrder.price.toLocaleString()}</strong>
              </div>
              <div className="detail-item">
                <span className="d-label">Cargo Weight</span>
                <strong className="d-val">{selectedOrder.weight}</strong>
              </div>
              <div className="detail-item">
                <span className="d-label">Priority Level</span>
                <strong className="d-val">{selectedOrder.priority}</strong>
              </div>
            </div>

            <div className="order-items-manifest">
              <h4>Consignment Contents</h4>
              <div className="items-row-pill">
                <span>📦 {selectedOrder.title} ({selectedOrder.weight})</span>
                <span className="verified-tag">✓ Inspected & QR Coded</span>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-secondary" onClick={() => setSelectedOrder(null)}>Close</button>
              <button className="btn-primary" onClick={() => { alert(`Waybill PDF generated for ${selectedOrder.orderId}`); setSelectedOrder(null); }}>
                Print Dispatch Waybill
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
