import { PrismaClient } from "@prisma/client";
import { useRouter } from "next/dist/client/router";
import React, { useEffect } from "react";
import prisma from "../util/db";

const Country = (props) => {
  const router = useRouter();
  const { country } = router.query;

  useEffect(() => {
    // console.log(props.quocgia);
  }, []);

  return <div style={{ color: "whitesmoke" }}>{country}</div>;
};

export default Country;

export async function getStaticProps({ params }) {
  let quocgia;

  try {
    switch (params.country) {
      case "viet-nam":
        quocgia = await prisma.truyen.findMany({
          where: { country: "VietNam" },
          orderBy: {
            update_at: "desc",
          },
        });
        break;
      case "nhat-ban":
        quocgia = await prisma.truyen.findMany({
          where: { country: "NhatBan" },
          orderBy: {
            update_at: "desc",
          },
        });
        break;
      case "han-quoc":
        quocgia = await prisma.truyen.findMany({
          where: { country: "HanQuoc" },
          orderBy: {
            update_at: "desc",
          },
        });
        break;
      case "trung-quoc":
        quocgia = await prisma.truyen.findMany({
          where: { country: "TrungQuoc" },
          orderBy: {
            update_at: "desc",
          },
        });
        break;

      default:
        break;
    }
  } catch (error) {
    console.log(error);
  }
  for (let idx in quocgia) {
    quocgia[idx].create_at = JSON.stringify(quocgia[idx].create_at);
    quocgia[idx].update_at = JSON.stringify(quocgia[idx].update_at);
  }
  return {
    props: { quocgia },
  };
}

export async function getStaticPaths() {
  return {
    paths: [
      { params: { country: "nhat-ban" } },
      { params: { country: "han-quoc" } },
      { params: { country: "viet-nam" } },
      { params: { country: "trung-quoc" } },
    ],
    fallback: false,
  };
}
