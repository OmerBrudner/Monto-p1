import dotenv from 'dotenv';
dotenv.config();

const greeting: string = 'hello';
console.log(greeting);
console.log(process.env.DSN_SENTRY);

