import app from "./app/app.js"
import { config } from "./config/config.js";
import connectDB from "./config/db.js";

const PORT = config.PORT || 3000

await connectDB()

app.listen(PORT, () => {
    console.log("Server is running on port 3000...");
})