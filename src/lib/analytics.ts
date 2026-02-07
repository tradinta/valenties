export interface GeoLocation {
    country: string;
    city: string;
    region: string;
    ip: string;
}

export const getGeoLocation = async (): Promise<GeoLocation> => {
    const providers = [
        async () => {
            // Priority 1: ipapi.co (Json format)
            const res = await fetch('https://ipapi.co/json/');
            const data = await res.json();
            return {
                country: data.country_name,
                city: data.city,
                region: data.region,
                ip: data.ip
            };
        },
        async () => {
            // Priority 2: ip-api.com (Non-SSL limitation sometimes, but reliable)
            const res = await fetch('http://ip-api.com/json/');
            const data = await res.json();
            return {
                country: data.country,
                city: data.city,
                region: data.regionName,
                ip: data.query
            };
        },
        async () => {
            // Priority 3: ipwhois.app
            const res = await fetch('https://ipwhois.app/json/');
            const data = await res.json();
            return {
                country: data.country,
                city: data.city,
                region: data.region,
                ip: data.ip
            };
        }
    ];

    for (const provider of providers) {
        try {
            const result = await provider();
            if (result.country) return result;
        } catch (e) {
            console.warn('Geo provider failed, trying next...');
        }
    }

    return { country: 'Unknown', city: 'Unknown', region: 'Unknown', ip: 'Unknown' };
};

export const getDeviceInfo = () => {
    if (typeof window === 'undefined') return { os: 'Unknown', browser: 'Unknown', deviceType: 'desktop' };

    const ua = navigator.userAgent;
    let os = 'Unknown';
    let browser = 'Unknown';
    let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';

    // OS Detection
    if (ua.indexOf("Win") !== -1) os = "Windows";
    if (ua.indexOf("Mac") !== -1) os = "MacOS";
    if (ua.indexOf("Linux") !== -1) os = "Linux";
    if (ua.indexOf("Android") !== -1) { os = "Android"; deviceType = 'mobile'; }
    if (ua.indexOf("like Mac") !== -1) { os = "iOS"; deviceType = 'mobile'; }

    // Browser Detection
    if (ua.indexOf("Chrome") !== -1) browser = "Chrome";
    else if (ua.indexOf("Safari") !== -1) browser = "Safari";
    else if (ua.indexOf("Firefox") !== -1) browser = "Firefox";
    else if (ua.indexOf("MSIE") !== -1) browser = "IE";

    if (window.innerWidth < 768) deviceType = 'mobile';

    return { os, browser, deviceType, userAgent: ua };
};
