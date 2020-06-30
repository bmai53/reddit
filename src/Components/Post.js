import React from 'react'
import moment from 'moment'
import '../style/Post.css'
import no_preview from '../images/no_preview.png'

import { Grid, Card, CardContent } from '@material-ui/core'

const Post = (props) => {

    const data = props.data
    let previewImg = data.preview
    let title = data.title.replace(/&amp;/g, '&')

    if (previewImg) {
        previewImg = previewImg.images[0].source.url.replace(/&amp;/g, '&')
    }

    let postDate = new Date(data.created_utc * 1000)
    postDate = moment(postDate).format('LL')
    const postDimensions = {
        xs: 11,
        sm: 11,
        md: 7,
        lg: 7,
        xl: 7,
    };

    return (
        <Grid item {...postDimensions}>
            <Card>
                <CardContent>
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
                        <p className="Identifiers">
                            <span className="Author">
                                by <a href={`https://www.reddit.com/u/${data.author}`} target="_blank" rel="noopener noreferrer">{data.author}</a>
                            </span>
                            <span> </span>
                            <span className="Subreddit">
                                at <a href={`https://www.reddit.com/r/${data.subreddit}`} target="_blank" rel="noopener noreferrer">r/{data.subreddit}</a>
                            </span>
                            <span> </span>
                            <span className="Date">
                                on {postDate}
                            </span>
                        </p>

                        <p className="NumComments Stats">
                            Comments: {data.num_comments}
                        </p>
                        <p className="Score Stats">
                            Score: {data.score}
                        </p>
                        
                        <a className="Link" href={data.full_link} target="_blank" rel="noopener noreferrer" >
                            link
                        </a>
                    </div>
                </CardContent>
            </Card>
        </Grid>
    )
}

export default Post