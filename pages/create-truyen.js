import { useMutation, useQuery } from "@apollo/client";
import React, { useContext, useEffect, useState } from "react";
import { GET_ALL_THE_LOAI } from "../graphql/client/queries";
import { useRouter } from "next/router";
import { AuthContext } from "../src/AuthHook/context";
import {
  Backdrop,
  Button,
  Checkbox,
  Fade,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  Input,
  makeStyles,
  Modal,
  Radio,
  RadioGroup,
  TextareaAutosize,
  TextField,
  Typography,
} from "@material-ui/core";
import clsx from "clsx";
import Image from "next/image";
import axios from "axios";
import {
  CREATE_LOAI_TRUYEN,
  CREATE_TRUYEN,
  HANDLE_REFRESH_TOKEN,
} from "../graphql/client/mutation";
import styles from "../style/util.module.css";

const useStyles = makeStyles((theme) => ({
  styleTextDark: {
    color: "white",
  },
  styleTextLight: {
    color: "green",
  },
  styleContent: {
    width: "50%",
    backgroundColor: "azure",
    padding: "1em",
  },
  spanLightOne: {
    color: "black",
    fontSize: "1.3em",
    fontWeight: 400,
    width: "30%",
    textAlign: "left",
    display: "flex",
    alignItems: "flex-end",
  },
  spanLightTwo: {
    color: "black",
    fontSize: "1.3em",
    fontWeight: 400,
    width: "30%",
    textAlign: "left",
    display: "flex",
    alignItems: "center",
  },
  inputLight: {
    backgroundColor: "#cecece",
    color: "#100f0f",
    paddingLeft: 5,
    borderRadius: 2,
    width: "70%",
  },
  btnRadio: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  radioGroupDarkOne: {
    display: "flex",
    flexDirection: "row",
    width: "70%",
    justifyContent: "space-around",
    "& .MuiTypography-body1": {
      color: "black",
    },
  },
  radioGroupLightTwo: {
    display: "flex",
    flexDirection: "row",
    width: "70%",
    // justifyContent: "space-around",
    "& .MuiTypography-body1": {
      color: "black",
    },
  },
  rootRadio: {
    "&:hover": {
      backgroundColor: "#ea4f13",
    },
  },
  radioIconLight: {
    // backgroundColor: "black",
    width: 20,
    height: 20,
    borderRadius: "50%",
    boxShadow:
      "inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)",
    backgroundColor: "#f5f8fa",
    backgroundImage:
      "linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))",
    "$rootRadio.Mui-focusVisible &": {
      outline: "2px auto rgba(19,124,189,.6)",
      outlineOffset: 2,
    },
    "input:hover ~ &": {
      backgroundColor: "#ebf1f5",
    },
    "input:disabled ~ &": {
      boxShadow: "none",
      background: "rgba(206,217,224,.5)",
    },
  },
  radioIconDark: {
    backgroundColor: "white",
    width: 20,
    height: 20,
    borderRadius: "50%",
    boxShadow:
      "inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)",
    backgroundColor: "#f5f8fa",
    backgroundImage:
      "linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))",
    "$rootRadio.Mui-focusVisible &": {
      outline: "2px auto rgba(19,124,189,.6)",
      outlineOffset: 2,
    },
    "input:hover ~ &": {
      backgroundColor: "#ebf1f5",
    },
    "input:disabled ~ &": {
      boxShadow: "none",
      background: "rgba(206,217,224,.5)",
    },
  },
  checkedIcon: {
    backgroundColor: "#137cbd",
    backgroundImage:
      "linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))",
    "&:before": {
      display: "block",
      width: 20,
      height: 20,
      backgroundImage: "radial-gradient(#fff,#fff 28%,transparent 32%)",
      content: '""',
    },
    "input:hover ~ &": {
      backgroundColor: "#106ba3",
    },
  },
  checkboxFormControl: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
  },
  checkboxGroup: {
    width: "70%",
    display: "flex",
    flexDirection: "row",
    "& .MuiTypography-body1": {
      color: "black",
    },
  },
  center: {
    height: "100vh",
    background: "#000",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    width: "30%",
    backgroundColor: "#1d1d1de0",
    borderRadius: 5,
    height: 150,
  },
  textField: {
    backgroundColor: "#515151",
  },
  errortext: {
    color: "red",
  },
}));

