import { Grid, makeStyles, Typography } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles(theme => ({}));

const AuthorTruyenTranh = () => {
  const classes = useStyles();

  return (
    <Grid container>
      <Typography variant="h2">author truyen tranh</Typography>
    </Grid>
  )
}

export default AuthorTruyenTranh
