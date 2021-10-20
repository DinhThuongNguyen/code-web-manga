import { useEffect, useState } from "react";
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });
import 'react-quill/dist/quill.snow.css';
import { Button, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  formEditor: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center"
  }
}));

function Editor(props) {
  const {idTruyen} = props;
  useEffect(() => {
    console.log(idTruyen);
  }, [])
  const classes = useStyles();
    const [value, setValue] = useState('');
    const submit = (e) => {
      e.preventDefault();
      console.log(value);
    }
    return(
       <div className={classes.formEditor}>
         <ReactQuill value={value} onChange={setValue}/>
         <Button onClick={submit} variant="contained" style={{marginTop: "2em"}}>submit</Button>
       </div>
    )
}

export default Editor;