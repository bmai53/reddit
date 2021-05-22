import React from "react";
import moment from "moment";
import "../style/Comment.css";

import { Grid, Card, CardContent, GridSize } from "@material-ui/core";
import { Breakpoint } from "@material-ui/core/styles/createBreakpoints";

const Comment = (props: any) => {
  const data = props.data;
  const postInfo = props.postInfo;
  const postLink = postInfo.postLink;

  let commentDate: string = new Date(data.created_utc * 1000).toString();
  commentDate = moment(commentDate).format("LL");

  let title = postInfo.postTitle.replace(/&amp;/g, "&");
  if (title.length > 50) {
    title = title.substring(0, 47).concat("...");
  }

  const commentDimensions: Record<Breakpoint, GridSize> = {
    xs: 11,
    sm: 11,
    md: 7,
    lg: 7,
    xl: 7,
  };

  return (
    <Grid item {...commentDimensions}>
      <Card>
        <CardContent>
          <div className='Comment'>
            {/* <p className="Title">{title}</p> */}
            <div className='TopLine'>
              <p>
                <span className='Author'>
                  by{" "}
                  <a
                    href={`https://www.reddit.com/u/${data.author}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {data.author}
                  </a>
                </span>
                <span> </span>
                <span className='Subreddit'>
                  at{" "}
                  <a
                    href={`https://www.reddit.com/r/${data.subreddit}`}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    r/{data.subreddit}
                  </a>
                </span>

                <span className='CommentScore'>Score: {data.score}</span>
              </p>
            </div>
            <div className='Body'>
              <p>{data.body}</p>
            </div>
            <p className='BottomLine'>
              <span className='Date'>Posted on {commentDate}</span>
              <span className='SpanLink'>
                <a
                  href={postLink + data.id}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='Link'
                >
                  link
                </a>
              </span>
            </p>
          </div>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default Comment;
