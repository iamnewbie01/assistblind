import express from 'express';
import http from 'http';
import {Server as SocketIOServer} from 'socket.io';
import cors from 'cors';
import {json} from 'express';
import path from 'path';
import dotenv from 'dotenv';
import {ApolloServer} from '@apollo/server';
import {expressMiddleware} from '@apollo/server/express4';
import {ApolloServerPluginDrainHttpServer} from '@apollo/server/plugin/drainHttpServer';
import {schema} from '../api/schema';
import {authMiddleware} from '../middleware/auth';
import {errorHandler} from '../middleware/errorHandler';
import {logger} from '../utils/logger';
import {connectDatabase} from '../config/database';

// Define context interface
interface MyContext {
  userId?: string;
}

// Load environment variables
dotenv.config({path: path.resolve(__dirname, '../.env')});

// Import routes
const locationRoutes = require('../routes/locationRoutes');
const placesRoutes = require('../routes/placesRoutes');
const routesRoutes = require('../routes/routesRoutes');

// Import socket handlers
const navigationHandler = require('../sockets/navigationHandler');

// Server configuration
const SERVER_HOST = process.env.SERVER_HOST || 'localhost';
const PORT = parseInt(process.env.PORT || '3000');
const SERVER_URL = process.env.SERVER_URL || `http://${SERVER_HOST}:${PORT}`;
export const WS_URL = SERVER_URL.replace(/^http/, 'ws');

async function startServer() {
  try {
    // Connect to database
    await connectDatabase();

    // Initialize express app
    const app = express();
    const httpServer = http.createServer(app);

    // Setup Socket.IO
    const io = new SocketIOServer(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST'],
      },
    });

    app.locals.serverUrl = SERVER_URL;
    app.locals.wsUrl = WS_URL;

    // Apply authentication middleware
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
    app.use(authMiddleware);

    // REST API Routes
    app.use('/api/location', locationRoutes);
    app.use('/api/places', placesRoutes);
    app.use('/api/routes', routesRoutes);

    // Health check endpoint
    app.get('/health', (req, res) => {
      res.status(200).json({
        status: 'ok',
        serverUrl: SERVER_URL,
        wsUrl: WS_URL,
      });
    });

    // Setup Apollo GraphQL Server
    const apolloServer = new ApolloServer<MyContext>({
      schema,
      plugins: [
        // Proper shutdown for the HTTP server
        ApolloServerPluginDrainHttpServer({httpServer}),
        // Custom plugin for error logging
        {
          async requestDidStart() {
            return {
              async didEncounterErrors({errors}) {
                errors.forEach(error => {
                  logger.error('GraphQL error', error);
                });
              },
            };
          },
        },
      ],
    });

    // Start the Apollo Server
    await apolloServer.start();

    // Apply GraphQL middleware
    app.use(
      '/graphql',
      cors<cors.CorsRequest>(),
      json(),
      expressMiddleware<MyContext>(apolloServer, {
        context: async ({req}) => {
          // Return context with userId from auth middleware
          return {
            userId: req.userId,
          };
        },
      }),
    );

    // Error handling middleware
    app.use(errorHandler);

    // Socket.io connection handling
    io.on('connection', socket => {
      logger.info(`Client connected: ${socket.id}`);
      navigationHandler(io, socket);
    });

    // Start server
    await new Promise<void>(resolve =>
      httpServer.listen({port: PORT}, resolve),
    );

    logger.info(`Server running on port ${PORT}`);
    logger.info(`GraphQL endpoint: ${SERVER_URL}/graphql`);
    logger.info(`WebSocket endpoint: ${WS_URL}`);

    return {app, httpServer, serverUrl: SERVER_URL, wsUrl: WS_URL};
  } catch (error) {
    logger.error('Failed to start server', error);
    process.exit(1);
  }
}

// Start the server
if (require.main === module) {
  startServer();
}

export default startServer;
