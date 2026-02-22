import express, { Application, Request, Response } from 'express';
import { prisma } from './app/lib/prisma';
import { IndexRoute } from './app/routes';

const app: Application = express();

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());

app.use('/api/v1', IndexRoute);

// Basic route
app.get('/', async (req: Request, res: Response) => {
  res.send('health management server in running');
});

export default app;
