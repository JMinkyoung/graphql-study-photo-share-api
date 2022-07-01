const { ApolloServer } = require('apollo-server')

const typeDefs = `

  enum PhotoCategory {
    SELFIE
    PORTRAIT
    ACTION
    LANDSCAPE
    GRAPHIC
  }
  
  type Photo {
    id: ID!
    url: String!
    name: String!
    description: String
    category: PhotoCategory!
  }
  
  input PostPhotoInput {
    name: String!
    category: PhotoCategory = PORTRAIT
    description: String
  }
  
  type Query {
    totalPhotos: Int!
    allPhotos: [Photo!]!
  }  
  
  type Mutation {
    postPhoto(input: PostPhotoInput!): Photo!
  }
`;

let _id = 0;
let photos = [];

const resolvers = {
  Query: {
    totalPhotos: () => photos.length,
    allPhotos: () => photos
  },

  // Mutation & postPhoto 리졸브 함수
  Mutation: {
    postPhoto (parent, args) {
      let newPhoto = {
        id: _id++,
        ...args.input
      }
      photos.push(newPhoto);
      return newPhoto;
    }
  },

  Photo: {
    url: parent => `http://yoursite.com/img/${parent.id}.jpg`
  }
};

// 서버 인스턴스를 새로 만듭니다.
// 스키마와 리졸브를 객체에 넣어 전달합니다.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});


server
  .listen()
  .then(({url}) => console.log(`GraphQL Service running on ${url}`));

