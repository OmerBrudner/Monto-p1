import { CacheData } from "src/models/models.ts";

const cacheStore: { [key: string]: CacheData } = {};

export function cacheGet(key: string): any | null {
    const cacheData = cacheStore[key];

    if (!cacheData) {
        return null;
    }

    const now = new Date().getTime();
    if (now > cacheData.expiration) {
        delete cacheStore[key];
        return null;
    }

    return cacheData.data;
}


export function cacheSet(key: string, data: any, ttl: number = 1000 * 60 * 10): any { // default ttl is 10 minutes

    const expiration = new Date().getTime() + ttl;
    cacheStore[key] = { data, expiration };

    return { data, expiration };
}
