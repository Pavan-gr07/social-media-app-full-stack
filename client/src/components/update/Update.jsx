import { useState } from "react";
import "./update.scss";

const Update = ({ handleCancel }) => {
  const [cover, setCover] = useState(null);
  const [profilePic, setProfilePic] = useState(null);
  const [profileData, setProfileData] = useState({
    name: "",
    city: "",
    website: "",
  });

  const handleChange = (e) => {
    e.preventDefault();
    setProfileData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div className="update">
      Update
      <form onSubmit={handleSubmit}>
        <input type="file" name="cover" />
        <input type="file" />
        <input type="text" name="name" onChange={handleChange} />
        <input type="text" name="city" onChange={handleChange} />
        <input type="text" name="website" onChange={handleChange} />
        <button type="submit">Update</button>
      </form>
      <span onClick={handleCancel}>X</span>
    </div>
  );
};

export default Update;
