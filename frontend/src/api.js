const BASE_URL = "http://localhost:8000";

export async function fetchHealth() {
  const response = await fetch(`${BASE_URL}/health`);
  if (!response.ok) throw new Error("Failed to fetch health status");
  return response.json();
}

export async function fetchVehicles() {
  const response = await fetch(`${BASE_URL}/vehicles`);
  if (!response.ok) throw new Error("Failed to fetch vehicles");
  return response.json();
}

export async function fetchOrders(includeDashboardDeleted = true) {
  const response = await fetch(`${BASE_URL}/orders?include_dashboard_deleted=${includeDashboardDeleted}`);
  if (!response.ok) throw new Error("Failed to fetch orders");
  return response.json();
}

export async function createOrder(orderData) {
  const response = await fetch(`${BASE_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  if (!response.ok) throw new Error("Failed to create order");
  return response.json();
}

export async function updateOrder(orderId, orderData) {
  const response = await fetch(`${BASE_URL}/orders/${orderId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(orderData),
  });
  if (!response.ok) throw new Error("Failed to update order");
  return response.json();
}

export async function deleteDashboardOrder(orderId) {
  const response = await fetch(`${BASE_URL}/orders/${orderId}/dashboard`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete order from dashboard");
  return response.json();
}

export async function fetchTrafficIncidents() {
  const response = await fetch(`${BASE_URL}/traffic/incidents`);
  if (!response.ok) throw new Error("Failed to fetch traffic incidents");
  return response.json();
}

export async function createTrafficIncident(fromLocation, toLocation, level) {
  const response = await fetch(`${BASE_URL}/traffic/incidents`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ from_location: fromLocation, to_location: toLocation, level }),
  });
  if (!response.ok) throw new Error("Failed to create traffic incident");
  return response.json();
}

export async function optimizeRoutes(weights = {}) {
  const response = await fetch(`${BASE_URL}/optimize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(weights),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Optimization failed");
  }
  return response.json();
}

export async function reoptimizeRoutes(weights = {}) {
  const response = await fetch(`${BASE_URL}/reoptimize`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(weights),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Re-optimization failed");
  }
  return response.json();
}

export async function fetchMetrics() {
  const response = await fetch(`${BASE_URL}/metrics`);
  if (!response.ok) throw new Error("Failed to fetch metrics");
  return response.json();
}

export async function resetDemoScenario() {
  const response = await fetch(`${BASE_URL}/demo/reset`, {
    method: "POST",
  });
  if (!response.ok) throw new Error("Failed to reset demo scenario");
  return response.json();
}

export async function getAIRouteOptions(consignmentData) {
  const response = await fetch(`${BASE_URL}/ai/route-options`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(consignmentData),
  });
  if (!response.ok) throw new Error("Failed to get AI route options");
  return response.json();
}

export async function getAIScenarioAnalysis(scenarioData) {
  const response = await fetch(`${BASE_URL}/ai/scenario-analysis`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title: scenarioData.title,
      type: scenarioData.type,
      from_location: scenarioData.from,
      to_location: scenarioData.to,
      severity: scenarioData.severity,
      notes: scenarioData.notes || "",
    }),
  });
  if (!response.ok) throw new Error("Failed to get AI scenario analysis");
  return response.json();
}
