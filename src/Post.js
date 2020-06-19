import React from 'react'
import './style/Post.css'
import no_preview from './images/no_preview.png'

const Post = (props) => {

    const data = props.data
    let previewImg = data.preview
    let title = data.title.replace(/&amp;/g, '&')

    if (previewImg) {
        previewImg = previewImg.images[0].source.url.replace(/&amp;/g, '&')
    }

    if (title.length > 50) {
        title = title.substring(0, 47)
        title = title.concat("...")
    }

    let postDate = new Date(data.created_utc * 1000)
    postDate = postDate.getFullYear().toString() + '/' + postDate.getMonth().toString() + '/' + postDate.getDate().toString()

    return (
        <div className="Post">
            <div className="PreviewImage">
                {
                    previewImg ?
                        <img src={previewImg} alt="preview" width="150" height="150" /> :
                        <img src={no_preview} alt="preview" width="150" height="150" />
                }
            </div>
            <a href={data.url}>{title}</a>
            {/* <p className="Author">{data.author}</p>
            <p className="Subreddit">r/{data.subreddit}</p> */}
            <p>
                <span className="Author">
                    by <a href={`https://www.reddit.com/u/${data.author}`}>{data.author}</a>
                </span>
                <span> </span>
                <span className="Subreddit">
                    to <a href={`https://www.reddit.com/r/${data.subreddit}`}>r/{data.subreddit}</a>
                </span>
            </p>
            <p className="Date">Posted on {postDate.toString()}</p>
            <p className="Stats">
                <span>Comments: {data.num_comments} </span>
                <span>Score: {data.score}</span>
            </p>
            <a href={data.full_link}>link</a>
        </div>
    )
}

export default Post