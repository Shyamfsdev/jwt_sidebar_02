import React from "react";
import { useState, useEffect, useRef } from "react";
import {
  ListItem,
  List,
  styled,
  ListItemText,
  useTheme,
  ListItemButton,
  Collapse,
  Menu,
  Typography,
  Divider,
} from "@mui/material";
import Link from "next/link";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useRouter } from "next/navigation";

const NavItem = ({ Menuitems, pathDirect, onClick }) => {
  const [isTrue, setIsTrue] = useState(false);
  const router = useRouter();
  const menuRef = useRef(null);

  const handleOnclick = () => {
    setIsTrue(!isTrue);
    setopenSubMenuData([]);
    setopenSubMenuIndex();
  };

  const [openSubMenu, setOpenSubMenu] = useState(false);

  const [openSubMenuIndex, setopenSubMenuIndex] = useState();

  const [openSubMenuData, setopenSubMenuData] = useState([]);

  const [anchorEl2, setAnchorEl2] = useState(null);

  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  const [topPosition, setTopPosition] = useState(0);

  const [fullPosition, setfullPosition] = useState(0);

  const [menuHeight, setMenuHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => {
      setfullPosition(window.innerHeight);
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  const handleSubMenuToggle = (e, index, item) => {
    const buttonTop = e.currentTarget.getBoundingClientRect().top;
    setAnchorEl2(e.currentTarget);
    setTopPosition(buttonTop);
    if (openSubMenuIndex === undefined) {
      setOpenSubMenu(!openSubMenu);
      if (!openSubMenu == true) {
        setopenSubMenuIndex(index);
        if (item.submenu.length !== 0) {
          setopenSubMenuData(item.submenu);
        } else {
          router.push(item.href);
        }
      } else {
        setopenSubMenuIndex();
      }
    } else {
      if (openSubMenuIndex === index) {
        setOpenSubMenu(!openSubMenu);
        if (!openSubMenu == true) {
          setopenSubMenuIndex(index);
          if (item.submenu.length !== 0) {
            setopenSubMenuData(item.submenu);
          } else {
            router.push(item.href);
          }
        } else {
          setopenSubMenuIndex();
        }
      } else {
        setopenSubMenuIndex(index);
        if (item.submenu.length !== 0) {
          setopenSubMenuData(item.submenu);
        } else {
          router.push(item.href);
        }
      }
    }
  };
  const topValue = topPosition.toFixed(0) - 40 + "px";

  return (
    <>
      {Menuitems.map((item, index) => (
        <List component="div" style={{ padding: "3px" }} key={item.id}>
          <ListItem style={{ padding: "0px", display: "contents" }}>
            <ListItemButton
              onClick={(e) => handleSubMenuToggle(e, index, item)}
              style={{ transition: "all 0.3s", padding: "0px" }}
              aria-controls={Boolean(anchorEl2) ? "msgs-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={Boolean(anchorEl2) ? "true" : undefined}
            >
              <div style={{ width: "100%" }}>
                <picture className="flex_display">
                  <img
                    src={item.icon}
                    alt=""
                    style={{ objectFit: "cover", width: "30px" }}
                  />
                </picture>
                <ListItemText
                  className="flex_display"
                  style={{
                    padding: "0px 10px",
                    borderBottom: "1px solid #dbdbdb",
                  }}
                >
                  <span
                    className="menu_font_style nunito_font_width"
                    style={{
                      fontWeight: 800,
                      fontSize: "9px",
                      color: "black",
                    }}
                  >
                    {item.title}
                  </span>
                </ListItemText>
              </div>
            </ListItemButton>
          </ListItem>
        </List>
      ))}
      {openSubMenuData.length !== 0 && (
        <Menu
          sx={{
            "& .MuiMenu-paper": {
              minWidth: "100px",
              boxShadow: "0px 4px 7px 0px #00000024 !important",
            },
          }}
          anchorEl={anchorEl2}
          id="account-menu"
          keepMounted
          open={Boolean(anchorEl2)}
          onClose={handleClose2}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              mt: 1.5,
              left: "96px !important",
              marginTop:'-50px',
              overflow: "auto",
              paddingBottom:'0px'
              // top: `${topValue} !important`,
              // "&::before": {
              //   content: '""',
              //   display: "block",
              //   position: "absolute",
              //   top: "50%",
              //   left: "-5px",
              //   width: 10,
              //   height: 10,
              //   bgcolor: "background.paper",
              //   transform: "translateY(-50%) rotate(45deg)",
              //   zIndex: 0,
              //   // top: `${topValue} !important`,
              // },
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          {openSubMenuData.map((subItem) => (
            <List sx={{ p: 0, fontSize: "12px" }} key={subItem.id}>
              <ListItemButton
                component={Link}
                to={subItem.href}
                disabled={subItem.disabled}
                selected={pathDirect === subItem.href}
                target={subItem.external ? "_blank" : ""}
                onClick={() => handleOnclick(subItem.href)}
                style={{ padding: "5px 15px" }}
              >
                <Typography variant="p">{subItem.title}</Typography>
              </ListItemButton>
              {/* <Divider /> */}
            </List>
          ))}
        </Menu>
      )}
    </>
  );
};

export default NavItem;
