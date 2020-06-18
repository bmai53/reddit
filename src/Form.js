import React, { useState } from 'react'
import axios from 'axios'
import loading from './loading.svg'
import Post from './Post'
import Comment from './Comment'

const Form = () => {

    const [searchSubmissions, setSearchSubmissions] = useState(true)
    const [searchComments, setSearchComments] = useState(false)

    const [author, setAuthor] = useState("")
    const [title, setTitle] = useState("")
    const [subreddit, setSubreddit] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [size, setSize] = useState(50)
    const [after, setAfter] = useState()
    const [before, setBefore] = useState()

    const [sortAsc, setSortAsc] = useState(false)
    const [sortDesc, setSortDesc] = useState(true)
    const [sortScore, setSortScore] = useState(true)
    const [sortCreated, setSortCreated] = useState(false)
    const [sortNumComments, setSortNumComments] = useState(false)

    const [isLoading, setIsLoading] = useState(false)
    const [apiResponse, setAPIResponse] = useState([])

    const handleChange = (event) => {
        const { name, value } = event.target

        if (name === "author") { setAuthor(value) }
        if (name === "title") { setTitle(value) }
        if (name === "subreddit") { setSubreddit(value) }
        if (name === "searchTerm") { setSearchTerm(value) }
        if (name === "size") { setSize(value) }
        if (name === "after") { setAfter(value) }
        if (name === "before") { setBefore(value) }
        if (name === "sort") {
            if (value === "desc") {
                setSortDesc(true)
                setSortAsc(false)
            } else {
                setSortDesc(false)
                setSortAsc(true)
            }
        }

        if (name === "searchType") {
            if (value === "submissions") {
                setSearchSubmissions(true)
                setSearchComments(false)
            } else {
                setSearchSubmissions(false)
                setSearchComments(true)
            }
        }

        if (name === "sortType") {
            if (value === "score") {
                setSortScore(true)
                setSortCreated(false)
                setSortNumComments(false)
            }
            else if (value === "createdDate") {
                setSortScore(false)
                setSortCreated(true)
                setSortNumComments(false)
            } else {
                setSortScore(false)
                setSortCreated(false)
                setSortNumComments(true)
            }
        }

    }

    const apiQuery = (event) => {
        setIsLoading(true)
        event.preventDefault()

        const apiEndPoint = searchSubmissions ?
            "https://api.pushshift.io/reddit/search/submission" :
            "https://api.pushshift.io/reddit/search/comment"

        const sortAscOrDesc = sortDesc ? "desc" : "asc"
        const sortType = sortScore ?
            "score" :
            sortNumComments ? "num_comments" : "created_utc"

        axios.get(apiEndPoint, {
            params: {
                author: author,
                title: title,
                q: searchTerm,
                subreddit: subreddit,
                size: size,
                after: after,
                before: before,
                sort: sortAscOrDesc,
                sort_type: sortType
            }
        })
            .then((response) => {
                setAPIResponse(response.data.data)
                console.log(response.data.data)
                setIsLoading(false)
            })
            .catch((error) => {
                console.log(error)
            })

    }

    const apiResponseArray =    searchSubmissions ?
                                apiResponse.map(data => <Post key={data.id} data={data} />) :
                                apiResponse.map(data => <Comment key={data.id} data={data} />)

    return (
        <form onSubmit={apiQuery}>
            <label>Search Type </label>
            <label>
                <input type="radio" name="searchType" onChange={handleChange} value="submissions" checked={searchSubmissions} />
                Posts
            </label>
            <label>
                <input type="radio" name="searchType" onChange={handleChange} value="comments" checked={searchComments} />
                Comments
            </label>
            <br />
            <label>Author </label>
            <input type="text" name="author" onChange={handleChange} value={author} />
            <br />
            <label>Subreddit </label>
            <input type="text" name="subreddit" onChange={handleChange} value={subreddit} />
            <br />
            <label>Search Term </label>
            <input type="text" name="searchTerm" onChange={handleChange} value={searchTerm} />
            <br />
            <label>Title </label>
            <input type="text" name="title" onChange={handleChange} value={title} />
            <br />
            <label>Return Size </label>
            <input type="number" name="size" onChange={handleChange} value={size} />
            <br />
            <label>After </label>
            <input type="date" name="after" onChange={handleChange} value={after} />
            <br />
            <label>Before </label>
            <input type="date" name="before" onChange={handleChange} value={before} />
            <br />
            <label>Sort </label>
            <label>
                <input type="radio" name="sort" onChange={handleChange} value="desc" checked={sortDesc} />
                Descending
            </label>
            <label>
                <input type="radio" name="sort" onChange={handleChange} value="asc" checked={sortAsc} />
                Ascending
            </label>
            <br />
            <label>Sort Type </label>
            <label>
                <input type="radio" name="sortType" onChange={handleChange} value="score" checked={sortScore} />
                Score
            </label>
            <label>
                <input type="radio" name="sortType" onChange={handleChange} value="createdDate" checked={sortCreated} />
                Created Date
            </label>
            <label>
                <input type="radio" name="sortType" onChange={handleChange} value="numComments" checked={sortNumComments} />
                Number of Comments
            </label>


            <button>Search</button>
            <br />
            <div>
                {isLoading ? <img src={loading} alt="loading"></img> : apiResponseArray}
            </div>
        </form>
    )
}

export default Form