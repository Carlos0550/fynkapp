export const base_api={
    url: "http://localhost:5000",
}

//https://fynkapp-production.up.railway.app

export const logic_apis = {
    clients: new URL(`${base_api.url}/clients`),
    users: new URL(`${base_api.url}/users`),
    fast_actions: new URL(`${base_api.url}/fast-actions`),
    debts: new URL(`${base_api.url}/debts`),
    employee: new URL(`${base_api.url}/employee`),
    expirations: new URL(`${base_api.url}/expirations`)
}