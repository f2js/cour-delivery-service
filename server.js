const fs = require("fs");
require("dotenv").config({ path: "./.env" });

const { buildSubgraphSchema } = require("@apollo/subgraph");
const { ApolloServer, gql } = require("apollo-server");
const { MongoClient } = require("mongodb");

const DeliveryRESTAPI = require("./Controllers/restDeliveryAPI");

const resolvers = require("./graphql/resolvers");

const dbConnection = require("./Services/DBConnection");

const app = require("./app");
const https = require("https");

const port = process.env.API_PORT || 3000;

const config = {
  port: port,
  host: "0.0.0.0",
};

dbConnection.connect();

// Load schema
const schema = gql(fs.readFileSync("./graphql/schema.graphql", "utf8"));

const client = new MongoClient(process.env.DB_URI);
client.connect();

const dataSources = () => ({
  deliveryRESTAPI: new DeliveryRESTAPI(),
});

/*
const server = new ApolloServer({
  schema: buildSubgraphSchema([{ typeDefs: schema, resolvers }]),
  dataSources: dataSources,
  introspection: true,
});

// Apollo server
server.listen({ port: 4001 }).then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
*/
if (process.env.NODE_ENV == "development") {
  // REST server
  app.listen(config.port, config.host, (e) => {
    if (e) {
      throw new Error("Error starting server");
    }
    console.log(
      `App running locally without sslOptions on host: ${config.host} : port ${config.port}`
    );
  });
} else {
  https.createServer(app).listen(port, () => {
    console.log(`App running on port ${port}`);
  });
}
