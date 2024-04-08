import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getPosts = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) return res.status(401).json("Not logged In!");
  //   console.log(token, "token");
  //   const decodedToken = jwt.decode(token);

  jwt.verify(token, "pavan@123", (err, userInfo) => {
    if (err) return res.status(403).json(err);
    //   const q = `SELECT * FROM posts AS p JOIN users AS u ON (u.id = p.userId)`;
    const q = `SELECT p.*,u.id AS userId,name,profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) LEFT JOIN relationships AS r ON (p.userId = r.followedUserId AND r.followerUserId = ?) WHERE r.followerUserId = ? OR p.userId = ? `;

    console.log(userInfo);
    db.query(q, [userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};
