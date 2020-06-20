import React, { useState, useEffect } from 'react'
import axios from 'axios'
import loading from './images/loading.svg'
import Post from './Post'
import Comment from './Comment'

import './style/Form.css'

import repoLink from './images/github-corner.png'

import { Tabs, Tab, Grid, TextField, Select, InputLabel, FormControl, MenuItem } from '@material-ui/core'

const Form = () => {

    const [searchSubmissions, setSearchSubmissions] = useState(true)
    const [searchOption, setSearchOption] = useState(0)

    const [author, setAuthor] = useState("")
    const [title, setTitle] = useState("")
    const [subreddit, setSubreddit] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [size, setSize] = useState(50)
    const [after, setAfter] = useState("")
    const [before, setBefore] = useState("")

    const [sort, setSort] = useState("desc")
    const [sortType, setSortType] = useState("score")

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
                console.log(response.data.data)
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
            console.log("commentLinkString", commentPostLinkString)
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
                    console.log(postInfoArray)

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
    }, [apiResponse])

    // for material ui tabs
    const styles = {
        tabIndicator: {
            style: {
                background: "#FF5700",
            }
        }
    };

    return (
        <div>
            <a href="https://github.com/bmai53/reddit-search">
                <img className="repoLink" alt="github logo" src={repoLink} />
            </a>
            <form onSubmit={apiQuery} className="Form">
                <div className="TabBar">
                    <Tabs value={searchOption} onChange={handleChange} TabIndicatorProps={styles.tabIndicator} centered >
                        <Tab label="Posts" />
                        <Tab label="Comments" />
                    </Tabs>
                </div>

                <div className="Inputs">
                    <Grid container spacing={1} justify="center">

                        <Grid item xs={4}>
                            <TextField label="Author" className="InputAuthor" type="text" name="author" onChange={handleChange} value={author} />
                        </Grid>

                        <Grid item xs={4}>
                            <TextField label="Subreddit" className="InputSubreddit" type="text" name="subreddit" onChange={handleChange} value={subreddit} />
                        </Grid>

                        <Grid item xs={4}>
                            <TextField label="Title" className="InputTitle" type="text" name="title" onChange={handleChange} value={title} />
                        </Grid>

                        <Grid item xs={8}>
                            <TextField label="Search Term" style={{ width: 450 }} className="InputSearchTerm" type="text" name="searchTerm" onChange={handleChange} value={searchTerm} />
                        </Grid>

                        <Grid item xs={4}>
                            <TextField label="Return Size" className="InputReturnSize" type="number" name="size" onChange={handleChange} value={size} />
                        </Grid>
                       
                        <Grid item xs={12} spacing={3} container direction="row" justify="space-evenly" alignItems="center">
                            
                            <Grid item>
                                <FormControl style={{ minWidth: 200 }}>
                                    <InputLabel>
                                        Sort Type
                                </InputLabel>
                                    <Select autoWidth label="Sort Type" name="sortType" onChange={handleChange} value={sortType}>
                                        <MenuItem value="score">Score</MenuItem>
                                        <MenuItem value="num_comments">Num. of Comments</MenuItem>
                                        <MenuItem value="created_utc">Created Date</MenuItem>
                                    </Select>
                                </FormControl>

                            </Grid>

                            <Grid item>
                                <FormControl style={{ minWidth: 200 }}>
                                    <InputLabel>
                                        Sort Order
                                </InputLabel>
                                    <Select label="Sort Order" name="sort" onChange={handleChange} value={sort}>
                                        <MenuItem value="desc">Descending</MenuItem>
                                        <MenuItem value="asc">Ascending</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            
                            <Grid item xs={6}>
                                <label>After </label>
                                <input label="After" type="date" name="after" onChange={handleChange} value={after} />
                            </Grid>

                            <Grid item xs={6}>
                                <label>Before </label>
                                <input label="Before" type="date" name="before" onChange={handleChange} value={before} />
                            </Grid>


                        </Grid>

                    </Grid>
                </div>

                <Grid container justify="center">
                    <button className="SearchButton">Search</button>
                </Grid>

            </form>
            <div>
                {isLoading ? <img src={loading} alt="loading"></img> : contentList}
            </div>
        </div>
    )
}

export default Form