import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  makeStyles,
  Radio,
  RadioGroup,
} from "@material-ui/core";
import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../src/AuthHook/context";
import AdminTruyenChu from "../src/components/AdminTruyenChu";
import AdminTruyenTranh from "../src/components/AdminTruyenTranh";
import AuthorTruyenChu from "../src/components/AuthorTruyenChu";
import AuthorTruyenTranh from "../src/components/AuthorTruyenTranh";

const useStyle = makeStyles((theme) => ({
  rootChuong: {
    width: "90%",
    backgroundColor: "#252525",
    padding: "1.5em",
  },
  styledItem: {
    marginBottom: "2em",
    display: "flex",
    justifyContent: "center",
  },
  formControl: {
    width: 400,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  rootRadioGroup: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  colorRadio: {
    color: "#3dee748a",
    "input:hover ~ &": {
      backgroundColor: "#ebf1f5",
    },
  },
}));

const createChuong = () => {
  const auth = useContext(AuthContext);
  const route = useRouter();
  const classes = useStyle();
  const [radioAuthor, setRadioAuthor] = useState();
  const [radioAdmin, setRadioAdmin] = useState();
  const [showChoose, setShowChoose] = useState(true);

  // useEffect(() => {
  //   if(!auth.isLogin){
  //     route.push("/");
  //   }
  // }, [auth])

  const handleChangeRdioAdmin = (e) => {
    setRadioAdmin(e.target.value);
    setShowChoose(false);
  };

  const handleChangeRdioAuthor = (e) => {
    setRadioAuthor(e.target.value);
    setShowChoose(false);
  };

  return (
    <Grid container alignItems="center" justifyContent="center">
      <Grid item container className={classes.rootChuong} direction="column">
        {showChoose ? (
          <Grid item className={classes.styledItem}>
            {auth.role === "ADMIN" && (
              <FormControl component="div" className={classes.formControl}>
                <FormLabel component="h3">Chọn hình thức truyện</FormLabel>
                <RadioGroup
                  aria-label="gender"
                  name="gender1"
                  value={radioAdmin}
                  onChange={handleChangeRdioAdmin}
                  classes={{ root: classes.rootRadioGroup }}
                >
                  <FormControlLabel
                    value="truyen tranh"
                    control={<Radio classes={{ root: classes.colorRadio }} />}
                    label="Truyện tranh"
                  />
                  <FormControlLabel
                    value="truyen chu"
                    control={<Radio classes={{ root: classes.colorRadio }} />}
                    label="Truyện chữ"
                  />
                </RadioGroup>
              </FormControl>
            )}
            {auth.role === "AUTHOR" && (
              <FormControl component="div" className={classes.formControl}>
                <FormLabel component="h2">Chọn hình thức truyện</FormLabel>
                <RadioGroup
                  aria-label="gender"
                  name="gender1"
                  value={radioAuthor}
                  onChange={handleChangeRdioAuthor}
                  classes={{ root: classes.rootRadioGroup }}
                >
                  <FormControlLabel
                    value="truyen tranh"
                    control={<Radio classes={{ root: classes.colorRadio }} />}
                    label="Truyện tranh"
                  />
                  <FormControlLabel
                    value="truyen chu"
                    control={<Radio classes={{ root: classes.colorRadio }} />}
                    label="Truyện chữ"
                  />
                </RadioGroup>
              </FormControl>
            )}
          </Grid>
        ) : (
          <></>
        )}
        <Grid item>
          {radioAdmin === "truyen tranh" && <AdminTruyenTranh />}
          {radioAdmin === "truyen chu" && <AdminTruyenChu />}
          {radioAuthor === "truyen tranh" && <AuthorTruyenTranh />}
          {radioAuthor === "truyen chu" && <AuthorTruyenChu />}
        </Grid>
      </Grid>
    </Grid>
  );
};

export default createChuong;

export async function getServerSideProps({ req }) {
  const role = req.cookies.role;
  if (!role || role === "USER") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }
  return {
    props: {}, // will be passed to the page component as props
  };
}
