import { AppDataSource } from "../data-source";

async function connectWithRetry(
    retries = 10,
    delay = 3000
): Promise<void> {
    try {
        await AppDataSource.initialize();
        console.log("Database connected");
    } catch (error) {
        console.error("Database not ready, retrying...", {
            retriesLeft: retries,
        });

        if (retries <= 0) {
            console.error("Could not connect to database");
            throw error;
        }

        await new Promise((res) => setTimeout(res, delay));
        return connectWithRetry(retries - 1, delay);
    }
}

export default connectWithRetry;