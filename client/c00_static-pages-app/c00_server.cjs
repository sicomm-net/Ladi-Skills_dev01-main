// PM2 requires CommonJS — this wrapper imports the ESM server
async function main() {
    await import('./c00_server.mjs');
}
main();
