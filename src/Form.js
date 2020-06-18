import React, { useState, useEffect } from 'react'
import axios from 'axios'
import loading from './loading.svg'
import Post from './Post'
import Comment from './Comment'

const Form = () => {

    const [searchSubmissions, setSearchSubmissions] = useState(true)

    const [author, setAuthor] = useState("")
    const [title, setTitle] = useState("")
    const [subreddit, setSubreddit] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [size, setSize] = useState(50)
    const [after, setAfter] = useState()
    const [before, setBefore] = useState()

    const [sortAsc, setSortAsc] = useState(false)
    const [sortDesc, setSortDesc] = useState(true)
    const [sortType, setSortType] = useState("score")

    const [isLoading, setIsLoading] = useState(false)
    const [apiResponse, setAPIResponse] = useState([])

    const [contentList, setContentList] = useState([])
    const [commentLinkList, setCommentLinkList] = useState([])

    const handleChange = (event) => {
        const { name, value } = event.target

        if (name === "author") { setAuthor(value) }
        if (name === "title") { setTitle(value) }
        if (name === "subreddit") { setSubreddit(value) }
        if (name === "searchTerm") { setSearchTerm(value) }
        if (name === "size") { setSize(value) }
        if (name === "after") { setAfter(value) }
        if (name === "before") { setBefore(value) }
        if (name === "sortType") { setSortType(value) }
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
            } else {
                setSearchSubmissions(false)
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
            })
            .catch((error) => {
                console.log(error)
            })

        // getting comment links
        if (!searchSubmissions) {
            const linkIdList = apiResponse.map(data => data.link_id)
            const linkIdString = linkIdList.join(',')
            axios.get(`https://api.pushshift.io/reddit/search/submission/?ids=${linkIdString}&size=${size}`)
                .then((response) => {
                    const newCommentLinkList = response.data.data.map(data => data.full_link)
                    setCommentLinkList(newCommentLinkList)
                })
                .catch((error) => {
                    console.log(error)
                })
        }
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
    }, [apiResponse])

    useEffect(() => {
        if (!searchSubmissions) {
            const newComments = apiResponse.map((data, index) => <Comment key={data.id} data={data} commentLink={commentLinkList[index]} />)
            setContentList(newComments)
            setIsLoading(false)
        }
    }, [commentLinkList])


    return (
        <form onSubmit={apiQuery}>
            <label>Search Type </label>
            <label>
                <input type="radio" name="searchType" onChange={handleChange} value="submissions" checked={searchSubmissions} />
                Posts
            </label>
            <label>
                <input type="radio" name="searchType" onChange={handleChange} value="comments" checked={!searchSubmissions} />
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
            <select name="sortType" onChange={handleChange} value={sortType}>
                <option value="score">Score</option>
                <option value="num_comments">Number of Comments</option>
                <option value="created_utc">Created Date</option>
            </select>

            <br />
            <button>Search</button>
            <br />
            <div>
                {isLoading ? <img src={loading} alt="loading"></img> : contentList}
            </div>
        </form>
    )
}

export default Form