import "./profile.scss";
import FacebookTwoToneIcon from "@mui/icons-material/FacebookTwoTone";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import InstagramIcon from "@mui/icons-material/Instagram";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import PlaceIcon from "@mui/icons-material/Place";
import LanguageIcon from "@mui/icons-material/Language";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Posts from "../../components/posts/Posts";
import Update from "../../components/update/Update";
import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);
  const [updateOpen, setUpdateOpen] = useState(false);

  const { isLoading, error, data } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      try {
        const response = await makeRequest.get("/user", {
          params: {
            id,
          },
        });
        return response.data;
      } catch (error) {
        throw new Error("Failed to fetch likes");
      }
    },
  });

  const { data: relationShipData } = useQuery({
    queryKey: ["relationships"],
    queryFn: async () => {
      try {
        const response = await makeRequest.get("/relationships?id=" + id);
        return response.data;
      } catch (error) {
        throw new Error("Failed to fetch likes");
      }
    },
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["relationships"],
    mutationFn: async (follow) => {
      const token = localStorage.getItem("idToken");
      try {
        if (follow)
          return await makeRequest.delete("/relationships?id=" + id, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          });
        return await makeRequest.post(
          "/relationships",
          { followedUserId: id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );
      } catch (error) {
        throw new Error("Failed to create post");
      }
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries("relationships");
    },
  });

  const handleFollow = (e) => {
    e.preventDefault();
    mutation.mutate(relationShipData?.includes(JSON.parse(currentUser).id));
  };

  return (
    <div className="profile">
      <div className="images">
        <img
          src={"../upload/" + data?.coverPic}
          alt="cover"
          className="cover"
        />
        <img
          src={"../upload/" + data?.profilePic}
          alt="profile Pic"
          className="profilePic"
        />
      </div>
      <div className="profileContainer">
        <div className="uInfo">
          <div className="left">
            <a href="http://facebook.com">
              <FacebookTwoToneIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <InstagramIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <TwitterIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <LinkedInIcon fontSize="large" />
            </a>
            <a href="http://facebook.com">
              <PinterestIcon fontSize="large" />
            </a>
          </div>
          <div className="center">
            <span>{data?.username}</span>
            <div className="info">
              <div className="item">
                <PlaceIcon />
                <span>{data?.city}</span>
              </div>
              <div className="item">
                <LanguageIcon />
                <span>{data?.website}</span>
              </div>
            </div>
            {id == JSON.parse(currentUser)?.id ? (
              <button onClick={() => setUpdateOpen(true)}>Update</button>
            ) : (
              <button onClick={handleFollow}>
                {relationShipData?.includes(JSON.parse(currentUser)?.id)
                  ? "Following"
                  : "Follow"}
              </button>
            )}
          </div>
          <div className="right">
            <EmailOutlinedIcon />
            <MoreVertIcon />
          </div>
        </div>
        <Posts userId={id} />
      </div>
      {updateOpen && (
        <Update
          handleCancel={() => setUpdateOpen(false)}
          open={updateOpen}
          userData={data}
        />
      )}
    </div>
  );
};

export default Profile;
