import puppeteer from "puppeteer";
import { MontoCredential, MontoAuthentication } from "src/models/models.ts";
import { cacheGet, cacheSet } from "../utils/cache.ts";
import * as Sentry from '@sentry/node';

export async function getAuthToken(credential: MontoCredential): Promise<MontoAuthentication> {
    // check if the token is already in the cache
    const cachedAuthdata = await cacheGet('authToken');

    if (cachedAuthdata) {
        return cachedAuthdata;
    }

    // If no cached data, perform the authentication process using Puppeteer
    const { rootUrl, userName, password } = credential;
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        await page.goto(rootUrl);

        // Login
        await page.type('#username', userName);
        await page.type('#password', password);
        await page.click('button[type="submit"]');

        // Wait for the page to load
        await page.waitForNavigation();

        // Get the authentication token
        const cookies = await page.cookies();
        const authTokenCookie = cookies.find(cookie => cookie.name === 'appSession');

        if (!authTokenCookie || !authTokenCookie.value) {
            Sentry.captureException(new Error('Authentication failed'));
            throw new Error('Authentication failed');
        }

        const authToken = authTokenCookie.value;
        const ttl = 5 * 60 * 1000;
        const now = new Date().getTime();
        console.log('expiration:', authTokenCookie.expires); // check if the expiration is in miliseconds כדי לראות שאפשר להשוות אחרי זה לטיטיאל
        const expiration = Math.min(authTokenCookie.expires * 1000, now + ttl);

        // Cache the token
        await cacheSet('authToken', { token: authToken, expiration }, expiration - now);

        return { authToken, expiration };
    } catch (error) {
        Sentry.captureException(error);
        throw new Error('Error while getting the authentication token');
    } finally {
        await browser.close();
    }

}