
import express, { Application, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { connectdb } from './database/mongodb';
import { PORT } from './config';
import authRoutes from './routes/auth.route';

const app: Application = express();

let corsOptions = {
    origin:["http://localhost:3000", "http://localhost:3003"],
    // list of domains allowed to access the server
    // frontend domain/url
}

// origin: "*", allow all domians
app.use(cors(corsOptions));

// app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Health check route
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({ message: 'PawCare API is running!' });
});

// Auth routes
app.use('/api/auth', authRoutes);

async function startServer() {
    await connectdb();
    app.listen(PORT, () => {
        console.log(`Server is running: http://localhost:${PORT}`);
    });
}

startServer();