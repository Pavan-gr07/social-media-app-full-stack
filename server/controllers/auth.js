import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export const register = (req, res) => {
  //CHECK USER IF EXISTS
  const userId = uuidv4();

  const q = "SELECT * FROM users WHERE username = ?";

  db.query(q, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("User already exist");
    //CREATE A NEW USER

    //HASH THE PASSWORD
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);

    const q =
      "INSERT INTO users (`userId`,`username`,`email`,`password`,`name`) VALUES (?)";
    const values = [
      userId,
      req.body.username,
      req.body.email,
      hashedPassword,
      req.body.name,
    ];
    db.query(q, [values], (err, data) => {
      if (err) return res.json(err);
      return res.status(200).json("User as Been Created");
    });
  });
};
export const login = () => {};
export const logout = () => {};
