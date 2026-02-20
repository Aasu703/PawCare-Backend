import app from './app';
import { createServer } from 'http';
import { connectdb } from './database/mongodb';
import { PORT } from './config';
import { initSocketServer } from './realtime/socket-server';
import { logger } from './utils/logger';



// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    logger.error('unhandled_rejection', {
        reason: reason instanceof Error ? reason.message : String(reason),
    });
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    logger.error('uncaught_exception', { error: err.message });
    process.exit(1);
});

async function startServer() {
    await connectdb();
    const httpServer = createServer(app);
    initSocketServer(httpServer);
    httpServer.listen(PORT, () => {
        logger.info('server_started', { port: PORT });
    });
}

startServer();
