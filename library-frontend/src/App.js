import { useState } from "react"
import Authors from "./components/Authors"
import Books from "./components/Books"
import NewBook from "./components/NewBook"
import LoginForm from "./components/LoginForm"
import { useApolloClient, useQuery, useSubscription } from "@apollo/client"
import Recommended from "./components/Recm"
import { ALL_BOOKS, GET_SELF, PERSON_ADDED } from "./queries/queries"

export const updateCache = (cache, query, addedBook) => {
  const uniqByName = (a) => {
    let seen = new Set()
    return a.filter((item) => {
      let k = item.title
      return seen.has(k) ? false : seen.add(k)
    })
  }
  cache.updateQuery(query, ({ allBooks }) => {
    return {
      allBooks: uniqByName(allBooks.concat(addedBook)),
    }
  })
}

const App = () => {
  const [page, setPage] = useState("authors")
  const [token, setToken] = useState(null) // stores the json web token for the user
  const client = useApolloClient()
  const user = useQuery(GET_SELF)

  useSubscription(PERSON_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      updateCache(client.cache, { query: ALL_BOOKS }, addedBook)
    },
  })

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        <button onClick={() => setPage("add")}>add book</button>
        <button onClick={() => setPage("login")}>login</button>
        <button onClick={() => setPage("recommended")}>recommended</button>
        {token && <button onClick={() => logout()}>logout</button>}
      </div>

      <Authors show={page === "authors"} />

      <Books show={page === "books"} />

      <NewBook show={page === "add"} />

      <LoginForm show={page === "login"} setToken={setToken} />

      {<Recommended show={page === "recommended"} user={user} />}
    </div>
  )
}

export default App
