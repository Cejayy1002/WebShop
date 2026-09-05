const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const os = require('os');

const root = __dirname;
const dataFile = path.join(root, 'users.json');
const port = Number(process.env.PORT) || 3000;

function readUsers() {
    if (!fs.existsSync(dataFile)) {
        return [];
    }
    return JSON.parse(fs.readFileSync(dataFile, 'utf8'));
}

function writeUsers(users) {
    fs.writeFileSync(dataFile, JSON.stringify(users, null, 2));
}

function hashPassword(password, salt) {
    return crypto.scryptSync(password, salt, 64).toString('hex');
}

function sendJson(response, status, body) {
    response.writeHead(status, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
    });
    response.end(JSON.stringify(body));
}

function readJsonBody(request) {
    return new Promise((resolve, reject) => {
        let body = '';
        request.on('data', chunk => { body += chunk; });
        request.on('end', () => {
            if (!body) {
                resolve({});
                return;
            }
            try {
                resolve(JSON.parse(body));
            } catch (error) {
                reject(new Error('Invalid JSON body.'));
            }
        });
        request.on('error', () => reject(new Error('Request body read failed.')));
    });
}

function serveFile(request, response) {
    const requested = decodeURIComponent(new URL(request.url, `http://${request.headers.host}`).pathname);
    const filePath = path.resolve(root, `.${requested === '/' ? '/index.html' : requested}`);
    if (!filePath.startsWith(root) || !fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
        response.writeHead(404);
        response.end('Not found');
        return;
    }
    const extensions = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg' };
    response.writeHead(200, { 'Content-Type': extensions[path.extname(filePath)] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(response);
}

const server = http.createServer((request, response) => {
    if (request.method === 'OPTIONS') {
        response.writeHead(204, { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'Content-Type' });
        response.end();
        return;
    }

    if (request.url === '/api/register' && request.method === 'POST') {
        readJsonBody(request)
            .then(({ email, password }) => {
                const normalizedEmail = String(email || '').trim().toLowerCase();
                const users = readUsers();
                if (!normalizedEmail || !password || users.some(user => user.email === normalizedEmail)) {
                    sendJson(response, 409, { error: 'This email is already registered or invalid.' });
                    return;
                }
                const salt = crypto.randomBytes(16).toString('hex');
                users.push({ email: normalizedEmail, salt, passwordHash: hashPassword(password, salt) });
                writeUsers(users);
                sendJson(response, 201, { ok: true });
            })
            .catch(() => sendJson(response, 400, { error: 'Invalid request body.' }));
        return;
    }

    if (request.url === '/api/login' && request.method === 'POST') {
        readJsonBody(request)
            .then(({ email, password }) => {
                const user = readUsers().find(item => item.email === String(email || '').trim().toLowerCase());
                const valid = user && hashPassword(password, user.salt) === user.passwordHash;
                sendJson(response, valid ? 200 : 401, valid ? { ok: true, email: user.email } : { error: 'Invalid email or password.' });
            })
            .catch(() => sendJson(response, 400, { error: 'Invalid request body.' }));
        return;
    }

    serveFile(request, response);
});

server.listen(port, '0.0.0.0', () => {
    const addresses = Object.values(os.networkInterfaces()).flat().filter(item => item && item.family === 'IPv4');
    console.log(`Personal Vault running on http://localhost:${port}`);
    addresses.forEach(address => console.log(`LAN access: http://${address.address}:${port}`));
});
