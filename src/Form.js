import React, { useState, useEffect } from 'react'
import axios from 'axios'
import loading from './images/loading.svg'
import Post from './Post'
import Comment from './Comment'

import './style/Form.css'
import useStyles from './style/styles'

import repoLink from './images/github-corner.png'

import { Tabs, Tab, Grid, TextField, Select, InputLabel, FormControl, MenuItem, Button, Collapse } from '@material-ui/core'

const Form = () => {

    const [searchSubmissions, setSearchSubmissions] = useState(true)
    const [searchOption, setSearchOption] = useState(0)

    const [author, setAuthor] = useState("")
    const [title, setTitle] = useState("")
    const [subreddit, setSubreddit] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [size, setSize] = useState(50)

    // filters
    const [after, setAfter] = useState("")
    const [before, setBefore] = useState("")
    const [sort, setSort] = useState("desc")
    const [sortType, setSortType] = useState("score")
    const [hideFilters, setHideFilters] = useState(true)

    const [isLoading, setIsLoading] = useState(false)
    const [apiResponse, setAPIResponse] = useState([])

    const [contentList, setContentList] = useState([])

    const handleChange = (event, newValue) => {
        const { name, value } = event.target

        // material ui tabs
        if (!name) {
            if (newValue === 1) { setSearchSubmissions(false) }
            else { setSearchSubmissions(true) }
            setSearchOption(newValue)
        }

        if (name === "author") { setAuthor(value) }
        if (name === "title") { setTitle(value) }
        if (name === "subreddit") { setSubreddit(value) }
        if (name === "searchTerm") { setSearchTerm(value) }
        if (name === "size") { setSize(value) }
        if (name === "after") { setAfter(value) }
        if (name === "before") { setBefore(value) }
        if (name === "sortType") { setSortType(value) }
        if (name === "sort") { setSort(value) }
    }

    const apiQuery = (event) => {
        setIsLoading(true)
        event.preventDefault()

        const apiEndPoint = searchSubmissions ?
            "https://api.pushshift.io/reddit/search/submission" :
            "https://api.pushshift.io/reddit/search/comment"

        axios.get(apiEndPoint, {
            params: {
                author: author,
                title: title,
                q: searchTerm,
                subreddit: subreddit,
                size: size,
                after: after,
                before: before,
                sort: sort,
                sort_type: sortType
            }
        })
            .then((response) => {
                setAPIResponse(response.data.data)
                // console.log(response.data.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    // set component array
    // known warning to include searchSubmissions inside dependency array, 
    // but the whole point of using useEffect was so that the contentList would no rerender after selecting another searchType
    useEffect(() => {
        if (searchSubmissions) {
            const newSubmissions = apiResponse.map(data => <Post key={data.id} data={data} />)
            setContentList(newSubmissions)
            setIsLoading(false)
        }
        else {
            // commentPost is the post that the comment is from
            const commentPostLinkList = apiResponse.map(data => data.link_id)
            const commentPostLinkString = commentPostLinkList.join(',')
            // console.log("commentLinkString", commentPostLinkString)
            axios.get(`https://api.pushshift.io/reddit/search/submission/?ids=${commentPostLinkString}`)
                .then((response) => {
                    // apiResponse contains comment data
                    // posts contains parent post data
                    const posts = response.data.data
                    const postInfoArray = apiResponse.map((data) => {
                        const postInfo = posts.find(element => ("t3_" + element.id) === data.link_id)
                        return (
                            {
                                postId: data.link_id,
                                postLink: postInfo.full_link,
                                postTitle: postInfo.title
                            }
                        )
                    })
                    // console.log(postInfoArray)

                    // use pairPostIdPostLinkArray to find correct post data to pass into each Comment component
                    const newComments = apiResponse.map(
                        data => <Comment
                            key={data.id}
                            data={data}
                            postInfoArray={postInfoArray}
                        />
                    )
                    setContentList(newComments)
                    setIsLoading(false)
                })
                .catch((error) => {
                    console.log(error)
                })

        }

        // scroll on mobile to content when done loading
        window.scrollTo(0, document.body.scrollHeight);

    }, [apiResponse]) // set component array

    // show or hide filters
    const changeFilter = () => {
        const curState = hideFilters
        setHideFilters(!curState)
    }

    // for material ui styles
    const classes = useStyles()

    const formDimensions = {
        xs: 10,
        sm: 10,
        md: 6,
        lg: 6,
        xl: 6,
    };

    return (
        <div>
            <a href="https://github.com/bmai53/reddit-search">
                <img className="repoLink" alt="github logo" src={repoLink} />
            </a>

            <Grid container direction="column" alignItems="center" spacing={1}>
                <Grid item {...formDimensions}>
                    <form onSubmit={apiQuery} className="Form">
                        <Tabs value={searchOption} onChange={handleChange} className={classes.tabBar} TabIndicatorProps={{ style: { background: "#FF5700" } }} centered >
                            <Tab label="Posts" />
                            <Tab label="Comments" />
                        </Tabs>

                        <div className="Inputs">
                            <Grid container spacing={1} justify="center">

                                <Grid item sm={4} xs={12}>
                                    <TextField label="Author" fullWidth className="InputAuthor" type="text" name="author" onChange={handleChange} value={author} />
                                </Grid>

                                <Grid item sm={4} xs={12}>
                                    <TextField label="Subreddit" fullWidth className="InputSubreddit" type="text" name="subreddit" onChange={handleChange} value={subreddit} />
                                </Grid>

                                <Grid item sm={4} xs={12}>
                                    <TextField label="Title" fullWidth className="InputTitle" type="text" name="title" onChange={handleChange} value={title} />
                                </Grid>

                                <Grid item sm={8} xs={12}>
                                    <TextField label="Search Term" fullWidth className="InputSearchTerm" type="text" name="searchTerm" onChange={handleChange} value={searchTerm} />
                                </Grid>

                                <Grid item sm={4} xs={12}>
                                    <TextField label="Return Size" fullWidth className="InputReturnSize" type="number" name="size" onChange={handleChange} value={size} />
                                </Grid>

                                <Grid item xs={12}>
                                    <Button onClick={changeFilter}>{hideFilters ? 'Show Filters' : 'Hide Filters'}</Button>
                                </Grid>
                                
                      
                                    {
                                        hideFilters ?
                                            <br/>
                                            :
                                            (
                                                <div>
                                                <Grid item container spacing={5} direction="row" style={{ textAlign: "center" }}>
                                                    <Grid item sm={6} xs={12}>
                                                        <FormControl style={{ minWidth: 200 }}>
                                                            <InputLabel>Sort Type</InputLabel>
                                                            <Select autoWidth label="Sort Type" name="sortType" onChange={handleChange} value={sortType}>
                                                                <MenuItem value="score">Score</MenuItem>
                                                                <MenuItem value="num_comments">Num. of Comments</MenuItem>
                                                                <MenuItem value="created_utc">Created Date</MenuItem>
                                                            </Select>
                                                        </FormControl>

                                                    </Grid>

                                                    <Grid item sm={6} xs={12}>
                                                        <FormControl style={{ minWidth: 200 }}>
                                                            <InputLabel>Sort Order</InputLabel>
                                                            <Select label="Sort Order" name="sort" onChange={handleChange} value={sort}>
                                                                <MenuItem value="desc">Descending</MenuItem>
                                                                <MenuItem value="asc">Ascending</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>

                                                    <Grid item sm={6} xs={12}>
                                                        {/* need InputLabelProps={{ shrink: true }}  to prevent overlap of label */}
                                                        <TextField label="After" variant="outlined" InputLabelProps={{ shrink: true }} type="date" name="after" onChange={handleChange} value={after} />
                                                    </Grid>

                                                    <Grid item sm={6} xs={12}>
                                                        <TextField label="Before" variant="outlined" InputLabelProps={{ shrink: true }} type="date" name="before" onChange={handleChange} value={before} />
                                                    </Grid>
                                                </Grid>
                                                </div>
                                            )
                                    }

                               
                                <Grid item container>
                                    {
                                        isLoading ?
                                            <Button variant="contained" type="submit" fullWidth className={classes.searchButton}>Searching ...</Button> :
                                            <Button variant="contained" type="submit" fullWidth className={classes.searchButton}>Search</Button>
                                    }
                                </Grid>

                            </Grid>
                        </div>

                    </form>

                </Grid>

                <Grid item container spacing={1} justify="center" alignItems="center">
                    {isLoading ? <img src={loading} alt="loading"></img> : contentList}
                </Grid>
            </Grid>

        </div>
    )
}

export default Form