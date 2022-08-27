import { useLazyQuery, useQuery } from "@apollo/client"
import { useEffect, useState } from "react"
import { ALL_BOOKS, BOOKS_BY_GENRE } from "../queries/queries"

const Books = (props) => {
  const result = useQuery(ALL_BOOKS) //eslint-disable-next-line
  const [booksByGenre, { loading, error, data }] = useLazyQuery(BOOKS_BY_GENRE)
  const [filtered, setFilter] = useState(null)

  // use effect to avoid infinte loop

  useEffect(() => {
    if (data !== undefined) {
      // console.log(data)
      setFilter(data.booksByGenre)
    }
  }, [data])

  if (result.loading) {
    return <div>books loading...</div>
  }

  let books = result.data.allBooks

  if (!props.show) {
    return null
  }

  // const books = []
  const clickHanlder = (e) => {
    console.log(e.target.name)
    booksByGenre({
      variables: {
        genre: e.target.name,
      },
    })
  }
  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th>title</th>
            <th>author</th>
            <th>published</th>
          </tr>

          {/* displays data when filter is null, or all the books */}
          {!filtered &&
            books.map((x) => (
              <tr key={x.title}>
                <td>{x.title}</td>
                <td>{x.author.name}</td>
                <td>{x.published}</td>
              </tr>
            ))}

          {/* displays data when filter is selected */}
          {filtered &&
            filtered.map((x) => (
              <tr key={x.title}>
                <td>{x.title}</td>
                <td>{x.author.name}</td>
                <td>{x.published}</td>
              </tr>
            ))}
        </tbody>
      </table>

      <button onClick={clickHanlder} name="horror">
        horror
      </button>
      <button onClick={clickHanlder} name="fantasy">
        fantasy
      </button>
      <button onClick={() => setFilter(null)} name="fantasy">
        all
      </button>
    </div>
  )
}

export default Books
