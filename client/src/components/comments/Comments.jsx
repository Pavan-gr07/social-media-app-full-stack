import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Comments = ({ postId }) => {
  const { currentUser } = useContext(AuthContext);

  const [desc, setDesc] = useState("");
  console.log(desc, "'desc");

  const queryClient = useQueryClient();

  const { isLoading, error, data } = useQuery({
    queryKey: ["comments"],
    queryFn: async () => {
      try {
        const response = await makeRequest.get("/comments?postId=" + postId);
        return response.data;
      } catch (error) {
        throw new Error("Failed to fetch comments");
      }
    },
  });

  const mutation = useMutation({
    mutationKey: ["comments"],
    mutationFn: async (newPost) => {
      const token = localStorage.getItem("idToken");
      try {
        const response = await makeRequest.post("/comments", newPost, {
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
      queryClient.invalidateQueries("comments");
    },
  });

  const handleClick = (e) => {
    e.preventDefault();

    mutation.mutate({
      desc,
      postId,
    });
    setDesc("");
  };

  return (
    <div className="comments">
      <div className="write">
        <img src={currentUser.profilePic} alt="" />
        <input
          type="text"
          placeholder="write a comment"
          onChange={(e) => setDesc(e.target.value)}
          value={desc}
        />
        <button onClick={handleClick}>Send</button>
      </div>
      {error
        ? "Some think went wrong"
        : isLoading
        ? "Loading..."
        : data.map((comment) => (
            <div className="comment">
              <img src={comment.profilePicture} alt="" />
              <div className="info">
                <span>{comment.name}</span>
                <p>{comment.desc}</p>
              </div>
              <span className="date">
                {moment(comment?.createdAt).fromNow()}
              </span>
            </div>
          ))}
    </div>
  );
};

export default Comments;
