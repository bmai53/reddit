import React from 'react'
import '../style/Post.css'
import no_preview from '../images/no_preview.png'

import { Grid } from '@material-ui/core'

const Post = (props) => {

    const data = props.data
    let previewImg = data.preview
    let title = data.title.replace(/&amp;/g, '&')

    if (previewImg) {
        previewImg = previewImg.images[0].source.url.replace(/&amp;/g, '&')
    }

    let postDate = new Date(data.created_utc * 1000)
    postDate = postDate.getFullYear().toString() + '/' + (postDate.getMonth() + 1).toString() + '/' + postDate.getDate().toString()

    const postDimensions = {
        xs: 11,
        sm: 11,
        md: 8,
        lg: 8,
        xl: 8,
    };

    return (
        <Grid item {... postDimensions}>
            <div className="Post">
                <div className="PreviewImage">
                    {
                        previewImg ?
                            <img src={previewImg} alt="preview" width="150" height="150" /> :
                            <img src={no_preview} alt="preview" width="150" height="150" />
                    }
                </div>
                <div className="PostTitle">
                    <a href={data.url} target="_blank" rel="noopener noreferrer">{title}</a>
                </div>
                {/* <p className="Author">{data.author}</p>
            <p className="Subreddit">r/{data.subreddit}</p> */}
                <p className="Identifiers">
                    <span className="Author">
                        by <a href={`https://www.reddit.com/u/${data.author}`} target="_blank" rel="noopener noreferrer">{data.author}</a>
                    </span>
                    <span> </span>
                    <span className="Subreddit">
                        to <a href={`https://www.reddit.com/r/${data.subreddit}`} target="_blank" rel="noopener noreferrer">r/{data.subreddit}</a>
                    </span>
                    <span> </span>
                    <span className="Date">
                        on {postDate.toString()}
                    </span>
                </p>

                <p className="Stats">
                    <span>Comments: {data.num_comments} </span>
                    <span>Score: {data.score}</span>
                </p>
                <a className="Link" href={data.full_link} target="_blank" rel="noopener noreferrer" >
                    link
            </a>
            </div>
        </Grid>
    )
}

export default Post