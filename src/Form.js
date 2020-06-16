import React, { useState } from 'react'
import axios from 'axios'
import loading from './loading.svg'
import Post from './Post'

const Form = () => {

    const [author, setAuthor] = useState("")
    const [title, setTitle] = useState("")
    const [subreddit, setSubreddit] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const [size, setSize] = useState(50)
    const [after, setAfter] = useState()
    const [before, setBefore] = useState()

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

    }

    const apiQuery = (event) => {
        setIsLoading(true)
        event.preventDefault()
        axios.get("https://api.pushshift.io/reddit/search/submission", {
            params: {
                author: author,
                title: title,
                q: searchTerm,
                subreddit: subreddit,
                size: size,
                after: after,
                before: before
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

    const apiResponseArray = apiResponse.map(data => <Post key={data.id} data={data} />)

    return (
        <form onSubmit={apiQuery}>
            <label>Author </label>
            <input type="text" name="author" onChange={handleChange} value={author}/>
            <br />
            <label>Subreddit </label>
            <input type="text" name="subreddit" onChange={handleChange} value={subreddit}/>
            <br />
            <label>Search Term </label>
            <input type="text" name="searchTerm" onChange={handleChange} value={searchTerm}/>
            <br />
            <label>Title </label>
            <input type="text" name="title" onChange={handleChange} value={title} />
            <br />
            <label>Return Size </label>
            <input type="number" name="size" onChange={handleChange} value={size}/>
            <br />
            <label>After </label>
            <input type="date" name="after" onChange={handleChange} value={after}/>
            <br />
            <label>Before </label>
            <input type="date" name="before" onChange={handleChange} value={before}/>
            <br />

            <button>Submit</button>
            <br />
            <div>
                {isLoading ? <img src={loading} alt="loading"></img> : apiResponseArray}
            </div>
        </form>
    )
}

export default Form