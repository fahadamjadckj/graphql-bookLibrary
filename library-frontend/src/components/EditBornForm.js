import { useMutation } from "@apollo/client"
import { useState } from "react"
import { EDIT_AUTHOR } from "../queries/queries"

const EditBornForm = ({ authors }) => {
  const [name, setName] = useState("")
  const [setBornTo, setBorn] = useState("")
  const [editAuthor] = useMutation(EDIT_AUTHOR, {
    onError: (err) => {
      console.log(err.graphQLErrors[0].message)
    },
  })

  const submitHandler = (e) => {
    e.preventDefault()

    console.log(name, setBornTo)

    editAuthor({
      variables: {
        name,
        setBornTo: parseInt(setBornTo),
      },
    })
  }

  return (
    <div>
      <h2>Edit Born</h2>
      <form onSubmit={submitHandler}>
        {/* <input type="text" onChange={(e) => setName(e.target.value)} /> */}
        <select value={name} onChange={(e) => setName(e.target.value)}>
          <option value={""} disabled={true}>
            select author
          </option>
          {authors.map((x) => (
            <option value={x.name} key={x.name}>
              {x.name}
            </option>
          ))}
        </select>

        <div>
          <input type="number" onChange={(e) => setBorn(e.target.value)} />
        </div>
        <button type="submit">edit</button>
      </form>
    </div>
  )
}

export default EditBornForm
