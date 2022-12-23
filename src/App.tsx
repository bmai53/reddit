import React, { useState, useEffect } from "react";
import "./style/App.css";
import axios from "axios";
import { apiQuery } from "./apiQuery";
import GithubCorner from "react-github-corner";
import Form from "./Components/Form";
import Post from "./Components/Post";
import Comment, { IPostInfo } from "./Components/Comment";
import Content from "./Components/Content";

function App() {
  const [searchSubmissions, setSearchSubmissions] = useState(true);
  const [searchOption, setSearchOption] = useState(0);

  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [subreddit, setSubreddit] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [size, setSize] = useState(50);

  // filters
  const [after, setAfter] = useState("");
  const [before, setBefore] = useState("");
  const [sort, setSort] = useState("desc");
  const [sortType, setSortType] = useState("score");

  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setAPIResponse] = useState<Array<any>>([]);

  const [contentList, setContentList] = useState<Array<any>>([]);

  const handleChange: any = (event: any, newValue: any) => {
    const { name, value } = event.target;

    // material ui tabs
    if (!name) {
      if (newValue === 1) {
        setSearchSubmissions(false);
      } else {
        setSearchSubmissions(true);
      }
      setSearchOption(newValue);
    }

    if (name === "author") {
      setAuthor(value);
    }
    if (name === "title") {
      setTitle(value);
    }
    if (name === "subreddit") {
      setSubreddit(value);
    }
    if (name === "searchTerm") {
      setSearchTerm(value);
    }
    if (name === "size") {
      setSize(value);
    }
    if (name === "after") {
      setAfter(value);
    }
    if (name === "before") {
      setBefore(value);
    }
    if (name === "sortType") {
      setSortType(value);
    }
    if (name === "sort") {
      setSort(value);
    }
  };

  const handleSubmit = (event: any) => {
    setIsLoading(true);
    event.preventDefault();

    apiQuery({
      searchSubmission: searchSubmissions,
      author,
      title,
      searchTerm,
      subreddit,
      size,
      after,
      before,
      sort,
      sortType,
    })
      .then((response) => {
        // console.log(response);
        setAPIResponse(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // set component array
  // known warning to include searchSubmissions inside dependency array,
  // but the whole point of using useEffect was so that the contentList would no rerender after selecting another searchType
  useEffect(() => {
    if (searchSubmissions) {
      const newSubmissions = apiResponse.map((data: any) => (
        <Post key={data.id} data={data} />
      ));
      setContentList(newSubmissions);
      setIsLoading(false);
    } else {
      // commentPost is the post that the comment is from
      const commentPostLinkList = apiResponse.map((data: any) => data.link_id);
      const commentPostLinkString = commentPostLinkList.join(",");
      // console.log("commentLinkString", commentPostLinkString)
      axios
        .get(
          `https://api.pushshift.io/reddit/search/submission/?ids=${commentPostLinkString}`
        )
        .then((response) => {
          // apiResponse contains comment data
          // posts contains parent post data
          const posts = response.data.data;

          const postInfoArray: IPostInfo[] = apiResponse.map((data: any) => {
            const foundPost = posts.find(
              (element: any) => "t3_" + element.id === data.link_id
            );

            if (foundPost === undefined) {
              return {
                postId: "",
                postLink: "",
                postTitle: "",
              };
            }

            return {
              postId: data.link_id,
              postLink: foundPost.full_link,
              postTitle: foundPost.title,
            };
          });
          // console.log(postInfoArray);

          // use pairPostIdPostLinkArray to find correct post data to pass into each Comment component
          const newComments = apiResponse.map((data: any) => (
            <Comment
              key={data.id}
              data={data}
              postInfo={postInfoArray.find(
                (element: { postId: any }) => element.postId === data.link_id
              )}
            />
          ));
          setContentList(newComments);
          setIsLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    // scroll on mobile to content when done loading
    window.scrollTo(0, document.body.scrollHeight);

    // do not add searchSubmissions to this
  }, [apiResponse]); // set component array

  return (
    <div className='App'>
      <GithubCorner href='https://github.com/bmai53/reddit' direction='left' />

      <Form
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        searchOption={searchOption}
        author={author}
        title={title}
        subreddit={subreddit}
        searchTerm={searchTerm}
        size={size}
        after={after}
        before={before}
        sort={sort}
        sortType={sortType}
        isLoading={isLoading}
      />
      <Content
        isLoading={isLoading}
        contentList={contentList}
        setAfter={setAfter}
        setBefore={setBefore}
        sort={sort}
        sortType={sortType}
        handleSubmit={handleSubmit}
        apiResponse={apiResponse}
      />
    </div>
  );
}

export default App;
