export const base_api={
    url: "http://localhost:5000",
}


export const logic_apis = {
    clients: new URL(`${base_api.url}/clients`),
    users: new URL(`${base_api.url}/users`),
    fast_actions: new URL(`${base_api.url}/fast-actions`),
}