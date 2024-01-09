const {gql} =require('apollo-server')
const typeDefs = gql`
  type Query {
    users:[User]
    user(_id:ID!):User
    quotes:[QuoteWithName]
    quoteByUser(_id:ID!):[Quote]
  }

  type User{
    _id:ID
    firstName:String
    lastName:String
    email:String
    password:String
    quotes:[Quote]
  }

  type QuoteWithName{
    name:String
    by:IDName
  }

  type IDName
  {
    _id:String
    firstName:String
  }

  type Quote{
    name:String
    by:ID
  }

  type Token{
    token:String,
  }

  type Mutation{
    signupUser(userNew:UserInput!):User
    signInUser(userSignIn:UserSignInInput!):Token
    createQuote(name:String!):String
  }

  input UserInput {
    firstName:String!,
     lastName:String!,
     email:String!,
     password:String!
  }

  input UserSignInInput{
    email:String!,
    password:String!
  }
`

module.exports ={typeDefs}