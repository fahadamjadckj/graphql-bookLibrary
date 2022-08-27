import { useLazyQuery, useQuery } from "@apollo/client"
import { useEffect, useState } from "react"
import { BOOKS_BY_GENRE, GET_SELF } from "../queries/queries"

const Recommended = ({ show, user }) => {
  const [booksByGenre, { loading, error, data }] = useLazyQuery(BOOKS_BY_GENRE)
  useEffect(() => {
    if (user.data !== undefined) {
      booksByGenre({
        variables: {
          genre: user.data.me.favouriteGenre.toLowerCase(),
        },
      })
    }
  }, [user.data])

  if (!show) {
    return null
  }

  if (loading) {
    return <div>loading</div>
  }

  return (
    <div>
      <h1>Recommended</h1>
      <em>Books in your favourite genre</em>
      <table>
        <tbody>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Date Published</th>
          </tr>
          {data.booksByGenre.map((x) => (
            <tr key={x.title}>
              <td>{x.title}</td>
              <td>{x.author.name}</td>
              <td>{x.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommended
