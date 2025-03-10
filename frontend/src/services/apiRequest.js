const API_URL = 'http://localhost:5234/';

export async function apiRequest(endpoint, method, body, token = '') {
    const response = await fetch(`${API_URL}${endpoint}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        },
        body: method !== 'GET'? JSON.stringify(body): undefined
    });

    if (!response.ok) {
        throw new Error(`Request failed: ${response.statusText}`);
    }

    return response.json();
}