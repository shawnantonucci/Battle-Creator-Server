const { ApolloServer } = require("apollo-server");
const { makeExecutableSchema } = require("graphql-tools");

const db = {
  users: [
    {
      id: "user-0",
      name: "Shawn",
      cards: [],
    },
  ],
  monsters: [
    {
      name: "Test Monster",
      id: "monster-0",
      createdBy: "user-0",
    },
  ],
  attacks: [
    {
      id: "attack-0",
      name: "Slap",
      dmg: 5,
    },
  ],
};

const typeDefs = `
  type Query { 
    users: [User]
    user(id: ID!): User
    monsters: [Monster]
    monster(id: ID!): Monster
    attacks: [Attacks]
    attack(id: ID!): Attacks
    getMonstersByUser(id: ID!): [Monster]
  }

  type User { 
    id: ID
    name: String
    cards: [Monster]
  }

  type Monster { 
    id: ID
    name: String
    health: Int
    image: String
    createdBy: ID
    attacks: [Attacks]
  }

  type Attacks {
    owner: [Monster!]
    id: ID
    name: String
    dmg: Int
  }

  input attackInput {
    name: String
    dmg: Int
  }


  type Mutation {
    createUser(name: String): User
    createMonster(name: String, health: Int, image: String): Monster
    createAttack(name: String, dmg: Int): Attacks
  }
`;

let idCountUser = db.users.length;
let idCountMonster = db.monsters.length;
let idCountAttack = db.attacks.length;

const Log = (thang) => {
  console.log(thang, "THANG");
};

const resolvers = {
  Query: {
    user: (_, { id }) => db.users.find((user) => user.id === id),
    users: () => db.users,
    monster: (_, { id }) => db.monsters.find((monster) => monster.id === id),
    monsters: () => db.monsters,
    attack: (_, { id }) => db.attacks.find((attack) => attack.id === id),
    attacks: () => db.attacks,
    getMonstersByUser: () => (_, { id }) => {
      Log();
      return db.monsters.filter((user) => user.createdBy === id);
    },
  },
  Mutation: {
    createUser: (parent, args) => {
      const newUser = {
        id: `user-${idCountUser++}`,
        name: args.name,
      };
      db.users.push(newUser);
      return newUser;
    },
    createMonster: (parent, args) => {
      const newMonster = {
        id: `monster-${idCountMonster++}`,
        name: args.name,
        health: args.health,
        image: args.image,
        attacks: args.attacks,
      };
      db.monsters.push(newMonster);
      return newMonster;
    },
    createAttack: (parent, args) => {
      const newAttack = {
        id: `attack-${idCountAttack++}`,
        name: args.name,
        dmg: args.dmg,
      };
      db.attacks.push(newAttack);
      return newAttack;
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
  console.log(`🚀 Server ready at ${url} `);
});
