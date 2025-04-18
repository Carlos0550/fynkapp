export const base_api={
    url: "https://fynkapp-production.up.railway.app",
}

//https://fynkapp-production.up.railway.app

export const logic_apis = {
    clients: new URL(`${base_api.url}/clients`),
    users: new URL(`${base_api.url}/users`),
    fast_actions: new URL(`${base_api.url}/fast-actions`),
    debts: new URL(`${base_api.url}/debts`),
    employee: new URL(`${base_api.url}/employee`)
}