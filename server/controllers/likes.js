import { db } from "../connect.js";
import jwt from "jsonwebtoken";

//get like
export const getLikes = (req, res) => {
  const q = "SELECT userId from likes WHERE postId = ?";
  db.query(q, [req.query.postId], (err, data) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(data?.map((like) => like.userId));
  });
};

//like
export const addLike = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) return res.status(401).json("Not logged In!");

  jwt.verify(token, "pavan@123", (err, userInfo) => {
    if (err) return res.status(403).json(err);
    const q = "INSERT INTO LIKES (`userId`,`postId`) VALUES (?)";

    const values = [userInfo?.id, req.body.postId];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("like added Successfully");
    });
  });
};

//dislike
export const deleteLike = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) return res.status(401).json("Not logged In!");

  jwt.verify(token, "pavan@123", (err, userInfo) => {
    if (err) return res.status(403).json(err);
    const q = "DELETE  FROM likes WHERE userId = ? AND postId = ?";

    db.query(q, [userInfo?.id, req.query.postId], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};
