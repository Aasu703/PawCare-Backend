import app from "./app";
import { connectdb } from "./database/mongodb";

import { PORT} from "./config";

// Starting the MongoDB connection and then the server
async function startServer() {
    await connectdb();
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

startServer();