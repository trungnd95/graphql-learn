const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const {
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLList
} = require("graphql")
const app = express();

const authors = [
	{ id: 1, name: 'J. K. Rowling' },
	{ id: 2, name: 'J. R. R. Tolkien' },
	{ id: 3, name: 'Brent Weeks' }
]

const books = [
	{ id: 1, name: 'Harry Potter and the Chamber of Secrets', authorId: 1 },
	{ id: 2, name: 'Harry Potter and the Prisoner of Azkaban', authorId: 1 },
	{ id: 3, name: 'Harry Potter and the Goblet of Fire', authorId: 1 },
	{ id: 4, name: 'The Fellowship of the Ring', authorId: 2 },
	{ id: 5, name: 'The Two Towers', authorId: 2 },
	{ id: 6, name: 'The Return of the King', authorId: 2 },
	{ id: 7, name: 'The Way of Shadows', authorId: 3 },
	{ id: 8, name: 'Beyond the Shadows', authorId: 3 }
]

const BookType = new GraphQLObjectType({
  name: 'BookType',
  description: "Book properties",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    author: {
      type: GraphQLNonNull(AuthorType),
      resolve: (book) => {
        return authors.find(author => author.id === book.authorId)
      }
    },
  })
});

const AuthorType = new GraphQLObjectType({
  name: "AuthorType",
  descriptioN: "Author properties",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    books: {
      type: GraphQLList(BookType),
      resolve: (author) => {
        return books.filter(book => book.authorId === author.id);
      }
    }
  })
})

const RootQuery = new GraphQLObjectType({
  name: "Query",
  description: "GraphQL Root Query",
  fields: () => ({
    books: {
      description: "List of books",
      type: GraphQLList(BookType),
      resolve: () => books
    },
    book: {
      type: BookType,
      description: "Get single book info",
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args) => {
        return books.find(book => book.id === args.id);
      }
    },
    authors: {
      description: "List of authors",
      type: GraphQLList(AuthorType),
      resolve: () => authors
    },
    author: {
      description: "Query single author info",
      type: AuthorType,
      args: {
        id: { type: GraphQLInt }
      },
      resolve: (parent, args) => authors.find(author => author.id === args.id)
    }
  })
})
const schema = new GraphQLSchema({
  query: RootQuery
})
app.use("/graphql", graphqlHTTP({
  schema: schema,
  graphiql: true
}))

app.listen(5000, () => { console.log("Server is running");})