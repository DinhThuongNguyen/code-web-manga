import React, { useEffect } from "react";
import { PrismaClient } from "@prisma/client";

const Admin = (props) => {
  const { account } = props;

  useEffect(() => {
    console.log(account);
  }, []);

  return <div>page admin</div>;
};

export default Admin;

export async function getServerSideProps({ req }) {
  const prisma = new PrismaClient();
  // console.log(prisma);
  const role = req.cookies.role;
  if (!role || role !== "ADMIN") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  let user = [];
  let author = [];
  try {
    user = await prisma.account.findMany({
      where: {
        role: "USER",
      },
    });
  } catch (error) {
    console.log(error);
  }

  try {
    author = await prisma.account.findMany({
      where: {
        role: "AUTHOR",
      },
    });
  } catch (error) {
    console.log(error);
  }
  return {
    props: { role, account: user.concat(author) }, // will be passed to the page component as props
  };
}
