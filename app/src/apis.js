export const base_api={
    url: import.meta.env.VITE_API_URL === "PRODUCTION"
    ? "https://fynkapp-server.up.railway.app"
    : "http://localhost:5000",
}

export const logic_apis = {
  authentication: new URL(`${base_api.url}/auth`),
  clients: new URL(`${base_api.url}/clients`),
  debts: new URL(`${base_api.url}/debts`),
  delivers: new URL(`${base_api.url}/delivers`),
  financial: new URL(`${base_api.url}/financial`),
  resume: new URL(`${base_api.url}/resume`),
}