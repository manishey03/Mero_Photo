import fs from 'fs';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import express, { static as serveStatic } from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import path from 'path';
dotenv.config();

import type { NextFunction, Request, Response } from 'express';

//
import './config/database';
import appRouter from './router';
import { app, httpServer } from './server';

//
import appConfig from './config/index';
import { error } from './utils/api/response.utl';

//
dotenv.config();

// Other middleware and configurations
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.options('*', cors());
app.use(bodyParser.urlencoded({ extended: false, limit: '10mb' }));
app.use(compression());
app.use(cookieParser());

// Serve static files from the 'uploads' directory
const projectRoot = path.join(__dirname, '..'); // Get project root
const uploadsPath = path.join(projectRoot, 'uploads'); // Construct absolute path
app.use('/uploads', serveStatic(uploadsPath)); // Serve static files

// routes
app.use('/api', appRouter);

app.get('/', (_req: Request, res: Response) => {
  return res.json({
    success: true,
    message: 'Api working fine',
  });
});

// Error Handler

/**
 * Interface for Custom Error
 */
export interface CustomError extends Error {
  code: number;
  errors: string | { [key: string]: string };
}

/**
 * Global error handling
 */
app.use((err: CustomError, _req: Request, res: Response, next: NextFunction) => {
  if (res.headersSent) {
    next(err);
  }
  const { message, code } = error(err, err.code);
  //
  return res.status(code).json({ message, code });
});

// FOR SEEDER:
import './seeder';

/**
 * Only for development
 */
const directoryPath = './uploads';
if (!fs.existsSync(directoryPath)) {
  fs.mkdirSync(directoryPath, { recursive: true });
}

//
const PORT = appConfig.port;
httpServer.listen(PORT, async () => {
  console.log(`Server running at http://localhost:`, PORT);
});
