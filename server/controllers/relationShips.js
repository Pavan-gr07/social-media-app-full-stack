import { db } from "../connect.js";
import jwt from "jsonwebtoken";

//get Relationship
export const getRelationShips = (req, res) => {
  const q = "SELECT followerUserId FROM relationships WHERE followedUserId = ?";
  db.query(q, [req.query.id], (err, data) => {
    if (err) return res.status(500).json(err);
    res.status(200).json(data?.map((follow) => follow.followerUserId));
  });
};

//Relationship
export const addRelationShips = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) return res.status(401).json("Not logged In!");

  jwt.verify(token, "pavan@123", (err, userInfo) => {
    if (err) return res.status(403).json(err);
    const q =
      "INSERT INTO relationships (followerUserId,followedUserId) VALUES (?)";

    const values = [userInfo?.id, req.body.followedUserId];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Relationship added Successfully");
    });
  });
};

//disRelationship
export const deleteRelationShips = (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) return res.status(401).json("Not logged In!");

  jwt.verify(token, "pavan@123", (err, userInfo) => {
    if (err) return res.status(403).json(err);
    const q =
      "DELETE FROM relationships WHERE followerUserId = ? AND followedUserId = ?;";

    db.query(q, [userInfo?.id, req.query.id], (err) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("user un followed Successfully");
    });
  });
};
