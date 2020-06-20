import React from 'react'
import './style/Comment.css'

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

    // let body = data.body
    // if (body.length > 200) {
    //     body = body.substring(0, 197).concat('...')
    // }

    return (
        <div className="Comment">
            {/* <p className="Title">{title}</p> */}
            <div className="AuthorAndSubreddit">
                <p>
                    <span className="Author">
                        by <a href={`https://www.reddit.com/u/${data.author}`} target="_blank" rel="noopener noreferrer" >{data.author}</a>
                    </span>
                    <span> </span>

                    <span className="Subreddit">
                        at <a href={`https://www.reddit.com/r/${data.subreddit}`} target="_blank" rel="noopener noreferrer" >r/{data.subreddit}</a>
                    </span>
                </p>
            </div>
            <div className="Body">
                <p>{data.body}</p>
            </div>
            <p className="BottomLine">
                <span className="Date">Posted on {commentDate.toString()}</span>
                <span className="SpanLink">
                    <a href={postLink + data.id} target="_blank" rel="noopener noreferrer" className="Link">
                        link
                    </a>
                </span>
            </p>



        </div>
    )
}

export default Comment