import { Grid, makeStyles, Typography } from "@material-ui/core";
import React from "react";
import Link from "../Link";

const useStyles = makeStyles((theme) => ({
  mostView: {
    paddingLeft: "1em",
  },
}));

const TabMostView = (props) => {
  const { views } = props;
  const classes = useStyles();

  return (
    <Grid container direction="column" className={classes.mostView}>
      <Grid
        item
        container
        alignItems="center"
        justifyContent="center"
        style={{ padding: "0 1em 1em 1em" }}
      >
        <Typography variant="h4" color="secondary">
          MOST VIEW
        </Typography>
      </Grid>
      <Grid item container direction="column">
        {views &&
          views.map((item, idx) => (
            <Typography
              component={Link}
              href={`/truyen-tranh/${item.namevn.replaceAll(" ", "-")}`}
              key={idx}
            >
              {`${item.tentruyen} ( ${item.view} lượt xem )`}
            </Typography>
          ))}
      </Grid>
    </Grid>
  );
};

export default TabMostView;
