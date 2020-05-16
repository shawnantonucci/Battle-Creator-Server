const { ApolloServer } = require("apollo-server");
const { makeExecutableSchema } = require("graphql-tools");

const monsters = [
  {
    id: "monster-0",
    name: "Monster 1",
    health: 50,
    attacks: [
      {
        name: "Attack 1",
        dmg: 5,
      },
    ],
  },
];

const typeDefs = `
  type Query { 
    monsters: [Monster]
    monster(id: ID!): Monster
  }

  type Monster { 
    id: ID
    name: String
    health: Int
    attacks: [Attacks]
  }

  type Attacks {
    name: String
    dmg: Int
  }

  input attackInput {
    name: String
    dmg: Int
  }


  type Mutation {
    createMonster(name: String, health: Int, attacks: [attackInput]): Monster
  }
`;

let idCountMonster = monsters.length;

const resolvers = {
  Query: {
    monsters: () => monsters,
    monster: (_, { id }) => monsters.find((monster) => monster.id === id),
  },
  Mutation: {
    createMonster: (parent, args) => {
      const newMonster = {
        id: `monster-${idCountMonster++}`,
        name: args.name,
        health: args.health,
        attacks: args.attacks,
      };
      monsters.push(newMonster);
      return newMonster;
    },
  },
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const app = new ApolloServer({
  schema,
});

app.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});