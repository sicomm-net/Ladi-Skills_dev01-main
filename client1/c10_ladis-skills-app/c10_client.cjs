// c11_client.cjs -- PM2 (CommonJS) wrapper that imports the ESM server.
async function main() { await import('./c11_client.mjs'); }
main();
