import 'colors'
import 'dotenv/config'
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { typeDefs } from './schema/index.js';
import { resolvers } from './resolvers/index.js';

const server = new ApolloServer({
    typeDefs,
    resolvers,
});

(async () => {
    const { url } = await startStandaloneServer(server, {
        context: async ({ req }) => ({ token: req.headers.token }),
        listen: { port: process.env.API_PORT || 4000 },
    });
    console.log(`${'Server ready at:'.green} ${url.yellow}`);
})();