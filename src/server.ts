import express from 'express';
import dotenv from 'dotenv';
dotenv.config();
import authorRoutes from "./routes/author.route";

const app = express();
const PORT = process.env.PORT || 3000;

//middlewares
app.use(express.json());

//routes
app.use("/api", authorRoutes);

//def routes
app.get("/", (req, res) => {
    res.send("Working fine...")
})

app.listen(PORT, () => {
    console.log(`Server is running at port ${PORT}`);
})