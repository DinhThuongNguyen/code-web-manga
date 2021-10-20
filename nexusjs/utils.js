import { ApolloError } from "apollo-server-errors";
import { verify } from "jsonwebtoken";

function getIdAndRole(context) {
  const { req } = context;
  const authHeader = req.headers.authorization;
  const token = authHeader.replace("Bearer ", "");

  return verify(token, process.env.JWT_SECRET);
}

export { getIdAndRole };
