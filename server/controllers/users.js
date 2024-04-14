import { db } from "../connect.js";
import jwt from "jsonwebtoken";

//get Users
export const getUser = (req, res) => {
  const q = `SELECT username,email,name,coverPic,profilePic,city,website FROM users WHERE id = ?`;
  db.query(q, [req.query.id], (err, data) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(data?.[0]);
  });
};
