"use client";

import { useState, useEffect } from "react";

export function useApi(url, options = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!url) return;

        let cancelled = false;

        async function fetchData() {
            try {
                setLoading(true);
                const response = await fetch(url, options);
                const result = await response.json();

                if (!cancelled) {
                    if (response.ok) {
                        setData(result);
                        setError(null);
                    } else {
                        setError(result.error || "Failed to fetch data");
                    }
                }
            } catch (err) {
                if (!cancelled) {
                    setError(err.message);
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        fetchData();

        return () => {
            cancelled = true;
        };
    }, [url]);

    return { data, loading, error };
}

export async function apiCall(url, options = {}) {
    const response = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        ...options,
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || "Request failed");
    }

    return data;
}
