import { useQuery } from "@apollo/client"
import { ALL_AUTHORS } from "../queries/queries"
import EditBornForm from "./EditBornForm"

const Authors = (props) => {
  const result = useQuery(ALL_AUTHORS)

  if (result.loading) {
    return <div>books loading...</div>
  }

  const authors = result.data.allAuthors

  if (!props.show) {
    return null
  }
  //  const authors = []

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th>Name</th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <EditBornForm authors={authors}></EditBornForm>
      </div>
    </div>
  )
}

export default Authors
