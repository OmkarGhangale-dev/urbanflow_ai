import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import TrackingDashboard from './components/TrackingDashboard';
import LiveTrackingView from './components/LiveTrackingView';
import OrdersView from './components/OrdersView';
import SmartOptimizerView from './components/SmartOptimizerView';
import ScenarioReoptView from './components/ScenarioReoptView';
import ChatsView from './components/ChatsView';
import DocumentsView from './components/DocumentsView';
import ReportsView from './components/ReportsView';
import CustomerView from './components/CustomerView';
import SettingsView from './components/SettingsView';
import NewPackageModal from './components/NewPackageModal';
import EditPackageModal from './components/EditPackageModal';
import DriverCallModal from './components/DriverCallModal';
import QuickChatModal from './components/QuickChatModal';
import AIExplainPanel from './components/AIExplainPanel';
import { fetchOrders } from './api';

export default function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeCurrency, setActiveCurrency] = useState('INR');
  
  // Modals state
  const [isNewPackageOpen, setIsNewPackageOpen] = useState(false);
  const [isEditPackageOpen, setIsEditPackageOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);
  const [callModalDriver, setCallModalDriver] = useState(null);
  const [quickChatData, setQuickChatData] = useState(null);

  // ── AI Panel State ──────────────────────────────────────────────
  // mode: 'idle' | 'consignment-detail' | 'newconsignment' | 'scenario'
  const [aiPanelMode, setAiPanelMode] = useState('idle');
  const [aiPanelConsignment, setAiPanelConsignment] = useState(null);
  const [aiPanelScenario, setAiPanelScenario] = useState(null);
  // For clicking existing consignment on dashboard
  const [selectedConsignment, setSelectedConsignment] = useState(null);

  // Currency symbol helper
  const currencySymbol = activeCurrency === 'INR' ? '₹' : activeCurrency === 'EUR' ? '€' : '$';

  // Core packages list with paymentStatus and dashboard deletion tracking
  const [packages, setPackages] = useState([
    {
      id: 'PKG-001',
      shipmentNumber: 'BH-2017287528',
      title: 'Perishable Food & Grocery Consignment',
      category: 'Food',
      status: 'In-transit',
      paymentStatus: 'Prepaid',
      isDeletedFromDashboard: false,
      departureDate: '12-2-26',
      arrivalDate: '17-2-26',
      weight: '45 kg',
      pickup: 'Central Pune Depot (D1)',
      deliveryAddress: '3 Birrel Avenue',
      priority: 'High',
      driver: {
        name: 'Mr. Arjun Sharma',
        phone: '+91 98201 11023',
        rating: '4.9',
        avatar: 'AS'
      },
      routeExplanation: {
        chosenRoute: 'Depot D1 → Senapati Bapat Marg → FC Road → 3 Birrel Avenue',
        whyChosen: 'This food consignment is assigned to Mr. Arjun Sharma because his truck (V01) had the nearest pickup point at Central Depot D1 and 80kg of free capacity. The Senapati Bapat Marg route was selected as it avoids the FC Road peak-hour congestion zone, saving 18 minutes and ₹630 in idle fuel. Food cargo requires refrigeration continuity, so the shorter journey time was also a factor.',
        savings: '₹630 fuel saved vs standard route',
        eta: '52 mins',
        sla: '98.5%'
      }
    },
    {
      id: 'PKG-002',
      shipmentNumber: 'BH-2017287529',
      title: 'Apparel & Designer Textiles Export',
      category: 'Clothes',
      status: 'Completed',
      paymentStatus: 'Prepaid',
      isDeletedFromDashboard: false,
      departureDate: '12-2-26',
      arrivalDate: '17-2-26',
      weight: '30 kg',
      pickup: 'Shivajinagar Depot',
      deliveryAddress: '19th Avenue Mall',
      priority: 'Normal',
      driver: {
        name: 'Mr. Ravi Deshmukh',
        phone: '+91 98201 11024',
        rating: '4.8',
        avatar: 'RD'
      },
      routeExplanation: {
        chosenRoute: 'Shivajinagar Depot → Karve Road → JM Road → 19th Avenue Mall',
        whyChosen: 'Ravi Deshmukh\'s truck V02 was already in the Shivajinagar corridor, making it the most logical assignment. The Karve Road route was chosen as it passes directly through the commercial district where the mall is located, and the apparel consignment had a standard priority level with no time urgency. This saved 12 minutes over alternative routes.',
        savings: '₹420 fuel saved',
        eta: '38 mins',
        sla: '99%'
      }
    },
    {
      id: 'PKG-003',
      shipmentNumber: 'BH-2017287530',
      title: 'Garments & Fashion Retail Dispatch',
      category: 'Clothes',
      status: 'In-transit',
      paymentStatus: 'COD',
      isDeletedFromDashboard: false,
      departureDate: '12-2-26',
      arrivalDate: '17-2-26',
      weight: '60 kg',
      pickup: 'East Pune Depot (D2)',
      deliveryAddress: '86th Street Commercial',
      priority: 'Normal',
      driver: {
        name: 'Mr. Sunil Patil',
        phone: '+91 98201 11025',
        rating: '4.9',
        avatar: 'SP'
      },
      routeExplanation: {
        chosenRoute: 'East Depot D2 → Koregaon Park Road → Bund Garden Bridge → 86th Street',
        whyChosen: 'Sunil Patil\'s truck V03 was dispatched from East Depot D2, the closest depot to the 86th Street commercial area. The Koregaon Park route avoids the Hadapsar industrial area congestion that would add 25+ minutes during this time of day. The 60kg garment load was well within V03\'s remaining 290kg capacity.',
        savings: '₹840 fuel saved',
        eta: '45 mins',
        sla: '99.2%'
      }
    },
    {
      id: 'PKG-004',
      shipmentNumber: 'BH-2017287531',
      title: 'Precision Microchips & Motherboards',
      category: 'Electronics',
      status: 'Failed',
      paymentStatus: 'Prepaid',
      isDeletedFromDashboard: false,
      departureDate: '12-2-26',
      arrivalDate: '17-2-26',
      weight: '15 kg',
      pickup: 'Pune Tech Corridor',
      deliveryAddress: '46th Street Hub',
      priority: 'High',
      driver: {
        name: 'Mr. Kiran Jadhav',
        phone: '+91 98201 11026',
        rating: '4.7',
        avatar: 'KJ'
      },
      routeExplanation: {
        chosenRoute: 'Pune Tech Corridor → Viman Nagar Road → Hadapsar Road → 46th Street Hub',
        whyChosen: 'This electronics shipment failed delivery due to an address access issue at the destination — the truck V04 reached the 46th Street Hub but the warehouse gate was locked. The Viman Nagar route was originally selected as the optimal path, bypassing the airport construction zone. The consignment will be re-attempted on the same route today.',
        savings: '₹210 fuel saved (initial route)',
        eta: 'Pending Re-attempt',
        sla: 'On Hold'
      }
    },
    {
      id: 'PKG-005',
      shipmentNumber: 'BH-2017287532',
      title: 'Emergency Medical Vaccine Cargo',
      category: 'Medical',
      status: 'Prepared',
      paymentStatus: 'Prepaid',
      isDeletedFromDashboard: false,
      departureDate: '12-2-26',
      arrivalDate: '17-2-26',
      weight: '25 kg',
      pickup: 'Central Pune Depot (D1)',
      deliveryAddress: 'Kothrud Hospital Ward',
      priority: 'Critical',
      driver: {
        name: 'Mr. Arjun Sharma',
        phone: '+91 98201 11023',
        rating: '4.95',
        avatar: 'AS'
      },
      routeExplanation: {
        chosenRoute: 'Central Depot D1 → JM Road Bypass → Paud Road → Kothrud Hospital',
        whyChosen: 'CRITICAL PRIORITY: This medical vaccine consignment requires the fastest possible delivery. Mr. Arjun Sharma was selected as our highest-rated driver (4.95★). The JM Road Bypass route was chosen — while 3.2km longer than the direct Deccan route, it guarantees 100% SLA by avoiding the Deccan roundabout bottleneck that currently has 35-minute delays. Vaccines must reach Kothrud Hospital\'s cold storage within the delivery window.',
        savings: 'SLA Priority Override — Speed over Cost',
        eta: '28 mins (Express)',
        sla: '100% Critical SLA'
      }
    },
    {
      id: 'PKG-006',
      shipmentNumber: 'BH-2017287533',
      title: 'Organic Farm Dairy & Cold Storage',
      category: 'Food',
      status: 'Prepared',
      paymentStatus: 'COD',
      isDeletedFromDashboard: false,
      departureDate: '12-2-26',
      arrivalDate: '17-2-26',
      weight: '80 kg',
      pickup: 'East Pune Depot (D2)',
      deliveryAddress: 'Koregaon Park Market',
      priority: 'Normal',
      driver: {
        name: 'Mr. Ravi Deshmukh',
        phone: '+91 98201 11024',
        rating: '4.85',
        avatar: 'RD'
      },
      routeExplanation: {
        chosenRoute: 'East Depot D2 → Bund Garden Road → Koregaon Park Main Road → Koregaon Park Market',
        whyChosen: 'Ravi Deshmukh\'s truck V02 passes directly through Koregaon Park on its standard route, making this a zero-deviation assignment that costs ₹0 extra. The dairy products require cold-chain continuity, so bundling this stop into V02\'s existing route rather than deploying a separate vehicle reduces both transit time and fuel consumption. V02 has 140kg of remaining capacity — more than enough for this 80kg dairy load.',
        savings: '₹1,200 saved by bundling with existing route',
        eta: '35 mins',
        sla: '98.8%'
      }
    }
  ]);

  const handleAddNewPackage = (newPkg) => {
    setPackages(prev => [newPkg, ...prev]);
    setAiPanelMode('idle');
    setAiPanelConsignment(null);
  };

  const handleOpenEditPackage = (pkg) => {
    setEditingPackage(pkg);
    setIsEditPackageOpen(true);
  };

  const handleUpdatePackage = (updatedPkg) => {
    setPackages(prev => prev.map(p => p.id === updatedPkg.id ? updatedPkg : p));
    if (selectedConsignment?.id === updatedPkg.id) {
      setSelectedConsignment(updatedPkg);
    }
    setIsEditPackageOpen(false);
    setEditingPackage(null);
  };

  const handleDeleteDashboardPackage = (pkgId) => {
    // Soft-delete from dashboard: marks as deleted from dashboard, preserves in database and orders page
    setPackages(prev => prev.map(p => p.id === pkgId ? { ...p, isDeletedFromDashboard: true } : p));
    if (selectedConsignment?.id === pkgId) {
      setSelectedConsignment(null);
      setAiPanelMode('idle');
    }
  };

  const handleCallDriver = (driverName) => {
    setCallModalDriver(driverName);
  };

  const handleChatDriver = (driverName, shipmentNumber) => {
    setQuickChatData({ driverName, shipmentNumber });
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const handleCurrencyChange = (curr) => {
    setActiveCurrency(curr);
  };

  // Called when clicking an existing consignment on Dashboard
  const handleConsignmentClick = (pkg) => {
    setSelectedConsignment(pkg);
    setAiPanelMode('consignment-detail');
    setAiPanelConsignment(null);
  };

  // Called when the new package form updates in real-time
  const handleConsignmentFormChange = (formData) => {
    setAiPanelConsignment(formData);
    setAiPanelMode('newconsignment');
    setSelectedConsignment(null);
  };

  // Called when scenario is submitted from ScenarioReoptView
  const handleScenarioAnalyze = (scenarioData) => {
    setAiPanelScenario(scenarioData);
    setAiPanelMode('scenario');
  };

  // Reset AI panel when switching tabs
  useEffect(() => {
    if (currentTab === 'dashboard') {
      // Going to dashboard — reset to idle
      setAiPanelMode('idle');
      setAiPanelScenario(null);
      setAiPanelConsignment(null);
      setSelectedConsignment(null);
    } else if (currentTab === 'scenarios') {
      // Going to scenarios — keep scenario mode or set idle
      if (aiPanelMode !== 'scenario') {
        setAiPanelMode('idle');
      }
    }
  }, [currentTab]);

  // AI panel is shown ONLY on dashboard and scenarios
  const showAiPanel = currentTab === 'dashboard' || currentTab === 'scenarios';

  return (
    <div className={`app-root-shell ${isDarkMode ? 'dark-mode-active' : 'light-mode-active'}`}>
      
      {/* Sidebar Navigation */}
      <Sidebar 
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        isDarkMode={isDarkMode}
        onToggleDarkMode={toggleDarkMode}
      />

      {/* Main Content Body — splits into content + AI panel */}
      <div className={`main-content-with-panel ${showAiPanel ? 'has-ai-panel' : ''}`}>
        
        {/* Primary View Area */}
        <main className={`main-viewport ${showAiPanel ? 'viewport-with-panel' : ''}`}>
          {currentTab === 'dashboard' ? (
            <TrackingDashboard 
              packages={packages}
              onNewPackageClick={() => setIsNewPackageOpen(true)}
              onEditPackage={handleOpenEditPackage}
              onDeletePackage={handleDeleteDashboardPackage}
              onCallDriver={handleCallDriver}
              onChatDriver={handleChatDriver}
              onConsignmentClick={handleConsignmentClick}
              selectedConsignmentId={selectedConsignment?.id || null}
              isDarkMode={isDarkMode}
              currencySymbol={currencySymbol}
            />
          ) : currentTab === 'tracking' ? (
            <LiveTrackingView 
              isDarkMode={isDarkMode}
              onCallDriver={handleCallDriver}
              onChatDriver={handleChatDriver}
              currencySymbol={currencySymbol}
            />
          ) : currentTab === 'orders' ? (
            <OrdersView 
              packages={packages}
              onNewPackageClick={() => setIsNewPackageOpen(true)}
              onEditPackage={handleOpenEditPackage}
              isDarkMode={isDarkMode}
              currencySymbol={currencySymbol}
            />
          ) : currentTab === 'optimize' ? (
            <SmartOptimizerView 
              isDarkMode={isDarkMode}
              currencySymbol={currencySymbol}
              onApplyStrategy={(stratId) => {
                setTimeout(() => setCurrentTab('dashboard'), 1400);
              }}
            />
          ) : currentTab === 'scenarios' ? (
            <ScenarioReoptView 
              isDarkMode={isDarkMode} 
              currencySymbol={currencySymbol}
              onScenarioAnalyze={handleScenarioAnalyze}
            />
          ) : currentTab === 'chats' ? (
            <ChatsView 
              isDarkMode={isDarkMode}
              onCallDriver={handleCallDriver}
            />
          ) : currentTab === 'documents' ? (
            <DocumentsView isDarkMode={isDarkMode} />
          ) : currentTab === 'report' ? (
            <ReportsView 
              isDarkMode={isDarkMode} 
              currencySymbol={currencySymbol}
            />
          ) : currentTab === 'customer' ? (
            <CustomerView isDarkMode={isDarkMode} />
          ) : currentTab === 'settings' ? (
            <SettingsView 
              isDarkMode={isDarkMode}
              onToggleDarkMode={toggleDarkMode}
              currentCurrency={activeCurrency}
              onCurrencyChange={handleCurrencyChange}
            />
          ) : (
            <TrackingDashboard 
              packages={packages}
              onNewPackageClick={() => setIsNewPackageOpen(true)}
              onEditPackage={handleOpenEditPackage}
              onDeletePackage={handleDeleteDashboardPackage}
              onCallDriver={handleCallDriver}
              onChatDriver={handleChatDriver}
              onConsignmentClick={handleConsignmentClick}
              selectedConsignmentId={selectedConsignment?.id || null}
              isDarkMode={isDarkMode}
              currencySymbol={currencySymbol}
            />
          )}
        </main>

        {/* ─── AI Route Intelligence Panel — Dashboard & Scenarios only ─── */}
        {showAiPanel && (
          <div className="ai-panel-column">
            <AIExplainPanel
              mode={aiPanelMode}
              selectedConsignment={selectedConsignment}
              newConsignmentData={aiPanelConsignment}
              scenarioData={aiPanelScenario}
              packages={packages}
              isDarkMode={isDarkMode}
              onPushToDriver={(optionId) => {
                console.log('Route pushed to driver:', optionId);
              }}
              onSelectRoute={(optionId) => {
                console.log('Route selected:', optionId);
              }}
            />
          </div>
        )}
      </div>

      {/* Global Interactive Modals */}
      <NewPackageModal 
        isOpen={isNewPackageOpen}
        onClose={() => {
          setIsNewPackageOpen(false);
          setAiPanelMode('idle');
          setAiPanelConsignment(null);
        }}
        onAddPackage={handleAddNewPackage}
        onFormChange={handleConsignmentFormChange}
        isDarkMode={isDarkMode}
      />

      <EditPackageModal 
        isOpen={isEditPackageOpen}
        onClose={() => {
          setIsEditPackageOpen(false);
          setEditingPackage(null);
        }}
        packageData={editingPackage}
        onUpdatePackage={handleUpdatePackage}
        isDarkMode={isDarkMode}
      />

      <DriverCallModal 
        isOpen={!!callModalDriver}
        onClose={() => setCallModalDriver(null)}
        driverName={callModalDriver || "Mr. Arjun Sharma"}
        isDarkMode={isDarkMode}
      />

      <QuickChatModal 
        isOpen={!!quickChatData}
        onClose={() => setQuickChatData(null)}
        driverName={quickChatData?.driverName || "Mr. Arjun Sharma"}
        shipmentNumber={quickChatData?.shipmentNumber || "BH-2017287528"}
        isDarkMode={isDarkMode}
      />

    </div>
  );
}
