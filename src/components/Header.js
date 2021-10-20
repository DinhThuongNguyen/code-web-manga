import React, { useContext, useEffect, useRef, useState } from "react";
import {
  AppBar,
  Backdrop,
  Button,
  ClickAwayListener,
  Divider,
  Fade,
  Grid,
  Grow,
  Hidden,
  IconButton,
  InputBase,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  MenuList,
  Modal,
  Paper,
  Popper,
  Snackbar,
  SwipeableDrawer,
  Tab,
  Typography,
  useMediaQuery,
  useTheme,
  makeStyles,
  withStyles,
  Box,
} from "@material-ui/core";
import MenuGenre from "@material-ui/core/Menu";
import clsx from "clsx";
// import { makeStyles } from "@material-ui/styles";
import {
  AccountBox,
  Menu,
  NavigateBefore,
  NavigateNext,
  Notifications,
  Search,
} from "@material-ui/icons";
import { TabContext, TabList } from "@material-ui/lab";
import Slider from "react-slick";
import Image from "next/image";
import AuthForm from "../ui/AuthForm";
import { AuthContext } from "../AuthHook/context";
import { withApollo } from "@apollo/client/react/hoc";
import Link from "../Link";
import { useRouter } from "next/router";
import { useMutation, useQuery } from "@apollo/client";
import { LOG_OUT } from "../../graphql/client/mutation";
import { GET_CONTENT_FOR_HEADER } from "../../graphql/client/queries";
import { removeVietnameseTones } from "../../util/locdau";

