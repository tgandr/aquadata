const API_URL = 'http://localhost:5234/';

export default async function apiRequest(endpoint, method, body, auth = null) {
    const credentials = auth && `${auth.email}:${auth.password}`
    const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': auth ? `Basic ${btoa(credentials)}` : ''
        },
        body: method !== 'GET' && body? JSON.stringify(body): undefined
    });
    if (!response.ok) {
        const data = await response.json()
        throw new Error(data.description);
    }

    return response.json();
}