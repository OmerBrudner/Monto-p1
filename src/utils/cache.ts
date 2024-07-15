import { CacheData } from "src/models/models.ts";

const cacheStore: { [key: string]: CacheData } = {};

export async function cacheGet(key: string): Promise<any> {
    const cachData = cacheStore[key];

    if (!cachData) {
        return null;
    }

    const now = new Date().getTime();
    if (now > cachData.expiration) {
        delete cacheStore[key];
        return null;
    }

    return cachData.data;
}

export async function cacheSet(key: string, data: any, ttl: number): Promise<any | null> {
    const expiration = new Date().getTime() + ttl;
    cacheStore[key] = { data, expiration };
}
