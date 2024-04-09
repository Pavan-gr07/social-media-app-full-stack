import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getPosts = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) return res.status(401).json("Not logged In!");
  // console.log(token, "token");
  const decodedToken = jwt.decode(token);
  console.log(decodedToken, "decode----");

  jwt.verify(token, "pavan@123", (err, userInfo) => {
    if (err) return res.status(403).json(err);
    // const q = `SELECT * FROM posts AS p JOIN users AS u ON (u.id = p.userId)`;
    const q = `SELECT p.*,u.id AS userId,name,profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) LEFT JOIN relationships AS r ON (p.userId = r.followedUserId ) WHERE r.followerUserId = ? OR p.userId = ? ORDER BY p.createAt DESC`;

    db.query(q, [userInfo.id, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};

// add posts
export const addPosts = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) return res.status(401).json("Not logged In!");

  jwt.verify(token, "pavan@123", (err, userInfo) => {
    if (err) return res.status(403).json(err);
    // const q = `SELECT * FROM posts AS p JOIN users AS u ON (u.id = p.userId)`;
    const q = "INSERT INTO posts (`desc`,`img`,`createAt`,`userId`) VALUES (?)";

    const values = [
      req.body.desc,
      req.body.img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo?.id,
    ];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Post as been created");
    });
  });
};
