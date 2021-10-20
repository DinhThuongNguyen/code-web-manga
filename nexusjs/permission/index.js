import { ApolloError } from "apollo-server-errors";
import { or, rule, shield } from "graphql-shield";
import { getIdAndRole } from "../utils";

const rules = {
  isLogin: rule({ cache: "contextual" })((_parent, _args, context) => {
    let objVerified;
    try {
      objVerified = getIdAndRole(context);
    } catch (error) {
      return new ApolloError("Token expired", 405);
    }
    return Boolean(Number(objVerified.id));
  }),
  isUser: rule({ cache: "contextual" })((_parent, _args, context) => {
    let objVerified;
    try {
      objVerified = getIdAndRole(context);
    } catch (error) {
      return new ApolloError("Token expired", 405);
    }
    return "USER" === objVerified.role;
  }),
  isAdmin: rule({ cache: "contextual" })((_parent, _args, context) => {
    let objVerified;
    try {
      objVerified = getIdAndRole(context);
    } catch (error) {
      return new ApolloError("Token expired", "405");
    }
    return "ADMIN" === objVerified.role;
  }),
  isAuthor: rule({ cache: "contextual" })((_parent, _args, context) => {
    let objVerified;
    try {
      objVerified = getIdAndRole(context);
    } catch (error) {
      // console.log(error);
      return new ApolloError("Token expired", 405);
    }
    return "AUTHOR" === objVerified.role;
  }),
};

export const permissions = shield({
  Query: {
    getTruyenByAccount: rules.isLogin,
    testAdmin: rules.isUser,
    testAuthor: rules.isAuthor,
    testUser: rules.isUser,
  },
  Mutation: {
    createTruyen: or(rules.isAdmin, rules.isAuthor),
    createChuongAdmin: rules.isAdmin,
    createTheLoaiTruyen: rules.isAdmin,
    updateRoleAccount: rules.isAdmin,
    // createChuongAuthor: rules.isAuthor,
  },
});
