/* server.js */
const express = require('express');
const next = require('next');
const { parse } = require('url');
const { join } = require('path');
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare()
	.then(() => {
		const server = express();

		server.get('/service-worker.js', (req, res) => {
			const parsedUrl = parse(req.url, true)
			const { pathname } = parsedUrl
			const serviceWorkerPath = join(__dirname, '.next', pathname)
			app.serveStatic(req, res, serviceWorkerPath)
		})

		server.get(['/manifest.json', '/pw-compat', /icon/], (req, res) => {
			const parsedUrl = parse(req.url, true)
			const { pathname } = parsedUrl
			const filePath = join(__dirname, 'static', pathname)
			app.serveStatic(req, res, filePath)
		})

		server.get('/pw-compat.js', (req, res) => {
			const parsedUrl = parse(req.url, true)
			const { pathname } = parsedUrl
			const filePath = join(__dirname, 'static', pathname)
			app.serveStatic(req, res, filePath)
		})

		server.get('/freeform/:id', (req, res) => {
			const actualPage = '/freeform-prompt';
			const queryParams = { id: req.params.id };
			app.render(req, res, actualPage, queryParams);
		})

		server.get(['/display/:id', '/index.html'], (req, res) => {
			const actualPage = '/display';
			const queryParams = { id: req.params.id };
			app.render(req, res, actualPage, queryParams);
		})

		server.get('*', (req, res) => {
			return handle(req, res)
		})

		server.listen(3000, (err) => {
			if (err) throw err
			console.log('> Ready on http://localhost:3000')
		})
	})
	.catch((ex) => {
		console.error(ex.stack)
		process.exit(1)
	})