import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link, useParams } from "react-router-dom";
import Comments from "../comments/Comments";
import { useContext, useState } from "react";
import moment from "moment";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../context/authContext";
import { Menu, MenuItem } from "@mui/material";

const Post = ({ post }) => {
  const [commentOpen, setCommentOpen] = useState(false);
  const { id } = useParams();

  const { currentUser } = useContext(AuthContext);

  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { isLoading, error, data } = useQuery({
    queryKey: ["likes", post.id],
    queryFn: async () => {
      try {
        const response = await makeRequest.get("/likes?postId=" + post.id);
        return response.data;
      } catch (error) {
        throw new Error("Failed to fetch likes");
      }
    },
  });

  const { data: commentsData } = useQuery({
    queryKey: ["comments", post.id],
    queryFn: async () => {
      try {
        const response = await makeRequest.get("/comments?postId=" + post.id);
        return response.data;
      } catch (error) {
        throw new Error("Failed to fetch comments");
      }
    },
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationKey: ["likes", "posts"],
    mutationFn: async ({ currentUser, type }) => {
      const token = localStorage.getItem("idToken");
      try {
        console.log(type, "type");
        if (type === "delete") {
          if (currentUser) console.log("deletepost");
          return await makeRequest.delete("/posts?postId=" + post.id);
        } else {
          console.log("like ");
          if (currentUser)
            return await makeRequest.delete("/likes?postId=" + post.id, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            });
          return await makeRequest.post(
            "/likes",
            { postId: post?.id },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            }
          );
        }
      } catch (error) {
        throw new Error("Failed to create post");
      }
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(["likes", "posts"]);
    },
  });

  const handleLike = async (e, type) => {
    e.preventDefault();
    mutation.mutate({
      currentUser: data?.includes(JSON.parse(currentUser).id),
      type,
    });
  };

  return (
    <div className="post">
      <div className="container">
        <div className="user">
          <div className="userInfo">
            <img src={"../upload/" + post.profilePic} alt="" />
            <div className="details">
              <Link
                to={`/profile/${post.userId}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span className="name">{post.name}</span>
              </Link>
              <span className="date">{moment(post?.createAt).fromNow()}</span>
            </div>
          </div>
          {id == JSON.parse(currentUser)?.id && (
            <>
              <MoreHorizIcon
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                sx={{ cursor: "pointer" }}
              />

              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
              >
                <MenuItem onClick={(e) => handleLike(e, "delete")}>
                  Delete
                </MenuItem>
              </Menu>
            </>
          )}
        </div>
        <div className="content">
          <p>{post.desc}</p>
          <img src={"../upload/" + post.img} alt="" />
        </div>
        <div className="info">
          <div className="item">
            {data?.includes(JSON.parse(currentUser).id) ? (
              <FavoriteOutlinedIcon
                style={{ color: "red" }}
                onClick={(e) => handleLike(e, "like")}
              />
            ) : (
              <FavoriteBorderOutlinedIcon
                onClick={(e) => handleLike(e, "like")}
              />
            )}
            {isLoading ? "loading..." : data?.length} likes
          </div>
          <div className="item" onClick={() => setCommentOpen(!commentOpen)}>
            <TextsmsOutlinedIcon />
            {commentsData?.length} Comments
          </div>
          <div className="item">
            <ShareOutlinedIcon />
            Share
          </div>
        </div>
        {commentOpen && <Comments postId={post?.id} />}
      </div>
    </div>
  );
};

export default Post;