function StyledRadio(props) {
  const classes = useStyles();
  const auth = useContext(AuthContext);

  return (
    <Radio
      className={classes.rootRadio}
      disableRipple
      color="default"
      checkedIcon={
        <span
          className={clsx(
            auth.checkedBackground
              ? classes.radioIconDark
              : classes.radioIconLight,
            classes.checkedIcon
          )}
        />
      }
      icon={
        <span
          className={
            auth.checkedBackground
              ? classes.radioIconLight
              : classes.radioIconDark
          }
        />
      }
      {...props}
    />
  );
}

const TaoTruyenMoi = (props) => {
  const classes = useStyles();
  const route = useRouter();
  const auth = useContext(AuthContext);
  const { loading, error, data } = useQuery(GET_ALL_THE_LOAI);
  const [theloai, setTheloai] = useState();
  const [valueTheLoai, setValueTheLoai] = useState();
  const [tentruyen, setTenTruyen] = useState("");
  const [description, setDescription] = useState("");
  const [hinhthuc, setHinhthuc] = useState("TruyenTranh");
  const [quocgia, setQuocGia] = useState("NhatBan");
  const [urlImage, setUrlImage] = useState("");
  const [create] = useMutation(CREATE_TRUYEN);
  const [refreshToken] = useMutation(HANDLE_REFRESH_TOKEN);
  const [open, setOpen] = useState(false);
  const [textTheLoai, setTextTheLoai] = useState("");
  const [textErrorTheLoai, setTextErrorTheLoai] = useState("");
  const [errorSubmit, setErrorSubmit] = useState();

  useEffect(() => {
    if (!loading && !error) {
      setTheloai(data.getTheLoai);
      const obj = {};
      data.getTheLoai.map((item) => {
        obj[item.id] = false;
      });
      setValueTheLoai(obj);
    }
  }, [loading]);

  const handleChangeHinhThucTruyen = (e) => {
    setHinhthuc(e.target.value);
  };
  const handleChangeQuocGia = (e) => {
    setQuocGia(e.target.value);
  };
  const checkboxHandleChange = (e) => {
    setValueTheLoai({ ...valueTheLoai, [e.target.name]: e.target.checked });
  };

  function disabledButton() {
    const trueOne = tentruyen.length > 0 ? true : false;
    const trueTwo = description.length > 0 ? true : false;
    // const trueFour = urlImage.length > 0 ? true : false;
    let trueThree = false;
    for (let item in valueTheLoai) {
      if (valueTheLoai[item] === true) {
        trueThree = true;
      }
    }
    // return trueOne * trueTwo * trueThree * trueFour === 1 ? false : true;
    return trueOne * trueTwo * trueThree === 1 ? false : true;
  }

  const handleFileChange = async (e) => {
    const [file] = e.target.files;
    if (!file) return;
    const data = new FormData();
    data.append("photo", file);
    try {
      const kq = await axios.post(
        "http://localhost:3000/api/photoManga",
        data,
        {
          headers: {
            "content-type": "multipart/form-data",
          },
        }
      );
      let src = kq.data?.data.replace("public", "");
      src = src.replace("\\", "/");
      setUrlImage(src.replace("\\", "/"));
    } catch (error) {
      console.log({ error });
    }
  };

  const submitTruyen = async () => {
    let arr = [];
    for (const i in valueTheLoai) {
      if (valueTheLoai[i]) {
        arr.push(i);
      }
    }
    try {
      const kq = await create({
        variables: {
          data: {
            tentruyen: tentruyen,
            description: description,
            avatar: urlImage,
            country: quocgia,
            loaitruyen: hinhthuc,
            theloai: arr,
          },
        },
      });
      console.log(kq);
    } catch (error) {
      if (error.message === "Token expired") {
        refreshToken()
          .then((result) => {
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
                const taotruyen = async () => {
                  try {
                    const truyen = await create({
                      variables: {
                        data: {
                          tentruyen: tentruyen,
                          description: description,
                          avatar: urlImage,
                          country: quocgia,
                          loaitruyen: hinhthuc,
                          theloai: arr,
                        },
                      },
                    });
                    if (truyen) route.push("/create-chuong");
                  } catch (error) {
                    console.log({ error });
                  }
                };
                taotruyen();
              }
            }
          })
          .catch((err) => {
            console.log({ err });
          });
      } else {
        setErrorSubmit(error.message);
      }
    }
  };

  const handleClose = async () => {
    setOpen(false);
  };
  const handleOpen = async () => {
    setOpen(true);
  };

  const [createLoaiTruyen] = useMutation(CREATE_LOAI_TRUYEN);
  const taoLoaiTruyen = async () => {
    try {
      const create = await createLoaiTruyen({
        variables: {
          name: textTheLoai,
        },
        refetchQueries: [{ query: GET_ALL_THE_LOAI }],
      });
      if (create) {
        handleClose();
      }
    } catch (error) {
      if (error.message === "Token expired") {
        refreshToken()
          .then((result) => {
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
                const taotheloai = async () => {
                  try {
                    const create_ = await createLoaiTruyen({
                      variables: {
                        name: textTheLoai,
                      },
                      refetchQueries: [{ query: GET_ALL_THE_LOAI }],
                    });
                    if (create_) {
                      handleClose();
                    }
                  } catch (error) {
                    setTextErrorTheLoai(error.message);
                  }
                };
                taotheloai();
              }
            }
          })
          .catch((err) => {
            setTextErrorTheLoai(err.message);
          });
      } else {
        setTextErrorTheLoai(error.message);
      }
    }
  };

  return loading ? (
    <Grid container alignItems="center" justifyContent="center">
      <Grid item className={classes.center}>
        <div className={styles.wave}></div>
        <div className={styles.wave}></div>
        <div className={styles.wave}></div>
        <div className={styles.wave}></div>
        <div className={styles.wave}></div>
        <div className={styles.wave}></div>
        <div className={styles.wave}></div>
        <div className={styles.wave}></div>
        <div className={styles.wave}></div>
        <div className={styles.wave}></div>
      </Grid>
    </Grid>
  ) : (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Typography
        variant="h2"
        className={
          auth.checkedBackground
            ? classes.styleTextLight
            : classes.styleTextDark
        }
      >
        Thêm truyện mới.
      </Typography>
      <Grid item container direction="column" className={classes.styleContent}>
        <Grid item style={{ marginBottom: "1em" }}>
          <Grid container>
            <span className={classes.spanLightOne}>Tên truyện</span>
            <Input
              value={tentruyen}
              onChange={(e) => setTenTruyen(e.target.value)}
              classes={{ root: classes.inputLight }}
              placeholder="Nhập tên truyện"
            />
          </Grid>
        </Grid>
        <Grid item style={{ marginBottom: "1em" }}>
          <Grid container>
            <span className={classes.spanLightOne}>Mô tả truyện</span>
            <TextareaAutosize
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              minRows={5}
              placeholder="Nhập mô tả truyện"
              className={classes.inputLight}
            />
          </Grid>
        </Grid>
        <Grid item style={{ marginBottom: "1em" }}>
          <Grid container>
            <FormControl classes={{ root: classes.btnRadio }}>
              <FormLabel component="span" className={classes.spanLightOne}>
                Hình thức truyện
              </FormLabel>
              <RadioGroup
                aria-label="gender"
                name="gender1"
                value={hinhthuc}
                onChange={handleChangeHinhThucTruyen}
                className={classes.radioGroupDarkOne}
              >
                <FormControlLabel
                  value="TruyenTranh"
                  control={<StyledRadio />}
                  label="Truyện tranh"
                />
                <FormControlLabel
                  value="truyenChu"
                  control={<StyledRadio />}
                  label="Truyện chữ"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
        <Grid item style={{ marginBottom: "1em" }}>
          <Grid container>
            <FormControl classes={{ root: classes.btnRadio }}>
              <FormLabel component="span" className={classes.spanLightTwo}>
                Quốc gia
              </FormLabel>
              <RadioGroup
                aria-label="gender"
                name="gender1"
                value={quocgia}
                onChange={handleChangeQuocGia}
                className={classes.radioGroupLightTwo}
              >
                <FormControlLabel
                  value="NhatBan"
                  control={<StyledRadio />}
                  label="Nhật Bản"
                />
                <FormControlLabel
                  value="VietNam"
                  control={<StyledRadio />}
                  label="Việt Nam"
                />
                <FormControlLabel
                  value="HanQuoc"
                  control={<StyledRadio />}
                  label="Hàn Quốc"
                />
                <FormControlLabel
                  value="TrungQuoc"
                  control={<StyledRadio />}
                  label="Trung Quốc"
                />
              </RadioGroup>
            </FormControl>
          </Grid>
        </Grid>
        <Grid item style={{ marginBottom: "1em" }}>
          <Grid container>
            <FormControl
              component="div"
              className={classes.checkboxFormControl}
            >
              <FormLabel component="span" className={classes.spanLightTwo}>
                Thể loại
              </FormLabel>
              <FormGroup className={classes.checkboxGroup}>
                {valueTheLoai &&
                  data.getTheLoai.map((item, idx) => (
                    <FormControlLabel
                      key={idx}
                      control={
                        <Checkbox
                          checked={valueTheLoai[item.id]}
                          onChange={checkboxHandleChange}
                          name={item.id}
                        />
                      }
                      label={item.name}
                    />
                  ))}
              </FormGroup>
            </FormControl>
          </Grid>
        </Grid>
        {auth.role === "ADMIN" && (
          <Grid item style={{ margin: "1em" }}>
            <Grid container justifyContent="center" alignItems="center">
              <Button variant="outlined" onClick={handleOpen} color="primary">
                Thêm thể loại truyện
              </Button>
            </Grid>
          </Grid>
        )}
        <Grid item style={{ marginBottom: "1em" }}>
          <Grid container direction="column" alignItems="center">
            <Grid item>
              <input
                type="file"
                name="photo"
                required
                onChange={handleFileChange}
                accept="image/*"
              />
            </Grid>
            <Grid item>
              {urlImage ? (
                <Image src={urlImage} height={200} width={300} />
              ) : (
                <></>
              )}
            </Grid>
          </Grid>
        </Grid>

        <Button
          color="primary"
          variant="contained"
          disabled={disabledButton()}
          onClick={submitTruyen}
        >
          Submit
        </Button>
        {errorSubmit && (
          <Typography variant="caption" className={classes.errortext}>
            {errorSubmit}
          </Typography>
        )}
      </Grid>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <Grid
              container
              alignItems="center"
              direction="column"
              justifyContent="space-around"
              style={{ height: "100%" }}
            >
              <Typography variant="h4">Tạo loại truyện</Typography>
              <TextField
                variant="standard"
                classes={{ root: classes.textField }}
                value={textTheLoai}
                onChange={(e) => setTextTheLoai(e.target.value)}
                onFocus={() => setTextTheLoai("")}
                placeholder="Nhập thể loại truyện"
              />
              {textErrorTheLoai.length > 0 && (
                <Typography variant="body1" className={classes.errortext}>
                  {textErrorTheLoai}
                </Typography>
              )}
              <Button
                variant="contained"
                color="secondary"
                onClick={taoLoaiTruyen}
              >
                Tạo
              </Button>
            </Grid>
          </div>
        </Fade>
      </Modal>
    </Grid>
  );
};

export default TaoTruyenMoi;

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
    props: { role }, // will be passed to the page component as props
  };
}

// đề cử, mới cập nhật, đã hoàn thành
