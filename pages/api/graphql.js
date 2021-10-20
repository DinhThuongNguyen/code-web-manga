import { ApolloServer } from "apollo-server-micro";
import cookies from "../../util/cookies";
import { schema } from "../../nexusjs/schema";
import cors from "micro-cors";
import prisma from "../../util/db";
import Redis from "redis";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default cookies(async (req, res) => {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://studio.apollographql.com"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  if (req.method === "OPTIONS") {
    res.end();
    return false;
  }
  // const prisma = new PrismaClient();
  const redis = Redis.createClient();
  // const redis = Redis.createClient(6379, "redis");

  const apolloServer = new ApolloServer({
    schema,
    context: () => {
      return {
        req,
        prisma,
        res,
        redis,
      };
    },
  });
  await apolloServer.start();
  await apolloServer.createHandler({ path: "/api/graphql" })(req, res);
});
