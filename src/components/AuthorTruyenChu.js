import { useMutation } from "@apollo/client";
import {
  Button,
  FormControl,
  Grid,
  Input,
  InputAdornment,
  InputLabel,
  makeStyles,
  OutlinedInput,
  Typography,
} from "@material-ui/core";
import { ImportContacts } from "@material-ui/icons";
import React, { useState } from "react";
import { GET_ID_TRUYEN } from "../../graphql/client/mutation";
import TextEditor from "../ui/TextEditor";

const useStyles = makeStyles((theme) => ({
  formSearch: {
    width: "55%",
  },
  styleBorder: {
    borderColor: "#f4f4f4d1",
  },
  bgInput: {
    backgroundColor: "aliceblue",
  },
  bgInputLable: {
    backgroundColor: "aliceblue",
    fontSize: "1.5em",
  },
  btnSearch: {
    height: 80,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  editor: {
    width: "80%",
    "& .quill": {
      backgroundColor: "white",
      width: "100%",
    },
  },
  errorText: {
    color: "red",
    margin: "1em 0",
  },
}));

const AuthorTruyenChu = () => {
  const classes = useStyles();
  const [isFind, setIsFind] = useState(false);
  const [valueSearch, setValueSearch] = useState("");
  const [idTruyen, setIdTruyen] = useState();
  const [searchTruyen] = useMutation(GET_ID_TRUYEN);
  const [textError, setTextError] = useState("");

  const handleFindTruyen = async (e) => {
    e.preventDefault();
    try {
      const kq = await searchTruyen({
        variables: {
          name: valueSearch,
        },
      });
      if (kq) {
        setIdTruyen(kq.data.getIdTruyen.id);
        setIsFind(true);
        setTextError("")
      }
    } catch (error) {
      setTextError(error.message);
    }
  };

  return (
    <Grid
      container
      direction="column"
      alignItems="center"
      justifyContent="center"
    >
      <Grid item className={classes.formSearch}>
        <FormControl fullWidth className={classes.margin} variant="outlined">
          <InputLabel
            htmlFor="outlined-adornment-amount"
            classes={{ root: classes.bgInputLable }}
          >
            Nhập tên truyện
          </InputLabel>
          <OutlinedInput
            id="outlined-adornment-amount"
            value={valueSearch}
            onChange={(e) => {
              setValueSearch(e.target.value);
              setTextError("");
            }}
            startAdornment={
              <InputAdornment position="start">
                <ImportContacts />
              </InputAdornment>
            }
            labelWidth={60}
            classes={{
              notchedOutline: classes.styleBorder,
              adornedStart: classes.bgInput,
            }}
            disabled={isFind}
          />
          <div className={classes.btnSearch}>
            { textError.length > 0 && (
              <Typography variant="caption" className={classes.errorText}>
                {textError}
              </Typography>
            )}
            <Button
              onClick={handleFindTruyen}
              color="secondary"
              variant="outlined"
            >
              SEARCH
            </Button>
          </div>
        </FormControl>
      </Grid>
      {isFind && (
        <Grid item container alignItems="center" justifyContent="center">
          <Grid item className={classes.editor}>
            <TextEditor idTruyen={idTruyen} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default AuthorTruyenChu;
