import express from "express";
const app = express();
import userRoutes from "./routes/users";
import postsRoutes from "./routes/posts";
import likesRoutes from "./routes/likes";
import commentsRoutes from "./routes/comments";
import authRoutes from "./routes/auth";

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/likes", likesRoutes);
app.use("/api/comments", commentsRoutes);

app.listen(8000, () => {
  console.log("BackEnd is Running");
});
