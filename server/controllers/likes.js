import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getLikes = (req, res) => {
  const q = "SELECT userId from likes WHERE postId = ?";
  console.log(req.query.postId, "postId");
  db.query(q, [parseInt(req.query.postId)], (err, data) => {
    if (err) return res.status(403).json(err);
    res.status(200).json(data?.map((like) => like.userId));
  });
};
