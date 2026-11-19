// s11_server.cjs -- PM2 (CommonJS) wrapper that imports the ESM server.
async function main() { await import('./s11_server.mjs'); }
main();
