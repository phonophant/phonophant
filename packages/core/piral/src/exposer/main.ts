import * as express from 'express';

export function runPiral(app: express.Application) {
  const path = require('path');
  app.use(express.static(path.resolve(__dirname, 'release')));

  app.get('/', (req: any, res: any, next: any) => {
    if (req.url.includes('/api')) return next();
    res.sendFile(path.resolve(__dirname, 'release', 'index.html'));
  });
}