import React, { useState, useEffect } from 'react'
import axios from 'axios'
import loading from '../images/loading.svg'
import Post from './Post'
import Comment from './Comment'

import '../style/Form.css'
// import useStyles from '../style/styles'


import { Tabs, Tab, Grid, TextField, Select, InputLabel, FormControl, MenuItem, Button, Collapse, Card, CardContent, Typography } from '@material-ui/core'

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
    const [showFilters, setShowFilters] = useState(false)

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
                author: author.trim(),
                title: title.trim(),
                q: searchTerm.trim(),
                subreddit: subreddit.trim(),
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
        const curState = showFilters
        setShowFilters(!curState)
    }

    // for material ui styles
    // const classes = useStyles()

    const formDimensions = {
        xs: 10,
        sm: 10,
        md: 6,
        lg: 6,
        xl: 6,
    };

    return (
        <div>
            <Grid container direction="column" alignItems="center" spacing={3}>

                <Grid item {...formDimensions}>

                    <form onSubmit={apiQuery} className="Form">
                        <div className="TabBar">

                            <Tabs value={searchOption} onChange={handleChange} TabIndicatorProps={{ style: { background: "#FF5700" } }} centered >
                                <Tab label="Posts" />
                                <Tab label="Comments" />
                            </Tabs>
                        </div>
                        <Card>
                            <CardContent>
                                <div className="Inputs">
                                    <Grid container spacing={3} justify="center">

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

                                        <Grid item container xs={12} justify="center">
                                            <div style={{ margin: 25 }}>
                                                <Button onClick={changeFilter}>{showFilters ? 'Hide Filters' : 'Show Filters'}</Button>
                                            </div>
                                        </Grid>

                                        <Collapse in={showFilters} >
                                            <Grid container justify="center" alignItems="center" spacing={5} >
                                                <Grid item container direction="column" sm={6} xs={12} spacing={3} alignItems="center">
                                                    <Grid item>
                                                        <FormControl style={{ minWidth: 200 }}>
                                                            <InputLabel>Sort Type</InputLabel>
                                                            <Select autoWidth label="Sort Type" name="sortType" onChange={handleChange} value={sortType}>
                                                                <MenuItem value="score">Score</MenuItem>
                                                                <MenuItem value="num_comments">Num. of Comments</MenuItem>
                                                                <MenuItem value="created_utc">Created Date</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>

                                                    <Grid item>
                                                        <FormControl style={{ minWidth: 200 }}>
                                                            <InputLabel>Sort Order</InputLabel>
                                                            <Select label="Sort Order" name="sort" onChange={handleChange} value={sort}>
                                                                <MenuItem value="desc">Descending</MenuItem>
                                                                <MenuItem value="asc">Ascending</MenuItem>
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                </Grid>
                                                <Grid item container direction="column" sm={6} xs={12} spacing={3} alignItems="center">
                                                    <Grid item>
                                                        {/* need InputLabelProps={{ shrink: true }}  to prevent overlap of label */}
                                                        <TextField label="After" variant="outlined" InputLabelProps={{ shrink: true }} type="date" name="after" onChange={handleChange} value={after} />
                                                    </Grid>

                                                    <Grid item>
                                                        <TextField label="Before" variant="outlined" InputLabelProps={{ shrink: true }} type="date" name="before" onChange={handleChange} value={before} />
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Collapse>

                                        <Grid item container>
                                            <button type="submit" fullWidth className="SearchButton">
                                                {isLoading ? 'Searching ...' : 'Search'}
                                            </button>
                                        </Grid>
                                        
                                        <Grid item container spacing={3} justify="center" alignItems="center">
                                            {contentList.length > 0 ? <Typography variant='h4'>Number of Results: {contentList.length}</Typography> : <div></div>}
                                        </Grid>
                                    </Grid>
                                </div>

                            </CardContent>
                        </Card>
                    </form>

                </Grid>

                <Grid item container spacing={3} justify="center" alignItems="center">
                    {isLoading ? <img src={loading} alt="loading"></img> : contentList}
                </Grid>
            </Grid>

        </div>
    )
}

export default Form