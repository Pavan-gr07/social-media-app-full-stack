import express from "express";
import userRoutes from "./routes/users.js";
import postsRoutes from "./routes/posts.js";
import likesRoutes from "./routes/likes.js";
import commentsRoutes from "./routes/comments.js";
import authRoutes from "./routes/auth.js";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

//middlewares
app.use(express.json());
app.use(cookieParser());

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/likes", likesRoutes);
app.use("/api/comments", commentsRoutes);

app.listen(8000, () => {
  console.log("BackEnd is Running");
});
