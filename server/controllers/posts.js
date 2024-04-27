import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getPosts = (req, res) => {
  const userId = parseInt(req.query.userId);

  const token = req.headers.authorization.split(" ")[1];
  if (!token) return res.status(401).json("Not logged In!");
  // console.log(token, "token");
  const decodedToken = jwt.decode(token);
  // console.log(decodedToken, "decode----");

  jwt.verify(token, "pavan@123", (err, userInfo) => {
    if (err) return res.status(403).json(err);
    console.log(userId == undefined, "value");
    // const q = `SELECT * FROM posts AS p JOIN users AS u ON (u.id = p.userId)`;

    const q = userId
      ? `SELECT p.*,u.id AS userId,name,profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) WHERE p.userId=?`
      : `SELECT p.*,u.id AS userId,name,profilePic FROM posts AS p JOIN users AS u ON (u.id = p.userId) LEFT JOIN relationships AS r ON (p.userId = r.followedUserId ) WHERE r.followerUserId = ? OR p.userId = ? ORDER BY p.createAt DESC`;

    const values = userId ? [userId] : [userInfo.id, userInfo.id];

    db.query(q, values, (err, data) => {
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

// delete posts
export const deletePost = (req, res) => {
  const q = "DELETE FROM posts WHERE id = ?";

  db.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Post as been Deleted");
  });
};
