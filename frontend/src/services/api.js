import { API_BASE_URL } from "../config";

export const api = {
  // User endpoints
  register: async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Registration failed");
    }
    return response.json();
  },

  login: async (username, password) => {
    const response = await fetch(`${API_BASE_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Login failed");
    }
    return response.json();
  },

  // Project endpoints
  createProject: async (projectId, projectName, projectDesc) => {
    const response = await fetch(`${API_BASE_URL}/projects/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        project_id: projectId,
        project_name: projectName,
        project_desc: projectDesc,
      }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Project creation failed");
    }
    return response.json();
  },

  listProjects: async () => {
    const response = await fetch(`${API_BASE_URL}/projects/list`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch projects");
    }
    return response.json();
  },

  // Hardware endpoints
  getHardwareStatus: async () => {
    const response = await fetch(`${API_BASE_URL}/hardware/status`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error("Failed to fetch hardware status");
    }
    return response.json();
  },

  checkoutHardware: async (projectId, hwSetId, quantity) => {
    const response = await fetch(`${API_BASE_URL}/hardware/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        project_id: projectId,
        hw_set_id: hwSetId,
        quantity: quantity,
      }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Checkout failed");
    }
    return response.json();
  },

  checkinHardware: async (hwSetId, quantity) => {
    const response = await fetch(`${API_BASE_URL}/hardware/checkin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hw_set_id: hwSetId,
        quantity: quantity,
      }),
    });
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Checkin failed");
    }
    return response.json();
  },
};
