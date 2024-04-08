import { makeRequest } from "../../axios";
import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";

const Posts = () => {
  const { isLoading, error, data } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const token = localStorage.getItem("idToken");

      try {
        const response = await makeRequest.get("/posts", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        return response.data;
      } catch (error) {
        throw new Error("Failed to fetch posts");
      }
    },
  });

  console.log(data, "data");

  return (
    <div className="posts">
      {error
        ? "Some think went wrong"
        : isLoading
        ? "Loading..."
        : data.map((post) => <Post post={post} key={post.id} />)}
    </div>
  );
};

export default Posts;
