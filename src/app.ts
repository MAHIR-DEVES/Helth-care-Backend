import express, { Application, Request, Response } from 'express';
import { IndexRoute } from './app/routes';
import { globalErrorHandler } from './app/middleware/golbelErrorHandler';
import { notFound } from './app/middleware/notFound';
import cookieParser from 'cookie-parser';

const app: Application = express();

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1', IndexRoute);

// Basic route
app.get('/', async (req: Request, res: Response) => {
  res.send('health management server in running');
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
