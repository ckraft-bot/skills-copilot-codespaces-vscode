// Create web server
// 1. Include http module
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const commentsData = require('./commentsData');

// 2. Create server
const server = http.createServer((req, res) => {
    // 3. Parse request url
    const parsedUrl = url.parse(req.url, true);
    // 4. Handle request method
    if (req.method === 'GET') {
        // 5. Handle GET request
        if (parsedUrl.pathname === '/comments') {
            // 6. Read comments data from file
            fs.readFile(path.join(__dirname, 'commentsData.json'), 'utf8', (err, data) => {
                if (err) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Comments data not found' }));
                } else {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(data);
                }
            });
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Not found' }));
        }
    } else if (req.method === 'POST') {
        // 7. Handle POST request
        if (parsedUrl.pathname === '/comments') {
            let body = '';
            req.on('data', (chunk) => {
                body += chunk.toString();
            });
            req.on('end', () => {
                const newComment = JSON.parse(body);
                commentsData.push(newComment);
                fs.writeFile(path.join(__dirname, 'commentsData.json'), JSON.stringify(commentsData), (err) => {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ message: 'Internal server error' }));
                    } else {
                        res.writeHead(201, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify(newComment));
                    }
                });
            });
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Not found' }));
        }
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: '