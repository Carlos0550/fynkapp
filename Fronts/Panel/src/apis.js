export const base_api={
    url: import.meta.env.VITE_API_URL === "PRODUCTION"
    ? "https://api.fynkapp.com.ar"
    : "http://localhost:5000",
}

export const logic_apis = {
  authentication: new URL(`${base_api.url}/auth`),
  clients: new URL(`${base_api.url}/clients`),
  debts: new URL(`${base_api.url}/debts`),
  delivers: new URL(`${base_api.url}/delivers`),
  financial: new URL(`${base_api.url}/financial`),
  resume: new URL(`${base_api.url}/resume`),
  business: new URL(`${base_api.url}/business`),
  notifications: new URL(`${base_api.url}/notifications`)
}