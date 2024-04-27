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
//update Users
export const updateUser = (req, res) => {
  const userId = req.query.id;
  console.log(req.query, "userId");
  const { username, coverPic, profilePic, city, website, email, name } =
    req.body;

  const q = `UPDATE users SET username = ?,coverPic=?,profilePic=?,city=?,website=?,email=?,name=? where id = ?`;

  const values = [
    username,
    coverPic,
    profilePic,
    city,
    website,
    email,
    name,
    userId,
  ];

  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(data);
  });
};
