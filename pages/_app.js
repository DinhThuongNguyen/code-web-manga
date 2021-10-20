import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { ThemeProvider } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import theme from "../src/theme";
import Fonts from "../src/ui/Fonts";
import Header from "../src/components/Header";
import {
  ApolloClient,
  ApolloProvider,
  from,
  HttpLink,
  InMemoryCache,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { AuthContext } from "../src/AuthHook/context";
import { useAuth } from "../src/AuthHook/customHook/useAuth";
import { setContext } from "@apollo/client/link/context";
import ChangeBackground from "../src/components/ChangeBackground";
import "../style/global.css";

// if (process.env.NODE_ENV === 'development' && !process.browser) {
//   if (process.env['NEXT_PUBLIC_MOCK_SERVER']) {
//     const { setupServer } = require('msw/node')
//     const { routes } = require('../api/mock.server')
//     const server = setupServer(...routes)
//     server.listen()
//   }
// }

const errorLink = onError(({ graphQLErrors, networkError }) => {
  // if (graphQLErrors) console.log("Some thing wrong");
  // graphQLErrors.map(({ message, locations, path }) =>
  //   console.log(
  //     `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
  //   )
  // );
  if (networkError) console.log(`[Network error]: ${networkError}`);
});
const httpLink = new HttpLink({
  uri: "http://localhost:3000/api/graphql",
  // credentials: "same-origin",
});
const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = JSON.parse(localStorage.getItem("RFAC"));
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      Authorization: token?.web_auth ? `Bearer ${token.web_auth}` : "",
    },
  };
});

const client = new ApolloClient({
  link: from([errorLink, authLink.concat(httpLink)]),
  cache: new InMemoryCache(),
  // onError: (e) => { console.log(e.networkError) },
});

// if (process.env.NEXT_PUBLIC_API_MOCKING === "enabled") {
//   require("../mocks");
// }

export default function MyApp(props) {
  const { Component, pageProps } = props;
  const { name, role, token, login, logout, changeBackground, check } =
    useAuth();

  React.useEffect(() => {
    const next = document.getElementById("__next");
    next.style.backgroundColor = "inherit";
    Fonts();
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }

    const storeData = JSON.parse(localStorage.getItem("account"));
    if (storeData) {
      const time =
        new Date(storeData.expiration).getTime() - new Date().getTime();
      setTimeout(() => {
        logout();
      }, time);
    }
  }, []);

  return (
    <React.Fragment>
      <Head>
        <title>My page</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>
      <ApolloProvider client={client}>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <AuthContext.Provider
            value={{
              isLogin: !!token,
              name: name,
              role,
              token,
              login,
              logout,
              changeBackground,
              checkedBackground: check,
            }}
          >
            <Header />
            <ChangeBackground />
            <Component {...pageProps} />
            {/* <Footer/> */}
          </AuthContext.Provider>
        </ThemeProvider>
      </ApolloProvider>
    </React.Fragment>
  );
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  pageProps: PropTypes.object.isRequired,
};
