import * as Sentry from '@sentry/node';

// init Sentry
export function initSentry() {
    Sentry.init({
        dsn: "https://84296a3c48f295f10a955867390fc14a@o4507408063463424.ingest.us.sentry.io/4507408076570624"
        // should be- dsn: process.env.DSN_SENTRY,
    });
};
