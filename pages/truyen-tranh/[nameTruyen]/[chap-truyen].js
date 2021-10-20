import router, { useRouter } from "next/router";
import React, { useEffect } from "react";

const ChapTruyen = () => {
  const router = useRouter();
  // const {chap-truyen} = router.query();
  useEffect(() => {
    console.log(router.query["chap-truyen"]);
  }, [router]);
  return <div>chap truyen</div>;
};

export default ChapTruyen;
