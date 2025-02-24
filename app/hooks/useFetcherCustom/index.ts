import { useFetcher } from "@remix-run/react";
import { useEffect, useState } from "react";

export const useFetcherCustom = () => {
    const fetcher = useFetcher();
    const [isLoading, setIsLoading] = useState(false);
    const [data, setData] = useState<any>(null);

    const fetcherSubmitFile = (formData: FormData) => {
        fetcher.submit(formData, { method: 'POST', encType: "multipart/form-data" });
    }

    const fetcherSubmit = (formData: FormData) => {
        fetcher.submit(formData, { method: 'POST' });
    }

    useEffect(() => {
        if (fetcher.state === 'idle') {
            setIsLoading(false);
        } else if (fetcher.state === 'loading') {
            setIsLoading(true);
        } else if (fetcher.state === 'submitting') {
            setIsLoading(true);
        }
    }, [fetcher.state]);

    useEffect(() => {
        if (fetcher.data) {
            setData(fetcher.data);
        }
    }, [fetcher.data])

    return {
        isLoading,
        data,
        fetcher,
        fetcherSubmitFile,
        fetcherSubmit
    }
}