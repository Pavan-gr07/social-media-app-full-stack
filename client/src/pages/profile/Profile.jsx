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
import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { id } = useParams();
  const { currentUser } = useContext(AuthContext);

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

  console.log(relationShipData, "relationShipData");

  return (
    <div className="profile">
      <div className="images">
        <img
          src="https://images.pexels.com/photos/13440765/pexels-photo-13440765.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
          alt=""
          className="cover"
        />
        <img
          src="https://images.pexels.com/photos/14028501/pexels-photo-14028501.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load"
          alt=""
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
                <span>{data?.name}</span>
              </div>
            </div>
            {console.log(JSON.parse(currentUser)?.id)}
            {id == JSON.parse(currentUser)?.id ? (
              <button>Update</button>
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
    </div>
  );
};

export default Profile;
