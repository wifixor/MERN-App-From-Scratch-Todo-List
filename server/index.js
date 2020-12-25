
// getting-started.js
import { GraphQLServer } from 'graphql-yoga'
import mongoose from 'mongoose';


mongoose.connect('mongodb+srv://wifixor:5579187Er@cluster0.xhufq.mongodb.net/todo?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

const Todo = mongoose.model('Todo', {
  text: String,
  complete: Boolean
})

const typeDefs = `
  type Query {
    hello(name: String): String!
    todos: [Todo]
  }
  type Todo {
    id: ID
    text: String!
    complete: Boolean!
  }
  type Mutation {
    createTodo(text: String!): Todo
    updateTodo(id: ID!, text: String!, complete: Boolean!): String
  }
`

const resolvers = {
  Query: {
    hello: (_, { name }) => `Hello ${name || 'World'}`,
    todos: () => Todo.find()
  },
  Mutation: {
    createTodo: async (_, { text } ) => {
      const todo = new Todo({ text, complete: false })
      await todo.save();
      return todo;
    },
    updateTodo: async (_, { id, text, complete }) => {     
      await Todo.findByIdAndUpdate(id, { complete, text });     
      return "Malumot o'zgardi!";
    }
  }
}


const server = new GraphQLServer({ typeDefs, resolvers })

mongoose.connection.once('open', function() {
  server.start(() => console.log('Server is running on localhost:4000'))
})

