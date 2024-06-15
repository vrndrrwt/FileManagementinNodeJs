const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;

const requestHandler = (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    // Route for creating a file
    if (pathname === '/create' && req.method === 'GET') {
        const fileName = query.name;
        const content = query.content || '';
        if (fileName) {
            const filePath = path.join(__dirname, fileName);
            fs.writeFile(filePath, content, (err) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error creating file');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end('File created successfully');
                }
            });
        } else {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('File name is required');
        }
    }

    // Route for reading a file
    else if (pathname === '/read' && req.method === 'GET') {
        const fileName = query.name;
        if (fileName) {
            const filePath = path.join(__dirname, fileName);
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error reading file');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end(data);
                }
            });
        } else {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('File name is required');
        }
    }

    // Route for deleting a file
    else if (pathname === '/delete' && req.method === 'GET') {
        const fileName = query.name;
        if (fileName) {
            const filePath = path.join(__dirname, fileName);
            fs.unlink(filePath, (err) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Error deleting file');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end('File deleted successfully');
                }
            });
        } else {
            res.writeHead(400, { 'Content-Type': 'text/plain' });
            res.end('File name is required');
        }
    }

    // Route not found
    else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Route not found');
    }
};

const server = http.createServer(requestHandler);

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
