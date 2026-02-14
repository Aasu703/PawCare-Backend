import app from './app';
import { connectdb } from './database/mongodb';
import { PORT } from './config';
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
    app.listen(PORT, () => {
        logger.info('server_started', { port: PORT });
    });
}

startServer();