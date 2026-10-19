export const mockOrders = [
  {
    id: "ORD-001",
    title: "Home Shifting",
    status: "IN PROGRESS",
    statusTime: "10:30 AM",
    statusClass: "green",
    pickup: "21, Los Avenue",
    delivery: "71, Hilton Suites STB",
    routePoints: [
      { type: "Pickup Point", name: "21, Los Avenue", description: "Pickup Point", isComplete: true },
      { type: "Stop point", name: "26, Bushwick Avenue", isComplete: true },
      { type: "Stop point", name: "4100, Ridgeview Bridge", isComplete: false },
      { type: "Delivery Point", name: "71, Hilton Suites", description: "Stop point", isComplete: false }
    ],
    driver: {
      name: "Arjun Sharma",
      avatarText: "AS",
      rating: "4.8",
      address: "302, Kothrud Apt 6B",
      email: "arjun.sharma@gmail.com",
      phone: "+91 98201 11023"
    },
    vehicle: {
      registration: "CAC 123",
      status: "Active",
      statusClass: "blue-badge"
    },
    customer: {
      name: "Sneha Kulkarni",
      avatarText: "SK",
      address: "101, Koregaon Park Residency",
      email: "sneha.kulkarni@gmail.com",
      phone: "+91 98220 56789"
    },
    mapSummary: {
      orderStatus: "In Progress",
      payment: "Paid",
      itemsText: "5 items",
      distance: "12.6 km"
    },
    packageDetails: {
      expectedStatus: "EXPECTED · ON TIME",
      timeline: {
        start: "1 July 2025, 12:30 PM",
        end: "2 July 2025, 6:30 PM"
      },
      type: "Heavy - Cargo Container",
      weight: "250 kg",
      totalDistance: "41.6 km",
      totalItems: "847",
      charge: "₹138",
      payableBy: "B2B",
      itemsList: [
        { icon: "📦", name: "Sofa cum bed", desc: "disassembled" },
        { icon: "🪑", name: "Dining table with", desc: "glass top" },
        { icon: "📦", name: "Kitchen Utensils Box", desc: "fragile glass articles" },
        { icon: "👔", name: "Wardrobe Boxes (x2)", desc: "clothing items" },
        { icon: "📺", name: "LED TV 55 Inch", desc: "original wooden crate" }
      ]
    },
    mapCoords: {
      polylinePoints: "80,80 180,150 270,120 390,220 520,170 620,270",
      truckPosition: { left: "56%", top: "47%" },
      startMarkerPosition: { left: "10%", top: "15%" },
      endMarkerPosition: { left: "87%", top: "58%" },
      labels: [
        { text: "Pickup", left: "12%", top: "9%" },
        { text: "Delivery", left: "85%", top: "67%" }
      ]
    }
  },
  {
    id: "ORD-002",
    title: "Transportation of Furniture",
    status: "PENDING",
    statusTime: "11:15 AM",
    statusClass: "red",
    pickup: "45, Madison Avenue",
    delivery: "12, Broadway Street",
    routePoints: [
      { type: "Pickup Point", name: "45, Madison Avenue", description: "Pickup Point", isComplete: false },
      { type: "Stop point", name: "89, Lexington Avenue", isComplete: false },
      { type: "Delivery Point", name: "12, Broadway Street", description: "Stop point", isComplete: false }
    ],
    driver: {
      name: "Ravi Deshmukh",
      avatarText: "RD",
      rating: "4.7",
      address: "15, Deccan Gymkhana",
      email: "ravi.deshmukh@gmail.com",
      phone: "+91 98201 11024"
    },
    vehicle: {
      registration: "NYM 887",
      status: "Idle",
      statusClass: "gray-badge"
    },
    customer: {
      name: "Priya Patil",
      avatarText: "PP",
      address: "99, Shivajinagar",
      email: "priya.patil@gmail.com",
      phone: "+91 98220 67890"
    },
    mapSummary: {
      orderStatus: "Pending",
      payment: "Unpaid",
      itemsText: "12 items",
      distance: "8.2 km"
    },
    packageDetails: {
      expectedStatus: "PENDING · APPROVAL REQUIRED",
      timeline: {
        start: "3 July 2025, 9:00 AM",
        end: "3 July 2025, 5:00 PM"
      },
      type: "Medium - Wooden Crate",
      weight: "180 kg",
      totalDistance: "8.2 km",
      totalItems: "12",
      charge: "₹95",
      payableBy: "COD",
      itemsList: [
        { icon: "🪑", name: "Office Desk Chairs (x6)", desc: "ergonomic mesh" },
        { icon: "🪵", name: "Mahogany Wood Table", desc: "solid wood, heavy" },
        { icon: "🪜", name: "Bookshelf Units (x2)", desc: "flat-packed" }
      ]
    },
    mapCoords: {
      polylinePoints: "120,320 220,280 340,360 480,180 600,140",
      truckPosition: { left: "16%", top: "69%" },
      startMarkerPosition: { left: "16%", top: "69%" },
      endMarkerPosition: { left: "84%", top: "29%" },
      labels: [
        { text: "Pickup", left: "18%", top: "76%" },
        { text: "Delivery", left: "80%", top: "22%" }
      ]
    }
  },
  {
    id: "ORD-003",
    title: "Bulk Cargo for Export Clothing",
    status: "PICKED UP",
    statusTime: "09:30 AM",
    statusClass: "green",
    pickup: "Port Terminal 4",
    delivery: "Industrial Zone C",
    routePoints: [
      { type: "Pickup Point", name: "Port Terminal 4", description: "Pickup Point", isComplete: true },
      { type: "Stop point", name: "Customs Inspection Gate 2", isComplete: true },
      { type: "Stop point", name: "Highway Toll Plaza B", isComplete: true },
      { type: "Delivery Point", name: "Industrial Zone C", description: "Stop point", isComplete: false }
    ],
    driver: {
      name: "Sunil Patil",
      avatarText: "SP",
      rating: "4.9",
      address: "10, Hadapsar Road",
      email: "sunil.patil@gmail.com",
      phone: "+91 98201 11025"
    },
    vehicle: {
      registration: "TXS 990",
      status: "Active",
      statusClass: "blue-badge"
    },
    customer: {
      name: "TexStyle Overseas LLC",
      avatarText: "TS",
      address: "Suite 404, Textile Tower",
      email: "export@texstyle.com",
      phone: "800-456-9900"
    },
    mapSummary: {
      orderStatus: "Picked Up",
      payment: "Paid",
      itemsText: "40 Bales",
      distance: "34.5 km"
    },
    packageDetails: {
      expectedStatus: "ON ROUTE · DELIVERING TODAY",
      timeline: {
        start: "29 Aug 2026, 08:00 AM",
        end: "29 Aug 2026, 06:00 PM"
      },
      type: "Heavy - Container Cargo",
      weight: "1200 kg",
      totalDistance: "34.5 km",
      totalItems: "40",
      charge: "₹450",
      payableBy: "B2B",
      itemsList: [
        { icon: "🧥", name: "Winter Jackets Bales (x15)", desc: "100% waterproof jackets" },
        { icon: "👕", name: "Cotton T-Shirts Bales (x25)", desc: "Export quality combed cotton" }
      ]
    },
    mapCoords: {
      polylinePoints: "50,380 150,300 250,320 380,180 500,200 620,90",
      truckPosition: { left: "35%", top: "71%" },
      startMarkerPosition: { left: "6%", top: "83%" },
      endMarkerPosition: { left: "87%", top: "18%" },
      labels: [
        { text: "Port Terminal", left: "6%", top: "89%" },
        { text: "Ind. Zone C", left: "84%", top: "11%" }
      ]
    }
  },
  {
    id: "ORD-004",
    title: "Foodmart Delivery",
    status: "DELIVERED",
    statusTime: "08:46 AM",
    statusClass: "green",
    pickup: "Central Cold Storage",
    delivery: "Foodmart Superstore #12",
    routePoints: [
      { type: "Pickup Point", name: "Central Cold Storage", description: "Pickup Point", isComplete: true },
      { type: "Stop point", name: "Route 101 Link Rd", isComplete: true },
      { type: "Delivery Point", name: "Foodmart Superstore #12", description: "Delivery Point", isComplete: true }
    ],
    driver: {
      name: "Kiran Jadhav",
      avatarText: "KJ",
      rating: "4.5",
      address: "444, Baner Road",
      email: "kiran.jadhav@gmail.com",
      phone: "+91 98201 11026"
    },
    vehicle: {
      registration: "FDM 552",
      status: "Idle",
      statusClass: "gray-badge"
    },
    customer: {
      name: "Foodmart Retail Group",
      avatarText: "FR",
      address: "HQ, Retail Plaza, San Jose",
      email: "logistics@foodmart.com",
      phone: "800-111-2222"
    },
    mapSummary: {
      orderStatus: "Delivered",
      payment: "Paid",
      itemsText: "150 Crates",
      distance: "18.1 km"
    },
    packageDetails: {
      expectedStatus: "DELIVERED · SUCCESS",
      timeline: {
        start: "29 Aug 2026, 07:00 AM",
        end: "29 Aug 2026, 08:46 AM"
      },
      type: "Refrigerated Trunk",
      weight: "450 kg",
      totalDistance: "18.1 km",
      totalItems: "150",
      charge: "₹180",
      payableBy: "B2B",
      itemsList: [
        { icon: "🥛", name: "Dairy Products (x50 crates)", desc: "Milk, Butter, Cheese - Chilled" },
        { icon: "🥬", name: "Fresh Vegetables (x60 crates)", desc: "Lettuce, Tomatoes, Broccoli" },
        { icon: "🍎", name: "Fresh Fruits (x40 crates)", desc: "Apples, Oranges, Grapes" }
      ]
    },
    mapCoords: {
      polylinePoints: "100,100 200,80 320,190 440,110 560,240 640,220",
      truckPosition: { left: "91%", top: "48%" },
      startMarkerPosition: { left: "13%", top: "20%" },
      endMarkerPosition: { left: "91%", top: "48%" },
      labels: [
        { text: "Cold Storage", left: "10%", top: "12%" },
        { text: "Foodmart Store", left: "85%", top: "54%" }
      ]
    }
  },
  {
    id: "ORD-005",
    title: "Office Transportation",
    status: "IN PROGRESS",
    statusTime: "10:10 AM",
    statusClass: "green",
    pickup: "Tech Park Block A",
    delivery: "Downtown Coworking Hub",
    routePoints: [
      { type: "Pickup Point", name: "Tech Park Block A", description: "Pickup Point", isComplete: true },
      { type: "Stop point", name: "East Ring Road", isComplete: true },
      { type: "Delivery Point", name: "Downtown Coworking Hub", description: "Delivery Point", isComplete: false }
    ],
    driver: {
      name: "Amit Kulkarni",
      avatarText: "AK",
      rating: "4.95",
      address: "18, Aundh Road",
      email: "amit.kulkarni@gmail.com",
      phone: "+91 98220 78901"
    },
    vehicle: {
      registration: "IND 181",
      status: "Active",
      statusClass: "blue-badge"
    },
    customer: {
      name: "InnoTech Solutions",
      avatarText: "IT",
      address: "Floor 12, Tech Park Block A",
      email: "facilities@innotech.com",
      phone: "180-200-3000"
    },
    mapSummary: {
      orderStatus: "In Progress",
      payment: "Paid",
      itemsText: "30 Packages",
      distance: "9.8 km"
    },
    packageDetails: {
      expectedStatus: "ON TIME · TRANSIT",
      timeline: {
        start: "29 Aug 2026, 09:30 AM",
        end: "29 Aug 2026, 11:30 AM"
      },
      type: "Light Truck",
      weight: "95 kg",
      totalDistance: "9.8 km",
      totalItems: "30",
      charge: "₹110",
      payableBy: "B2B",
      itemsList: [
        { icon: "💻", name: "Developer Laptops (x15)", desc: "MacBook Pro 16\" - boxed" },
        { icon: "🖥️", name: "Monitors (x15)", desc: "Dell UltraSharp 27\"" }
      ]
    },
    mapCoords: {
      polylinePoints: "150,150 280,250 420,180 580,290",
      truckPosition: { left: "40%", top: "54%" },
      startMarkerPosition: { left: "20%", top: "31%" },
      endMarkerPosition: { left: "81%", top: "62%" },
      labels: [
        { text: "Tech Park", left: "20%", top: "25%" },
        { text: "Coworking Hub", left: "75%", top: "70%" }
      ]
    }
  },
  {
    id: "ORD-006",
    title: "Bulk Construction Material",
    status: "PENDING",
    statusTime: "12:30 PM",
    statusClass: "red",
    pickup: "Quarry Hill Depot",
    delivery: "Metro Station Buildsite",
    routePoints: [
      { type: "Pickup Point", name: "Quarry Hill Depot", description: "Pickup Point", isComplete: false },
      { type: "Delivery Point", name: "Metro Station Buildsite", description: "Delivery Point", isComplete: false }
    ],
    driver: {
      name: "Rajesh Thorat",
      avatarText: "RT",
      rating: "4.4",
      address: "88, Viman Nagar",
      email: "rajesh.thorat@gmail.com",
      phone: "+91 98220 89012"
    },
    vehicle: {
      registration: "BIG 320",
      status: "Active",
      statusClass: "blue-badge"
    },
    customer: {
      name: "Metro Transit Authority",
      avatarText: "MT",
      address: "MTA Headquarters, City Center",
      email: "procurement@mta.gov",
      phone: "555-019-2834"
    },
    mapSummary: {
      orderStatus: "Pending",
      payment: "Unpaid",
      itemsText: "8 Tons",
      distance: "25.0 km"
    },
    packageDetails: {
      expectedStatus: "DELAYED · TRAFFIC AHEAD",
      timeline: {
        start: "29 Aug 2026, 12:00 PM",
        end: "29 Aug 2026, 03:00 PM"
      },
      type: "Heavy Dumper Truck",
      weight: "8000 kg",
      totalDistance: "25.0 km",
      totalItems: "1 bulk consignment",
      charge: "₹850",
      payableBy: "B2B",
      itemsList: [
        { icon: "🪨", name: "Crushed Gravel (4 Tons)", desc: "Grade A aggregate" },
        { icon: "🪨", name: "Portland Cement (4 Tons)", desc: "80 bags x 50kg" }
      ]
    },
    mapCoords: {
      polylinePoints: "80,300 200,320 350,220 500,280 610,180",
      truckPosition: { left: "10%", top: "65%" },
      startMarkerPosition: { left: "10%", top: "65%" },
      endMarkerPosition: { left: "85%", top: "38%" },
      labels: [
        { text: "Quarry Depot", left: "7%", top: "72%" },
        { text: "Metro Site", left: "81%", top: "31%" }
      ]
    }
  }
];

