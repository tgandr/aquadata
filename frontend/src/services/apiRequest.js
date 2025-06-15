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
        }
    )
    let responseData;
    if (!response.ok) {
        throw new Error(`Error: ${responseData || 'Unknown error'}`);
    }

    const contentType = response.headers.get('content-type')
    try {
        if (contentType && contentType.includes('application/json'))
            responseData = await response.json()
        else
            responseData = await response.text()
    }
    catch(err) {
        responseData = err
    }

    return responseData;
}