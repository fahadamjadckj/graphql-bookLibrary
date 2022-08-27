import { useEffect, useState } from "react"
import { useMutation } from "@apollo/client"
import { LOGIN } from "../queries/queries"

const LoginForm = ({ show, setToken }) => {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      console.log(error.graphQLErrors[0].message)
    },
  })

  useEffect(() => {
    if (result.data) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem("loggedInUser", token)
    }
  }, [result.data])

  const handleSubmit = async (e) => {
    e.preventDefault()
    login({
      variables: {
        username,
        password,
      },
    })
  }

  if (!show) {
    return null
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <p>Username</p>
        <input
          type="text"
          onChange={(e) => setUsername(e.target.value)}
        ></input>
        <p>password</p>
        <input
          type="text"
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <div>
          <button type="submit"> login </button>
        </div>
      </form>
    </div>
  )
}

export default LoginForm
