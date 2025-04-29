import express from 'express';
import { Server } from 'http';

//
const app = express();
const httpServer = new Server(app);

export { app, httpServer };
