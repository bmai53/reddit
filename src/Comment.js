import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './Comment.css'



const Comment = (props) => {

    const [commentLink, setCommentLink] = useState("")

    const data = props.data

    let commentDate = new Date(data.author_created_utc * 1000)
    commentDate = commentDate.getFullYear().toString() + '/' + commentDate.getMonth().toString() + '/' + commentDate.getDate().toString()

    useEffect(() => {
        axios.get(`https://api.pushshift.io/reddit/search/submission/?ids=${data.link_id}`)
            .then((response) => {
                setCommentLink(response.data.data[0].full_link + data.id)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [data.link_id, data.id])

    return (
        <div className="Comment">
            <p>
                <span className="Author">
                    by <a href={`https://www.reddit.com/u/${data.author}`}>{data.author}</a>
                </span>
                <span> </span>
                <span className="Subreddit">
                    to <a href={`https://www.reddit.com/r/${data.subreddit}`}>r/{data.subreddit}</a>
                </span>
            </p>
            <p>{data.body}</p>
            <p className="Date">Posted on {commentDate.toString()}</p>
            <a href={commentLink}>link</a>
        </div>
    )
}

export default Comment