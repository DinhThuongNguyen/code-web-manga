import { Breadcrumbs, Grid, makeStyles } from "@material-ui/core";
import { useRouter } from "next/router";
import React from "react";
import Link from "../../../src/Link";
import Images from "next/image";
import prisma from "../../../util/db";
import sizeOf from "probe-image-size";

const useStyles = makeStyles((theme) => ({
  chuongTruyenContent: {
    width: "85%",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  showModal: {
    width: "90%",
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  images: {
    cursor: "pointer",
    marginBottom: 2,
    position: "relative",
  },
  exImage: {
    color: "black",
  },
}));

const ChapTruyen = (props) => {
  const classes = useStyles();
  const router = useRouter();
  const { tentruyen, images, nameChap, imageSize } = props;

  return (
    <Grid container direction="column" alignItems="center">
      <Grid item className={classes.chuongTruyenContent}>
        <Grid container direction="column">
          <Grid item>
            <Breadcrumbs>
              <Link href={`/truyen-tranh/${router.query["nameTruyen"]}`}>
                {tentruyen}
              </Link>
              <Link
                href={`/truyen-tranh/${router.query["nameTruyen"]}/${router.query["chapTruyen"]}`}
              >
                {nameChap}
              </Link>
            </Breadcrumbs>
          </Grid>
          <Grid item container direction="column" alignItems="center">
            {images.map((item, idx) => (
              <div
                key={idx}
                className={classes.images}
                style={{ width: 800, height: imageSize[idx].h }}
              >
                <Images
                  src={item}
                  alt={`${router.query["nameTruyen"]}${idx}`}
                  layout="fill"
                  objectFit="fill"
                  // onLoad={(e) => {
                  //   console.log(e.target.clientHeight);
                  // }}
                />
              </div>
            ))}
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ChapTruyen;

export async function getServerSideProps({ params }) {
  const a = params["nameTruyen"];
  const b = params["chapTruyen"];
  const c = b.substring(0, b.indexOf("&"));
  const chap = parseInt(c.split("-")[1]);

  let truyen;
  try {
    truyen = await prisma.truyen.findMany({
      where: {
        namevn: a.replaceAll("-", " "),
      },
      include: {
        soChuong: true,
      },
    });
  } catch (error) {
    console.log(error);
  }

  const arr = [];
  const images = truyen[0].soChuong[chap].images;
  for (let i in images) {
    const kq = await sizeOf(images[i]);
    const obj = {
      h: "",
    };
    obj["h"] = kq.height;
    arr.push(obj);
  }
  // console.log(arr);

  return {
    props: {
      tentruyen: truyen[0].tentruyen,
      images: truyen[0].soChuong[chap].images,
      nameChap: truyen[0].soChuong[chap].name,
      imageSize: arr,
    },
  };
}

// export async function getStaticPaths() {
//   const t = await prisma.truyen.findMany({
//     include: {
//       soChuong: {
//         select: {
//           images: true,
//         },
//       },
//     },
//   });
//   const brr = [];
//   const arrId = t.map((item) => item.id);

//   for (let idx in arrId) {
//     for (let item = 0; item <= t[idx].soChuong.length; item++) {
//       const obj = { nameTruyen: "", chapTruyen: "" };

//       obj["chapTruyen"] = `chap-${item}&${arrId[idx].substring(
//         0,
//         arrId[idx].length / 2
//       )}`;

//       obj["nameTruyen"] = t[idx].namevn.replaceAll(" ", "-");

//       brr.push(obj);
//     }
//   }
//   const crr = brr.map((item) => ({
//     params: item,
//   }));

//   return { paths: crr, fallback: false };
// }
