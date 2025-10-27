export interface LogFilter {
    type?: string;
    userId?: number;
    startDate?: string;
    endDate?: string;
    limit?: number;
}

export async function getLogs(filter: LogFilter = {}) {
    const params = new URLSearchParams();
    
    if (filter.type) {
        params.append('type', filter.type);
    }
    if (filter.userId) {
        params.append('userId', filter.userId.toString());
    }
    if (filter.startDate) {
        params.append('startDate', filter.startDate);
    }
    if (filter.endDate) {
        params.append('endDate', filter.endDate);
    }
    if (filter.limit) {
        params.append('limit', filter.limit.toString());
    }

    const queryString = params.toString();
    const url = `/api/logs${queryString ? `?${queryString}` : ''}`;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            cache: 'no-store'
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to fetch logs');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching logs:', error);
        throw error;
    }
}