const useStyles = makeStyles((theme) => ({
  header: {
    position: "relative",
    background: "linear-gradient(#3f743f, #377037)",
    "&::before": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `url("/assets/pattren-top.png") 0 0 repeat-x`,
      zIndex: 0,
    },
  },
  bgColor: {
    backgroundColor: "#3f743f",
    // height: 64,
  },
  headerItemOne: {
    padding: "0 5em",
    margin: "0 auto",
    [theme.breakpoints.down("sm")]: {
      padding: "0 1em",
    },
  },
  changeBgAppBar: {
    backgroundColor: "#d2691ee6",
  },
  clxPaper: {
    padding: "2px 3px",
    display: "flex",
    alignItems: "center",
    width: 250,
    height: "60%",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  paperInputBase: {
    backgroundColor: "#2a241d",
  },
  paperInputBaseDark: {
    backgroundColor: "#323232",
  },
  clxInputBase: {
    color: "white",
    fontSize: "0.8em",
  },
  iconButtonSearch: {
    color: "white",
  },
  iconButtonSearchDark: {
    color: "white",
  },
  clxIconHeader: {
    backgroundColor: "#864a32",
    "&:hover": {
      backgroundColor: "#3a3a3a",
    },
  },
  paperTabList: {
    backgroundColor: "inherit",
  },
  toolbarMargin: {
    ...theme.mixins.toolbar,
    marginBottom: "2em",
    [theme.breakpoints.down("sm")]: {
      marginBottom: "1em",
      minHeight: 30,
    },
    [theme.breakpoints.down("xs")]: {
      marginBottom: "1em",
    },
  },
  slide: {
    width: "85%",
    margin: "1em 3em",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
  slider: {
    width: "100%",
    "& .slick-track": {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  },
  btnNext: {
    color: "blue",
    position: "absolute",
    right: 8,
    top: "50%",
    backgroundColor: "#00000061",
  },
  btnPrev: {
    color: "red",
    position: "absolute",
    left: 1,
    top: "50%",
    zIndex: 1,
    backgroundColor: "#00000061",
  },
  list: {
    width: 250,
    height: "100%",
    backgroundColor: "#ec6505e8",
  },
  fullList: {
    width: "auto",
  },
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  styleMuiListPadding: {
    padding: 0,
  },
  PaperBgColor: {
    backgroundColor: "black",
  },
  styleMenuItem: {
    color: theme.palette.common.orange,
    "&:hover": {
      backgroundColor: "#2b3022",
    },
  },
  styleMenuItemSlected: {
    backgroundColor: "rgb(0 0 0 / 80%)",
  },
  btnAccount: {
    color: "white",
    backgroundColor: "#2b3022",
  },
  textColorInherit: {
    color: "skyblue",
    "&:hover": {
      textDecoration: "none",
      backgroundColor: "#c5845e",
    },
  },
  navItem: {
    textDecoration: "none",
    "&:hover": {
      backgroundColor: "#ffa463e8",
      textDecoration: "none",
    },
    "& .MuiTypography-body1": {
      fontFamily: "Raleway",
      textTransform: "capitalize",
      fontWeight: 500,
      color: "#dde2e6",
    },
  },
  slideItem: {
    position: "relative",
  },
  title: {
    width: "100%",
    position: "absolute",
    height: "10%",
    bottom: 0,
    zIndex: 2,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#252627b8",
  },
  subMenu: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  menuGenre: {
    width: 400,
    backgroundColor: "#d88d6a",
  },
}));

const setUrlName = (name) => {
  const nameOne = removeVietnameseTones(name);
  return nameOne.replaceAll(" ", "-");
};

function ArrowNext(props) {
  const { onClick } = props;
  const classes = useStyles();
  return (
    <Hidden smDown>
      <IconButton onClick={onClick} className={classes.btnNext}>
        <NavigateNext />
      </IconButton>
    </Hidden>
  );
}
function ArrowPrev(props) {
  const { onClick } = props;
  const classes = useStyles();
  return (
    <Hidden smDown>
      <IconButton onClick={onClick} className={classes.btnPrev} color="primary">
        <NavigateBefore />
      </IconButton>
    </Hidden>
  );
}

const Header = (props) => {
  const { client } = props;
  const route = useRouter();
  // const theme = useTheme();
  // const queryMD = useMediaQuery(theme.breakpoints.down("md"));
  const classes = useStyles();
  const [valueTabList, setValueTabList] = useState("1");
  const [icon_menu, setIcon_menu] = useState(false);
  const [drawerRight, setDrawerRight] = useState(false);
  const [openMenuAccount, setOpenMenuAccount] = useState(false);
  const accountRef = useRef(null);
  const genreRef = useRef(null);
  const [openModal, setOpenModal] = useState(false);
  const [openGenre, setOpenGenre] = useState(false);
  const [valueSelected, setValueSelected] = useState(0);
  const auth = useContext(AuthContext);
  const [logout] = useMutation(LOG_OUT);
  const [stateSnackbar, setStateSnackbar] = useState({
    openSnackbar: false,
    vertical: "top",
    horizontal: "center",
  });
  const { vertical, horizontal, openSnackbar } = stateSnackbar;
  const { loading, error, data } = useQuery(GET_CONTENT_FOR_HEADER);

  const handleToggleGenre = (event) => {
    setOpenGenre((prevOpen) => !prevOpen);
  };

  const handleCloseGenre = (event) => {
    if (genreRef.current && genreRef.current.contains(event.target)) {
      return;
    }

    setOpenGenre(false);
  };

  function handleListKeyDownGenre(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpenGenre(false);
    }
  }

  const [listItemSelected, setListItemSelected] = useState(1);
  useEffect(() => {
    switch (route.pathname) {
      case "/":
        setListItemSelected(1);
        setValueTabList("1");
        break;
      case "/viet-nam":
        setListItemSelected(2);
        setValueTabList("2");
        break;
      case "/nhat-ban":
        setListItemSelected(3);
        setValueTabList("3");
        break;
      case "/trung-quoc":
        setListItemSelected(4);
        setValueTabList("4");
        break;
      case "/han-quoc":
        setListItemSelected(5);
        setValueTabList("5");
        break;
      case "/genre":
        setListItemSelected(6);
        setValueTabList("6");
        break;

      default:
        setListItemSelected(6);
        setValueTabList("6");
        break;
    }
  }, [route.pathname, loading]);

  const handleChangeTabList = (e, newValue) => {
    setValueTabList(newValue);
  };

  function scroolHeight() {
    if (window.scrollY > 40) {
      setIcon_menu(true);
    } else {
      setIcon_menu(false);
    }
  }

  useEffect(() => {
    window.addEventListener("scroll", scroolHeight, true);
  }, [auth.isLogin]);

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setDrawerRight(open);
  };

  const listNavMobile = [
    { name: "Trang chủ", href: "/" },
    { name: "Truyện Việt", href: "/viet-nam" },
    { name: "Truyện Nhật", href: "/nhat-ban" },
    { name: "Truyện Trung", href: "/trung-quoc" },
    { name: "Truyện Hàn", href: "/han-quoc" },
    { name: "Thể loại", href: "/genre" },
  ];
  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === "top" || anchor === "bottom",
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {listNavMobile.map((value, index) => (
          <ListItem
            key={index}
            component={Link}
            href={value.href}
            className={classes.navItem}
            selected={listItemSelected === index + 1}
            // onClick={hanleListItemClick}
          >
            <ListItemText primary={value.name} />
          </ListItem>
        ))}
      </List>
      <Divider />
    </div>
  );

  const settings = {
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    swipeToSlide: true,
    speed: 500,
    autoplaySpeed: 2000,
    pauseOnHover: true,
    dots: true,
    nextArrow: <ArrowNext />,
    prevArrow: <ArrowPrev />,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 300,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleToggleMenuAccount = () => {
    setOpenMenuAccount((prevOpen) => !prevOpen);
  };

  const handleCloseMenuAccount = (event) => {
    if (accountRef.current && accountRef.current.contains(event.target)) {
      return;
    }
    setOpenMenuAccount(false);
  };

  function handleListKeyDownMenuAccount(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpenMenuAccount(false);
    }
  }

  const handleCloseSnackbar = () => {
    setStateSnackbar({ ...stateSnackbar, openSnackbar: false });
  };
  const handleLogout = async () => {
    auth.logout();
    await logout();
    await client.resetStore();
    route.push("/");
  };

  return loading ? (
    <Grid container alignItems="center" justifyContent="center">
      <Typography variant="h2">LOADING</Typography>
    </Grid>
  ) : (
    <>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={openModal}
        onClose={handleCloseModal}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade open={openModal}>
          <AuthForm
            valueSelected={valueSelected}
            closeModal={handleCloseModal}
          />
        </Fade>
      </Modal>

      <Grid container style={{ backgroundColor: "inherit" }}>
        <Grid
          item
          container
          direction="column"
          style={{ backgroundColor: "inherit" }}
        >
          <AppBar
            position="fixed"
            classes={{ colorPrimary: classes.changeBgAppBar }}
          >
            <Grid
              container
              className={classes.headerItemOne}
              direction="row"
              justifyContent="space-between"
              wrap="nowrap"
            >
              <Hidden xsDown>
                <Grid
                  item
                  container
                  alignItems="center"
                  justifyContent="flex-start"
                  className={classes.fieldSearch}
                >
                  <Paper
                    component="form"
                    className={classes.clxPaper}
                    classes={{
                      root: classes.paperInputBase,
                    }}
                  >
                    <InputBase
                      className={classes.input}
                      placeholder="Nhap tim kiem"
                      classes={{ input: classes.clxInputBase }}
                    />
                    <IconButton
                      type="submit"
                      className={classes.iconButton}
                      aria-label="search"
                      classes={{
                        root: classes.iconButtonSearch,
                      }}
                    >
                      <Search color="inherit" />
                    </IconButton>
                  </Paper>
                </Grid>
              </Hidden>
              <Grid
                item
                container
                alignItems="center"
                justifyContent="center"
                direction="column"
              >
                <Typography variant="h5">MANGA VIETSUB</Typography>
                <Typography variant="caption">Cap nhat moi nhat</Typography>
              </Grid>

              <Grid
                item
                container
                direction="row"
                wrap="nowrap"
                alignItems="center"
                justifyContent="flex-end"
              >
                <Grid item>
                  <IconButton
                    color="inherit"
                    classes={{ root: classes.clxIconHeader }}
                  >
                    <Notifications />
                  </IconButton>
                </Grid>
                <Grid item style={{ marginLeft: "1em" }}>
                  {auth.isLogin ? (
                    <Button
                      ref={accountRef}
                      aria-controls={
                        openMenuAccount ? "menu-list-grow" : undefined
                      }
                      aria-haspopup="true"
                      onMouseOver={handleToggleMenuAccount}
                      className={classes.btnAccount}
                    >
                      {auth.name}
                    </Button>
                  ) : (
                    <IconButton
                      color="inherit"
                      classes={{ root: classes.clxIconHeader }}
                      ref={accountRef}
                      aria-controls={
                        openMenuAccount ? "menu-list-grow" : undefined
                      }
                      aria-haspopup="true"
                      onMouseOver={handleToggleMenuAccount}
                    >
                      <AccountBox />
                    </IconButton>
                  )}
                  <Popper
                    open={openMenuAccount}
                    anchorEl={accountRef.current}
                    role={undefined}
                    transition
                    disablePortal
                  >
                    {({ TransitionProps, placement }) => (
                      <Grow
                        {...TransitionProps}
                        style={{
                          transformOrigin:
                            placement === "bottom"
                              ? "center top"
                              : "center bottom",
                        }}
                      >
                        <Paper classes={{ root: classes.PaperBgColor }}>
                          <ClickAwayListener
                            onClickAway={handleCloseMenuAccount}
                          >
                            <MenuList
                              autoFocusItem={openMenuAccount}
                              id="menu-list-grow"
                              onKeyDown={handleListKeyDownMenuAccount}
                              onMouseLeave={handleCloseMenuAccount}
                              classes={{ padding: classes.styleMuiListPadding }}
                              autoFocusItem={true}
                            >
                              {!auth.isLogin && (
                                <MenuItem
                                  onClick={(e) => {
                                    handleCloseMenuAccount(e);
                                    handleOpenModal();
                                    setValueSelected(0);
                                  }}
                                  classes={{
                                    root: classes.styleMenuItem,
                                    selected: classes.styleMenuItemSlected,
                                  }}
                                >
                                  Đăng nhập
                                </MenuItem>
                              )}
                              {!auth.isLogin && (
                                <MenuItem
                                  onClick={(e) => {
                                    handleCloseMenuAccount(e);
                                    handleOpenModal();
                                    setValueSelected(1);
                                  }}
                                  classes={{
                                    root: classes.styleMenuItem,
                                    selected: classes.styleMenuItemSlected,
                                  }}
                                >
                                  Đăng ký
                                </MenuItem>
                              )}
                              {auth.isLogin && (
                                <MenuItem
                                  onClick={handleLogout}
                                  classes={{
                                    root: classes.styleMenuItem,
                                    selected: classes.styleMenuItemSlected,
                                  }}
                                >
                                  Đăng xuất
                                </MenuItem>
                              )}
                              {auth.role === "ADMIN" && (
                                <MenuItem
                                  classes={{
                                    root: classes.styleMenuItem,
                                    selected: classes.styleMenuItemSlected,
                                  }}
                                  component={Link}
                                  href="/create-truyen"
                                >
                                  Tạo truyện mới
                                </MenuItem>
                              )}
                              {auth.role === "AUTHOR" && (
                                <MenuItem
                                  classes={{
                                    root: classes.styleMenuItem,
                                    selected: classes.styleMenuItemSlected,
                                  }}
                                  component={Link}
                                  href="/create-truyen"
                                >
                                  Tạo truyện mới
                                </MenuItem>
                              )}
                              {["AUTHOR", "ADMIN"].includes(auth.role) && (
                                <MenuItem
                                  classes={{
                                    root: classes.styleMenuItem,
                                    selected: classes.styleMenuItemSlected,
                                  }}
                                  component={Link}
                                  href="/create-chuong"
                                >
                                  Tạo chương truyện
                                </MenuItem>
                              )}

                              {auth.role === "ADMIN" && (
                                <MenuItem
                                  classes={{
                                    root: classes.styleMenuItem,
                                    selected: classes.styleMenuItemSlected,
                                  }}
                                  component={Link}
                                  href="/admin"
                                >
                                  Quản trị page
                                </MenuItem>
                              )}
                            </MenuList>
                          </ClickAwayListener>
                        </Paper>
                      </Grow>
                    )}
                  </Popper>
                </Grid>
                {icon_menu ? (
                  <Hidden smDown>
                    <Grid item style={{ marginLeft: "1em" }}>
                      <IconButton
                        color="inherit"
                        classes={{ root: classes.clxIconHeader }}
                        onClick={() => setDrawerRight(true)}
                      >
                        <Menu />
                      </IconButton>
                    </Grid>
                  </Hidden>
                ) : (
                  <></>
                )}
                <Hidden mdUp>
                  <Grid item style={{ marginLeft: "1em" }}>
                    <IconButton
                      color="inherit"
                      classes={{ root: classes.clxIconHeader }}
                      onClick={() => setDrawerRight(true)}
                    >
                      <Menu />
                    </IconButton>
                  </Grid>
                </Hidden>
              </Grid>
            </Grid>
            {!icon_menu ? (
              <Hidden smDown>
                <Grid
                  container
                  className={classes.headerItemTwo}
                  alignItems="center"
                  justifyContent="center"
                >
                  <TabContext value={valueTabList}>
                    <Paper
                      classes={{ root: classes.paperTabList }}
                      elevation={0}
                    >
                      <TabList
                        onChange={handleChangeTabList}
                        aria-label="simple tabs example"
                      >
                        {listNavMobile.map((item, idx) =>
                          idx < 5 ? (
                            <Tab
                              key={idx}
                              label={item.name}
                              value={(idx + 1).toString()}
                              classes={{
                                textColorInherit: classes.textColorInherit,
                              }}
                              component={Link}
                              href={item.href}
                            />
                          ) : (
                            <Tab
                              key={idx}
                              label={item.name}
                              value={(idx + 1).toString()}
                              classes={{
                                textColorInherit: classes.textColorInherit,
                              }}
                              component={Link}
                              href={item.href}
                              ref={genreRef}
                              aria-controls={
                                openGenre ? "menu-list-genre" : undefined
                              }
                              aria-haspopup="true"
                              onMouseOver={handleToggleGenre}
                            />
                          )
                        )}
                      </TabList>
                      <Popper
                        open={openGenre}
                        anchorEl={genreRef.current}
                        role={undefined}
                        transition
                        disablePortal
                      >
                        {({ TransitionProps, placement }) => (
                          <Grow
                            {...TransitionProps}
                            style={{
                              transformOrigin:
                                placement === "bottom"
                                  ? "center top"
                                  : "center bottom",
                            }}
                          >
                            <Paper className={classes.menuGenre}>
                              <ClickAwayListener onClickAway={handleCloseGenre}>
                                <MenuList
                                  autoFocusItem={openGenre}
                                  id="menu-list-genre"
                                  onKeyDown={handleListKeyDownGenre}
                                  classes={{
                                    padding: classes.styleMuiListPadding,
                                  }}
                                >
                                  <MenuItem
                                    onClick={handleCloseGenre}
                                    className={classes.subMenu}
                                    onMouseLeave={handleCloseGenre}
                                  >
                                    {data.getContentForHeader.TheLoai.map(
                                      (item, idx) => (
                                        <Typography
                                          key={idx}
                                          component={Link}
                                          href={`/genre/${item.namekhongdau.replaceAll(
                                            " ",
                                            "-"
                                          )}`}
                                          color="textSecondary"
                                        >
                                          {item.name}
                                        </Typography>
                                      )
                                    )}
                                  </MenuItem>
                                </MenuList>
                              </ClickAwayListener>
                            </Paper>
                          </Grow>
                        )}
                      </Popper>
                    </Paper>
                  </TabContext>
                </Grid>
              </Hidden>
            ) : (
              <></>
            )}
          </AppBar>
          <div className={classes.toolbarMargin}></div>
          <Grid item container alignItems="flex-start" justifyContent="center">
            <Grid item className={classes.slide}>
              <Slider {...settings} className={classes.slider}>
                <div className={classes.slideItem}>
                  <Grid
                    container
                    component={Link}
                    href={`/truyen-tranh/${setUrlName(
                      data.getContentForHeader.truyen[0].tentruyen
                    )}`}
                  >
                    <Image
                      src={data.getContentForHeader.truyen[0].avatar}
                      width={350}
                      height={450}
                      alt="anh 1"
                    />
                    <span className={classes.title}>
                      <Typography variant="caption">
                        {data.getContentForHeader.truyen[0].tentruyen}
                      </Typography>
                    </span>
                  </Grid>
                </div>
                <div className={classes.slideItem}>
                  <Grid
                    container
                    component={Link}
                    href={`/truyen-tranh/${setUrlName(
                      data.getContentForHeader.truyen[1].tentruyen
                    )}`}
                  >
                    <Image
                      src={data.getContentForHeader.truyen[1].avatar}
                      width={350}
                      height={450}
                      alt="anh 1"
                    />
                    <span className={classes.title}>
                      <Typography variant="caption">
                        {data.getContentForHeader.truyen[1].tentruyen}
                      </Typography>
                    </span>
                  </Grid>
                </div>
                <div className={classes.slideItem}>
                  <Grid
                    container
                    component={Link}
                    href={`/truyen-tranh/${setUrlName(
                      data.getContentForHeader.truyen[2].tentruyen
                    )}`}
                  >
                    <Image
                      src={data.getContentForHeader.truyen[2].avatar}
                      width={350}
                      height={450}
                      alt="anh 1"
                    />
                    <span className={classes.title}>
                      <Typography variant="caption">
                        {data.getContentForHeader.truyen[2].tentruyen}
                      </Typography>
                    </span>
                  </Grid>
                </div>
                <div className={classes.slideItem}>
                  <Grid
                    container
                    component={Link}
                    href={`/truyen-tranh/${setUrlName(
                      data.getContentForHeader.truyen[3].tentruyen
                    )}`}
                  >
                    <Image
                      src={data.getContentForHeader.truyen[3].avatar}
                      width={350}
                      height={450}
                      alt="anh 1"
                    />
                    <span className={classes.title}>
                      <Typography variant="caption">
                        {data.getContentForHeader.truyen[3].tentruyen}
                      </Typography>
                    </span>
                  </Grid>
                </div>
                <div className={classes.slideItem}>
                  <Grid
                    container
                    component={Link}
                    href={`/truyen-tranh/${setUrlName(
                      data.getContentForHeader.truyen[4].tentruyen
                    )}`}
                  >
                    <Image
                      src={data.getContentForHeader.truyen[4].avatar}
                      width={350}
                      height={450}
                      alt="anh 1"
                    />
                    <span className={classes.title}>
                      <Typography variant="caption">
                        {data.getContentForHeader.truyen[4].tentruyen}
                      </Typography>
                    </span>
                  </Grid>
                </div>
                <div className={classes.slideItem}>
                  <Grid
                    container
                    component={Link}
                    href={`/truyen-tranh/${setUrlName(
                      data.getContentForHeader.truyen[5].tentruyen
                    )}`}
                  >
                    <Image
                      src={data.getContentForHeader.truyen[5].avatar}
                      width={350}
                      height={450}
                      alt="anh 1"
                    />
                    <span className={classes.title}>
                      <Typography variant="caption">
                        {data.getContentForHeader.truyen[5].tentruyen}
                      </Typography>
                    </span>
                  </Grid>
                </div>
              </Slider>
            </Grid>
          </Grid>
        </Grid>

        <SwipeableDrawer
          anchor={"right"}
          open={drawerRight}
          onClose={toggleDrawer("right", false)}
          onOpen={toggleDrawer("right", true)}
          className={classes.navMobile}
        >
          {list("right")}
        </SwipeableDrawer>
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          open={openSnackbar}
          onClose={handleCloseSnackbar}
          message="Đăng xuất thành công"
          key={vertical + horizontal}
        />
      </Grid>
    </>
  );
};

export default withApollo(Header);