export const mockDeliveries = [
  {
    id: "DEL-101",
    title: "The pair of sneakers",
    trackingNo: "WF24576452190",
    from: "San Diego",
    to: "New York",
    status: "On way",
    statusClass: "orange",
    price: "$54.00",
    tab: "delivering"
  },
  {
    id: "DEL-102",
    title: "New Macbook",
    trackingNo: "WF234934567A",
    from: "Alabama",
    to: "New York",
    status: "Ready to receive",
    statusClass: "green",
    price: "$1200.00",
    tab: "delivering"
  },
  {
    id: "DEL-103",
    title: "Hoodies, T-Shirts",
    trackingNo: "WF2434542190",
    from: "San Diego",
    to: "New York",
    status: "On way",
    statusClass: "orange",
    price: "$54.00",
    tab: "delivering"
  },
  {
    id: "DEL-104",
    title: "Food Pack",
    trackingNo: "WF24123452190",
    from: "Warehouse",
    to: "San Francisco",
    status: "Delivered",
    statusClass: "green",
    price: "$84.00",
    tab: "received"
  },
  {
    id: "DEL-105",
    title: "Sony WH-1000XM5 Headphones",
    trackingNo: "WF440098214B",
    from: "Seattle Distribution",
    to: "Denver Outlet",
    status: "Delivered",
    statusClass: "green",
    price: "$349.99",
    tab: "received"
  },
  {
    id: "DEL-106",
    title: "Ergonomic Office Chair",
    trackingNo: "WF9087541234",
    from: "Chicago Center",
    to: "Boston Cowork",
    status: "On way",
    statusClass: "orange",
    price: "$289.00",
    tab: "delivering"
  }
];

export const mockCenters = [
  {
    id: "CTR-001",
    name: "Central Logistics Center",
    address: "450 Rice Rd, Suite 200",
    timeLeft: "3 hours left",
    duration: "9 min",
    capacity: "45%"
  },
  {
    id: "CTR-002",
    name: "South Distribution Center",
    address: "450 Rice Rd, San Francisco",
    timeLeft: "1 hour left",
    duration: "19 min",
    capacity: "15%"
  },
  {
    id: "CTR-003",
    name: "Golden Gate Transit Depot",
    address: "101 Marine Blvd, San Francisco",
    timeLeft: "6 hours left",
    duration: "14 min",
    capacity: "68%"
  },
  {
    id: "CTR-004",
    name: "Oakland Cargo Hub",
    address: "800 Maritime St, Oakland",
    timeLeft: "12 hours left",
    duration: "25 min",
    capacity: "82%"
  }
];
