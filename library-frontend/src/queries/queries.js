import { gql } from "@apollo/client"

export const ALL_BOOKS = gql`
  query {
    allBooks {
      title
      published
      author {
        name
      }
      genres
      id
    }
  }
`

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      name
      born
      id
    }
  }
`

export const CREATE_BOOK = gql`
  mutation addBook(
    $title: String!
    $published: Int!
    $author: String!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      published: $published
      author: $author
      genres: $genres
    ) {
      title
      published
      author {
        name
        id
      }
      genres
      id
    }
  }
`
export const EDIT_AUTHOR = gql`
  mutation editAuthor($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      name
      born
      id
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`

export const BOOKS_BY_GENRE = gql`
  query booksByGenre($genre: String!) {
    booksByGenre(genre: $genre) {
      title
      id
      genres
      author {
        name
      }
      published
    }
  }
`

export const GET_SELF = gql`
  query {
    me {
      username
      favouriteGenre
    }
  }
`
export const PERSON_ADDED = gql`
  subscription {
    bookAdded {
      title
      published
      author {
        name
      }
      genres
      id
    }
  }
`
