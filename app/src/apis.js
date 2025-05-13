export const base_api={
    url: import.meta.env.VITE_API_URL === "PRODUCTION"
    ? "https://fynkapp-production.up.railway.app"
    : "http://localhost:5000",
}

export const logic_apis = {
    clients: new URL(`${base_api.url}/clients`),
    users: new URL(`${base_api.url}/users`),
    fast_actions: new URL(`${base_api.url}/fast-actions`),
    debts: new URL(`${base_api.url}/debts`),
    employee: new URL(`${base_api.url}/employee`),
    expirations: new URL(`${base_api.url}/expirations`),
    business: new URL(`${base_api.url}/business`),
}