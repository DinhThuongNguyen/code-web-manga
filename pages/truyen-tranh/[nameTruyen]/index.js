import {
  Button,
  Grid,
  Hidden,
  makeStyles,
  Typography,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../src/AuthHook/context";
import Link from "../../../src/Link";
import prisma from "../../../util/db";
import Image from "next/image";
import { removeVietnameseTones } from "../../../util/locdau";
import TabMostView from "../../../src/components/TabMostView";

const useStyles = makeStyles((theme) => ({
  truyen: {
    width: "90%",
    margin: "1em auto",
  },
  content: {
    width: "65%",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "center",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  photo: {
    width: "35%",
    display: "flex",
    justifyContent: "center",
  },
  theloai: {
    width: "60%",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  tag: {
    backgroundColor: "orange",
  },
  titeBlack: {
    color: "black",
  },
  titleWhite: {
    color: "white",
  },
  Chuong: {
    padding: "2em 3em",
  },
  listChuong: {
    width: "60%",
    display: "flex",
    flexDirection: "column",
    // flexWrap: "wrap",
    justifyContent: "flex-start",
    [theme.breakpoints.down("xs")]: {
      width: "100%",
    },
  },
  itemChuong: {
    width: "100%",
    marginBottom: "1em",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    border: "1px solid",
  },
  tabMostView: {
    width: "40%",
  },
  linkChap: {
    padding: "5px",
    borderBottom: "1px solid",
    width: "100%",
  },
}));

const Index = (props) => {
  const { chuong, name, description, avatar, theloai } = props;
  const [arr, setArr] = useState();
  const auth = useContext(AuthContext);
  const theme = useTheme();
  const matcheSM = useMediaQuery(theme.breakpoints.down("xs"));
  const breakPointDescription = useMediaQuery(
    theme.breakpoints.between("md", "xl")
  );
  const titleListChuongLon = useMediaQuery(theme.breakpoints.up("lg"));
  const titleListChuongTrungBinh = useMediaQuery(
    theme.breakpoints.between("sm", "md")
  );
  const titleListChuongnho = useMediaQuery(theme.breakpoints.down("xs"));
  const classes = useStyles();

  useEffect(() => {
    const chuongs = [];
    let start = 0;
    let end = 30;
    for (let i = 0; i < Math.ceil(chuong.length / 30); i++) {
      const obj = { start: "", end: "" };
      if (i === 0) {
        obj["start"] = start;
        obj["end"] = end;
      } else {
        start = end + 1;
        end = end + 30;
        obj["start"] = start;
        obj["end"] = end;
      }
      chuongs.push(obj);
    }
    setArr(chuongs);
  }, [props]);
  return (
    <Grid container description="column" className={classes.truyen}>
      <Grid
        item
        container
        direction="row"
        style={{
          backgroundImage: `url(${matcheSM ? avatar : undefined})`,
          backgroundRepeat: `${matcheSM ? "no-repeat" : undefined}`,
          backgroundPosition: `${matcheSM ? "right" : undefined}`,
        }}
      >
        <Grid item className={classes.content}>
          <Typography variant="h1" style={{ marginBottom: "10px" }}>
            {name}
          </Typography>
          <Grid
            item
            className={classes.theloai}
            style={{ marginBottom: "10px" }}
          >
            {theloai.map((item) => (
              <Button
                className={classes.tag}
                key={item.name}
                variant="contained"
                component={Link}
                href={`/genre/${item.namekhongdau.replaceAll(" ", "-")}`}
                style={{ marginRight: "1em" }}
              >
                {item.name}
              </Button>
            ))}
          </Grid>
          {breakPointDescription ? (
            <Typography variant="h4" style={{ marginBottom: "10px" }}>
              {description}
            </Typography>
          ) : (
            <Typography variant="body1" style={{ marginBottom: "10px" }}>
              {description}
            </Typography>
          )}
        </Grid>
        <Hidden xsDown>
          <Grid item className={classes.photo}>
            <Image width={300} height={450} src={avatar} />
          </Grid>
        </Hidden>
      </Grid>
      <Grid
        item
        container
        className={classes.Chuong}
        alignItems="center"
        direction="column"
        justifyContent="center"
      >
        {titleListChuongLon ? (
          <Typography
            variant="h2"
            color="secondary"
            style={{ marginBottom: "1em" }}
          >
            Danh sách chương
          </Typography>
        ) : (
          <></>
        )}
        {titleListChuongTrungBinh ? (
          <Typography
            variant="h4"
            color="secondary"
            style={{ marginBottom: "1em" }}
          >
            Danh sách chương
          </Typography>
        ) : (
          <></>
        )}
        {titleListChuongnho ? (
          <Typography
            variant="caption"
            color="secondary"
            style={{ marginBottom: "1em" }}
          >
            Danh sách chương
          </Typography>
        ) : (
          <></>
        )}
        <Grid container direction="row" justifyContent="space-between">
          <Grid item container className={classes.listChuong}>
            {arr &&
              arr.map((value, idx) => (
                <Grid
                  item
                  key={idx}
                  className={classes.itemChuong}
                  style={{
                    borderColor: auth.checkedBackground
                      ? "blueviolet"
                      : "whitesmoke",
                  }}
                >
                  {chuong.map((item, index) =>
                    index >= value.start && index <= value.end ? (
                      <Typography
                        variant="caption"
                        key={index}
                        component={Link}
                        href={`/truyen-tranh/${removeVietnameseTones(
                          name
                        ).replaceAll(" ", "-")}/chap-${index}`}
                        style={{
                          borderColor: auth.checkedBackground
                            ? "blueviolet"
                            : "whitesmoke",
                        }}
                        className={classes.linkChap}
                      >
                        {item.name}
                      </Typography>
                    ) : (
                      <React.Fragment key={index}></React.Fragment>
                    )
                  )}
                </Grid>
              ))}
          </Grid>
          <Hidden xsDown>
            <Grid item className={classes.tabMostView}>
              <TabMostView views={props.views} />
            </Grid>
          </Hidden>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default Index;

export async function getStaticPaths() {
  const truyen = await prisma.truyen.findMany({
    select: {
      namevn: true,
    },
  });

  const paths = truyen.map((post) => ({
    params: { nameTruyen: post.namevn.replaceAll(" ", "-") },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const name = params.nameTruyen.replaceAll("-", " ");
  const tenTruyen = await prisma.truyen.findMany({
    where: {
      namevn: name,
    },
    include: {
      theloai: {
        select: {
          name: true,
          namekhongdau: true,
        },
      },
      soChuong: {
        select: {
          id: true,
          name: true,
          truyenId: true,
        },
        orderBy: {
          create_at: "asc",
        },
      },
    },
  });
  const views = await prisma.truyen.findMany({
    take: 10,
    where: {
      view: {
        gt: 0,
      },
    },
    select: {
      tentruyen: true,
      namevn: true,
      view: true,
    },
    orderBy: {
      view: "desc",
    },
  });

  return {
    props: {
      chuong: tenTruyen[0].soChuong,
      name: tenTruyen[0].tentruyen,
      description: tenTruyen[0].description,
      avatar: tenTruyen[0].avatar,
      theloai: tenTruyen[0].theloai,
      views,
    }, // will be passed to the page component as props
  };
}
