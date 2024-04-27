import { useState } from "react";
import "./update.scss";
import { Button, Dialog, Stack, TextField, Typography } from "@mui/material";
import { makeRequest } from "../../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const Update = ({ handleCancel, open, userData }) => {
  const { id } = useParams();
  console.log(userData, "userData");

  const [cover, setCover] = useState(userData?.coverPic || null);
  const [profilePic, setProfilePic] = useState(userData?.profilePic || null);
  const [profileData, setProfileData] = useState({
    name: userData?.name,
    city: userData?.city,
    website: userData?.website,
    username: userData?.username,
    email: userData?.email,
  });

  const upload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await makeRequest.post(`/upload`, formData);
      return response.data;
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    setProfileData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["user"],
    mutationFn: async (data) => {
      const token = localStorage.getItem("idToken");
      try {
        const response = await makeRequest.put(`/user?id=` + id, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        return response.data;
      } catch (error) {
        throw new Error("Failed to create post");
      }
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries("user");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    let coverURl = "";
    let profileURl = "";
    if (cover) coverURl = await upload(cover);
    if (profilePic) profileURl = await upload(profilePic);
    const finalData = {
      name: profileData?.name,
      website: profileData?.website,
      city: profileData?.city,
      profilePic: profileURl,
      coverPic: coverURl,
      email: profileData?.email,
      username: profileData?.username,
    };
    mutation.mutate(finalData);
  };

  return (
    <Dialog open={open} onClose={handleCancel}>
      <Stack sx={{ p: 2 }} spacing={5}>
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", flex: 1 }}
        >
          <Typography
            variant="h5"
            sx={{
              flex: 1,
              textAlign: "center",
              fontWeight: "600",
            }}
            color="primary"
          >
            Update
          </Typography>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "600",
              cursor: "pointer",
            }}
            onClick={handleCancel}
          >
            X
          </Typography>
        </Stack>
        <form onSubmit={handleSubmit}>
          <Stack spacing={1}>
            <Stack spacing={1} direction="row">
              <TextField
                type="file"
                name="cover"
                placeholder="Cover Picture"
                value={profileData?.cover}
                onChange={(e) => setCover(e.target.files[0])}
              />
              <TextField
                type="file"
                name="profilePic"
                placeholder="Profile Pic"
                value={profileData?.profilePic}
                onChange={(e) => setProfilePic(e.target.files[0])}
              />
            </Stack>
            <Stack spacing={1} direction="row">
              {" "}
              <TextField
                type="text"
                name="username"
                value={profileData?.username}
                placeholder="User Name"
                onChange={handleChange}
                fullWidth
              />
              <TextField
                type="text"
                name="email"
                value={profileData?.email}
                placeholder="Email"
                onChange={handleChange}
                fullWidth
              />
            </Stack>
            <Stack spacing={1} direction="row">
              <TextField
                type="text"
                name="name"
                value={profileData?.name}
                placeholder="Name"
                onChange={handleChange}
                fullWidth
              />
              <TextField
                type="text"
                name="city"
                value={profileData?.city}
                placeholder="City Name"
                onChange={handleChange}
                fullWidth
              />
            </Stack>

            <TextField
              type="text"
              name="website"
              value={profileData?.website}
              placeholder="Website URl"
              onChange={handleChange}
            />
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>
              Update
            </Button>
          </Stack>
        </form>
      </Stack>
    </Dialog>
  );
};

export default Update;
