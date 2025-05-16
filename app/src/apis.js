export const base_api={
    url: import.meta.env.VITE_API_URL === "PRODUCTION"
    ? "https://fynkapp-production.up.railway.app"
    : "http://localhost:5000",
}

export const logic_apis = {
  authentication: new URL(`${base_api.url}/auth`)
}