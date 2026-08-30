import React, { useState } from 'react';
import { 
  ChevronDown, 
  Search, 
  MapPin, 
  MoreVertical, 
  Phone, 
  MessageCircle, 
  Truck, 
  Circle 
} from 'lucide-react';

export default function OrdersDashboard({ orders }) {
  const [selectedOrderId, setSelectedOrderId] = useState(orders[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);

  // Filter orders based on search query and status filter
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.pickup.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.delivery.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = 
      statusFilter === 'ALL' || 
      order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Get selected order details
  const selectedOrder = orders.find(order => order.id === selectedOrderId) || filteredOrders[0] || orders[0];

  const handleFilterSelect = (status) => {
    setStatusFilter(status);
    setIsFilterDropdownOpen(false);
  };

  return (
    <div className="orders-dashboard-layout">
      
      {/* ================= COLUMN 1: ORDERS LIST ================= */}
      <section className="orders-panel">
        <div className="panel-header">
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center' }}>
              Orders 
              <span className="count">{filteredOrders.length}</span>
            </h1>
            <p>Manage active logistics operations</p>
          </div>

          <div className="filter-btn-container">
            <button 
              className="filter-btn" 
              onClick={() => setIsFilterDropdownOpen(!isFilterDropdownOpen)}
            >
              {statusFilter === 'ALL' ? 'All' : statusFilter}
              <ChevronDown size={13} />
            </button>

            {isFilterDropdownOpen && (
              <div className="filter-dropdown">
                {['ALL', 'IN PROGRESS', 'PENDING', 'PICKED UP', 'DELIVERED'].map((status) => (
                  <button
                    key={status}
                    className={`filter-option ${statusFilter === status ? 'active' : ''}`}
                    onClick={() => handleFilterSelect(status)}
                  >
                    {status === 'ALL' ? 'All' : status}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="search">
          <Search size={16} />
          <input 
            type="text" 
            placeholder="Search by number, name, address..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="orders-list">
          {filteredOrders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--muted)', fontSize: '12px' }}>
              No orders match your criteria.
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div 
                key={order.id} 
                className={`order-card ${selectedOrder?.id === order.id ? 'selected' : ''}`}
                onClick={() => setSelectedOrderId(order.id)}
              >
                <div className="order-top">
                  <span className={`status ${order.statusClass}`}>
                    {order.status} · {order.statusTime}
                  </span>
                  <MoreVertical size={15} style={{ color: '#98a2b3', cursor: 'pointer' }} />
                </div>

                <h3>{order.title}</h3>

                <div className="location">
                  <MapPin size={13} />
                  <div>
                    <small>From</small>
                    <p>{order.pickup}</p>
                  </div>
                </div>

                <div className="location">
                  <MapPin size={13} />
                  <div>
                    <small>To</small>
                    <p>{order.delivery}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ================= COLUMN 2: ITINERARY DETAILS ================= */}
      <section className="details-panel">
        {selectedOrder ? (
          <>
            <div className="details-header">
              <h2>Itinerary & Driver Details</h2>
            </div>

            {/* ROUTE STEPS */}
            <div className="route">
              <div className="route-line"></div>
              {selectedOrder.routePoints.map((point, index) => (
                <div key={index} className="route-point">
                  <span className={`dot ${point.isComplete ? 'green' : 'blue'}`}></span>
                  <div>
                    {point.type && <small>{point.type}</small>}
                    <p>{point.name}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* DRIVER */}
            <div className="section">
              <div className="driver-header">
                <div className="driver-avatar">
                  {selectedOrder.driver.avatarText}
                </div>
                <div className="driver-info">
                  <small>Driver</small>
                  <h3>{selectedOrder.driver.name}</h3>
                </div>
                <a href={`tel:${selectedOrder.driver.phone}`} className="icon-button" title="Call Driver">
                  <Phone size={14} />
                </a>
                <div className="rating">
                  ★ {selectedOrder.driver.rating}
                </div>
              </div>

              <div className="driver-details">
                <div>
                  <small>Address</small>
                  <p>{selectedOrder.driver.address}</p>
                </div>
                <div>
                  <small>Email</small>
                  <p>{selectedOrder.driver.email}</p>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <small>Phone</small>
                  <p>{selectedOrder.driver.phone}</p>
                </div>
              </div>
            </div>

            {/* VEHICLE */}
            <div className="section">
              <div className="section-title">
                <h3>Vehicle Information</h3>
                <button className="outline-btn">View Details</button>
              </div>

              <div className="vehicle-info">
                <div className="vehicle-icon">
                  <Truck size={20} />
                </div>
                <div>
                  <small>Registration</small>
                  <strong>{selectedOrder.vehicle.registration}</strong>
                </div>
                <div className="vehicle-status">
                  <span className={`badge ${selectedOrder.vehicle.statusClass}`}>
                    {selectedOrder.vehicle.status}
                  </span>
                </div>
              </div>
            </div>

            {/* CUSTOMER */}
            <div className="section customer">
              <div className="driver-header">
                <div className="customer-avatar">
                  {selectedOrder.customer.avatarText}
                </div>
                <div className="driver-info">
                  <small>Customer</small>
                  <h3>{selectedOrder.customer.name}</h3>
                </div>
                <button className="icon-button" title="Message Customer">
                  <MessageCircle size={14} />
                </button>
                <a href={`tel:${selectedOrder.customer.phone}`} className="icon-button" title="Call Customer">
                  <Phone size={14} />
                </a>
              </div>

              <div className="driver-details">
                <div>
                  <small>Address</small>
                  <p>{selectedOrder.customer.address}</p>
                </div>
                <div>
                  <small>Email</small>
                  <p>{selectedOrder.customer.email}</p>
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <small>Phone</small>
                  <p>{selectedOrder.customer.phone}</p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>
            Select an order to view details.
          </div>
        )}
      </section>

      {/* ================= COLUMN 3: MAP + PACKAGE ================= */}
      <section className="right-panel">
        {selectedOrder ? (
          <>
            {/* MAP CONTAINER */}
            <div className="map-container">
              <div className="map-controls">
                <button>+</button>
                <button>−</button>
              </div>

              {/* Map Roads (Graphical backdrop) */}
              <div className="map-road road-1" style={{ top: '25%', left: '-10%', width: '120%', height: '2px', background: 'white', transform: 'rotate(-5deg)', position: 'absolute', opacity: 0.8 }}></div>
              <div className="map-road road-2" style={{ top: '55%', left: '-10%', width: '120%', height: '2px', background: 'white', transform: 'rotate(10deg)', position: 'absolute', opacity: 0.8 }}></div>
              <div className="map-road road-3" style={{ top: '80%', left: '-10%', width: '120%', height: '2px', background: 'white', transform: 'rotate(-8deg)', position: 'absolute', opacity: 0.8 }}></div>

              <svg className="route-svg" viewBox="0 0 700 450" preserveAspectRatio="none">
                <polyline
                  points={selectedOrder.mapCoords.polylinePoints}
                  fill="none"
                  stroke="#00f2fe"
                  strokeWidth="5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <div className="map-marker start" style={{ 
                left: selectedOrder.mapCoords.startMarkerPosition.left, 
                top: selectedOrder.mapCoords.startMarkerPosition.top 
              }}>
                <Circle size={10} style={{ color: 'white', fill: 'white' }} />
              </div>

              <div className="map-marker end" style={{ 
                left: selectedOrder.mapCoords.endMarkerPosition.left, 
                top: selectedOrder.mapCoords.endMarkerPosition.top 
              }}>
                <MapPin size={12} style={{ color: 'white' }} />
              </div>

              <div className="truck-marker" style={{ 
                left: selectedOrder.mapCoords.truckPosition.left, 
                top: selectedOrder.mapCoords.truckPosition.top 
              }}>
                <Truck size={16} />
              </div>

              {selectedOrder.mapCoords.labels.map((label, index) => (
                <div key={index} className={`map-label label-${index + 1}`} style={{ 
                  left: label.left, 
                  top: label.top 
                }}>
                  {label.text}
                </div>
              ))}
            </div>

            {/* MAP SUMMARY */}
            <div className="map-summary">
              <div>
                <small>Order Status</small>
                <strong>
                  {selectedOrder.mapSummary.orderStatus} 
                  <span className="green-dot"></span>
                </strong>
              </div>

              <div>
                <small>Payment</small>
                <strong>
                  {selectedOrder.mapSummary.payment} 
                  <span className="green-dot"></span>
                </strong>
              </div>

              <div>
                <small>Items</small>
                <strong>{selectedOrder.mapSummary.itemsText}</strong>
              </div>

              <div>
                <small>Distance</small>
                <strong>{selectedOrder.mapSummary.distance}</strong>
              </div>
            </div>

            {/* PACKAGE AND PRICING */}
            <div className="package">
              <div className="package-header">
                <h2>Package and Pricing</h2>
                <span className="expected">
                  {selectedOrder.packageDetails.expectedStatus}
                </span>
              </div>

              <div className="timeline">
                <div>
                  <strong>{selectedOrder.packageDetails.timeline.start}</strong>
                </div>
                <div className="timeline-line"></div>
                <div>
                  <strong>{selectedOrder.packageDetails.timeline.end}</strong>
                </div>
              </div>

              <div className="package-grid">
                <div>
                  <small>Package Type</small>
                  <strong>{selectedOrder.packageDetails.type}</strong>
                </div>

                <div>
                  <small>Weight</small>
                  <strong>{selectedOrder.packageDetails.weight}</strong>
                </div>

                <div>
                  <small>Total Distance</small>
                  <strong>{selectedOrder.packageDetails.totalDistance}</strong>
                </div>

                <div>
                  <small>Total Items</small>
                  <strong>{selectedOrder.packageDetails.totalItems}</strong>
                </div>

                <div>
                  <small>Charge</small>
                  <strong>{selectedOrder.packageDetails.charge}</strong>
                </div>

                <div>
                  <small>Payable By</small>
                  <strong>{selectedOrder.packageDetails.payableBy}</strong>
                </div>
              </div>

              <h3 className="items-title">
                Items ({selectedOrder.packageDetails.itemsList.length})
              </h3>

              <div className="items">
                {selectedOrder.packageDetails.itemsList.map((item, idx) => (
                  <div key={idx} className="item">
                    <div className="item-image">{item.icon}</div>
                    <span>
                      {item.name}
                      <br />
                      {item.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: 'var(--muted)' }}>
            Select an order to view routes and cargo details.
          </div>
        )}
      </section>

    </div>
  );
}
