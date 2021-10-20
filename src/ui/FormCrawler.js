import { useMutation } from "@apollo/client";
import {
  Button,
  CircularProgress,
  FormControlLabel,
  Grid,
  makeStyles,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useState } from "react";
import {
  CREATE_CHUONG_WITH_ADMIN,
  GET_LIST_CHUONG_FROM_LINK_TRUYEN,
  HANDLE_REFRESH_TOKEN,
} from "../../graphql/client/mutation";

const useStyles = makeStyles((theme) => ({
  styleGroup: {
    width: "100%",
  },
  styleLabelRadio: {
    width: "100%",
  },
  labelStyle: {
    width: "100%",
    height: 64,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    "& .Mui-disabled": {
      backgroundColor: "#d3d3d359",
    },
  },
  styleOne: {
    marginLeft: "5px",
  },
}));

const LabelRadio = (props) => {
  const { title, url, disabled, idTruyen } = props;
  const [chuong, { loading }] = useMutation(CREATE_CHUONG_WITH_ADMIN);
  const [refreshToken] = useMutation(HANDLE_REFRESH_TOKEN);
  const classes = useStyles();
  const postChuong = async () => {
    try {
      await chuong({
        variables: {
          linkChuong: url,
          title: title,
          idTruyen: idTruyen,
        },
      });
    } catch (error) {
      if (error.message === "Token expired") {
        refreshToken().then(async (result) => {
          if (result.data?.refreshToken?.token) {
            const storeData = JSON.parse(localStorage.getItem("RFAC"));
            const payloadStorage = {
              name: storeData.name,
              role: storeData.role,
            };
            localStorage.removeItem("RFAC");
            payloadStorage["web_auth"] = result.data?.refreshToken?.token;
            localStorage.setItem("RFAC", JSON.stringify(payloadStorage));
            const storeData_ = localStorage.getItem("RFAC");

            if (storeData_) {
              try {
                await chuong({
                  variables: {
                    linkChuong: url,
                    title: title,
                    idTruyen: idTruyen,
                  },
                });
              } catch (error) {
                console.log({ error });
              }
            }
          }
        });
      }
    }
  };
  return (
    <>
      <a href={url} target="_blank" style={{ textDecoration: "none" }}>
        {title}
      </a>
      <Button variant="contained" disabled={disabled} onClick={postChuong}>
        create
        {loading && (
          <span className={classes.styleOne}>
            <CircularProgress color="secondary" />
          </span>
        )}
      </Button>
    </>
  );
};

const FormCrawler = (props) => {
  const { idTruyen } = props;
  const [crawLink, { loading }] = useMutation(GET_LIST_CHUONG_FROM_LINK_TRUYEN);
  const [link, setLink] = useState();
  const [urls, setUrls] = useState();
  const [titles, setTitles] = useState();
  const [show, setShow] = useState(false);
  const [value, setValue] = useState();
  const [disabled, setDisbled] = useState(false);
  const classes = useStyles();

  const clickCraw = async () => {
    try {
      const list = await crawLink({
        variables: {
          link,
        },
      });
      if (list.data) {
        setTitles(list.data.getListChuongFromLinkTruyen.titles.reverse());
        setValue(list.data.getListChuongFromLinkTruyen.titles[0]);
        setUrls(list.data.getListChuongFromLinkTruyen.urls.reverse());
        setShow(true);
      }
    } catch (error) {
      console.log({ error });
    }
  };

  const handleChangeRadio = (e) => {
    setValue(e.target.value);
    setDisbled(true);
  };

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      direction="column"
    >
      <TextField
        id="standard-full-width"
        label="Nhập link truyện"
        style={{ margin: 8 }}
        placeholder="Enter here"
        fullWidth
        margin="normal"
        InputLabelProps={{
          shrink: true,
        }}
        value={link}
        onChange={(e) => setLink(e.target.value)}
      />

      <Button variant="contained" onClick={clickCraw}>
        craw
        {loading && (
          <span>
            <CircularProgress />
          </span>
        )}
      </Button>
      {show === true && titles && urls ? (
        <Grid item container>
          {/* <Typography>{titles[192]}</Typography> */}
          <RadioGroup
            onChange={handleChangeRadio}
            value={value}
            className={classes.styleGroup}
          >
            {titles.map((item, idx) => (
              <FormControlLabel
                className={classes.styleLabelRadio}
                classes={{ label: classes.labelStyle }}
                value={titles[idx]}
                control={<Radio />}
                label={
                  <LabelRadio
                    title={titles[idx]}
                    url={urls[idx]}
                    disabled={value === titles[idx] ? false : true}
                    idTruyen={idTruyen}
                  />
                }
                key={idx}
              />
            ))}
          </RadioGroup>
        </Grid>
      ) : (
        <></>
      )}
    </Grid>
  );
};

export default FormCrawler;
