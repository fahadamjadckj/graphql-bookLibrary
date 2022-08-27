const { UserInputError, AuthenticationError } = require("apollo-server");
require("dotenv").config();
const Book = require("./models/Book");
const Author = require("./models/Author");
const User = require("./models/User");
const jwt = require("jsonwebtoken");
const { PubSub } = require("graphql-subscriptions");
const pubSub = new PubSub();

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(), //from database
    authorCount: async () => Author.collection.countDocuments(), //from database
    allBooks: async () => {
      return Book.find({});
    }, // fetch from database
    allAuthors: async () => {
      return Author.find({});
    },
    allBooksAuthor: async (root, args) => {
      //also from database
      // return books.filter((x) => x.author === args.author);
      const author = Author.find({ name: args.author });
      return Book.find({ author: author._id });
    },
    booksByGenre: async (root, args) => {
      return Book.find({ genres: { $in: [args.genre] } });
    },
    me: async (root, args, context) => {
      return context.currentUser;
    },
  },
  Author: {
    bookCount: (root) => {
      const length = books.length;
      let count = 0;
      for (let i = 0; i < length; i++) {
        if (root.name === books[i].author) {
          count += 1;
        }
      }
      return count;
    },
  },
  Book: {
    author: async (root) => {
      const author = await Author.findById(root.author);
      return author;
    },
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const loggedUser = context.currentUser;
      if (!loggedUser) {
        throw new AuthenticationError("not authenticated");
      }

      const author = await Author.findOne({ name: args.author });
      const book = new Book({
        title: args.title,
        published: args.published,
        author: author,
        genres: args.genres,
      });
      try {
        await book.save();
      } catch (err) {
        throw new UserInputError(err.message, {
          invalidArgs: args,
        });
      }

      // publishes the change to subscribers

      pubSub.publish("BOOK_ADDED", {
        bookAdded: book,
      });

      return book;
    },
    editAuthor: async (root, args, context) => {
      const loggedUser = context.currentUser;
      if (!loggedUser) {
        throw new AuthenticationError("not authenticated");
      }

      let author = "";

      try {
        author = await Author.findOneAndUpdate(
          { name: args.name },
          { born: args.setBornTo },
          { new: true }
        );
      } catch (err) {
        new UserInputError(err.message, {
          invalidArgs: args,
        });
      }

      return author;
    },
    createUser: async (root, args) => {
      const user = new User({ ...args });
      let newUsr = await user.save();

      return newUsr;
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new UserInputError("wrong credentials");
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) };
    },
  },

  Subscription: {
    bookAdded: {
      subscribe: () => pubSub.asyncIterator(["BOOK_ADDED"]),
    },
  },
};

module.exports = resolvers;
