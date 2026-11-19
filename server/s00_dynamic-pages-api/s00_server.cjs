// PM2 requires CommonJS — this wrapper imports the ESM server
async function main() {
    await import('./s00_server.mjs');
}
main();
