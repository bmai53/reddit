import React from 'react'
import '../style/Comment.css'

import { Grid, Card, CardContent } from '@material-ui/core'

const Comment = (props) => {
    const data = props.data

    const postInfo = props.postInfoArray.find(element => element.postId === data.link_id)
    const postLink = postInfo.postLink

    let commentDate = new Date(data.created_utc * 1000)
    commentDate = commentDate.getFullYear().toString() + '/' + (commentDate.getMonth() + 1).toString() + '/' + commentDate.getDate().toString()

    let title = postInfo.postTitle.replace(/&amp;/g, '&')
    if (title.length > 50) {
        title = title.substring(0, 47).concat('...')
    }

    const commentDimensions = {
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
                    <div className="Comment">
                        {/* <p className="Title">{title}</p> */}
                        <div className="TopLine">
                            <p>
                                <span className="Author">
                                    by <a href={`https://www.reddit.com/u/${data.author}`} target="_blank" rel="noopener noreferrer" >{data.author}</a>
                                </span>
                                <span> </span>
                                <span className="Subreddit">
                                    at <a href={`https://www.reddit.com/r/${data.subreddit}`} target="_blank" rel="noopener noreferrer" >r/{data.subreddit}</a>
                                </span>

                                <span className="CommentScore">Score: {data.score}</span>
                            </p>
                        </div>
                        <div className="Body">
                            <p>{data.body}</p>
                        </div>
                        <p className="BottomLine">
                            <span className="Date">Posted on {commentDate.toString()}</span>
                            <span className="SpanLink">
                                <button href={postLink + data.id} target="_blank" rel="noopener noreferrer" className="Link">
                                    link
                                </button>
                            </span>
                        </p>

                    </div>
                </CardContent>
            </Card>
        </Grid>
    )
}

export default Comment