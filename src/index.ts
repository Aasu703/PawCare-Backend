import app from './app';
import { connectdb } from './database/mongodb';
import { PORT } from './config';




async function startServer() {
    await connectdb();
    app.listen(PORT, () => {
        console.log(`Server is running: http://localhost:${PORT}`);
    });
}

startServer();