import express from 'express';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.CLIENT_PORT || 19100;

// Read route table
const routesFile = path.join(__dirname, 'routes.json');
let routeConfig;
try {
    const raw = readFileSync(routesFile, 'utf8');
    routeConfig = JSON.parse(raw);
} catch (e) {
    console.error(`\n  ERROR reading routes.json: ${e.message}`);
    if (e.message.includes('position')) {
        const pos = parseInt(e.message.match(/position (\d+)/)?.[1]);
        if (!isNaN(pos)) {
            const raw = readFileSync(routesFile, 'utf8');
            const start = Math.max(0, pos - 20);
            const end = Math.min(raw.length, pos + 20);
            const snippet = raw.substring(start, end);
            const pointer = ' '.repeat(pos - start) + '^';
            console.error(`\n  Near position ${pos}:`);
            console.error(`  ${snippet}`);
            console.error(`  ${pointer}`);
        }
    }
    process.exit(1);
}

// Log all incoming requests
app.use((req, res, next) => {
    console.log(`  >> ${req.method} ${req.url} (host: ${req.headers.host})`);
    next();
});

// Mount each enabled route as a static file server
routeConfig.routes.forEach(route => {
    const disabled = (route.disabled || 'no').toLowerCase() === 'yes';
    if (disabled) {
        console.log(`  Route: ${route.path} -> DISABLED`);
        return;
    }
    const folder = path.resolve(__dirname, route.folder);
    app.use(route.path, express.static(folder));
    console.log(`  Route: ${route.path} -> ${folder}`);
});

// List valid pages
app.get('/pages', (req, res) => {
    const pages = routeConfig.routes
        .filter(route => (route.disabled || 'no').toLowerCase() !== 'yes')
        .map(route => route.path);
    res.json({ pages });
});

// Root redirect
app.get('/', (req, res) => res.redirect(routeConfig.default));

// 404 fallback
app.use((req, res) => {
    res.status(404).send('Not Found');
});

app.listen(PORT, () => {
//  console.log(`  Routes loaded: ${routeConfig.routes.length}`);
    console.log(`\n  c00_home-app listening on port ${PORT}\n`);
});
