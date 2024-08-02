import React from "react";
import { useState } from "react";
// mui imports
import {
  ListItem,
  List,
  styled,
  ListItemText,
  useTheme,
  ListItemButton,
  Collapse,
} from "@mui/material";
import Link from "next/link";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

const NavItem = ({ Menuitems, pathDirect, onClick }) => {
  const theme = useTheme();
  const [isTrue, setIsTrue] = useState(false);

  const handleOnclick = () => {
    setIsTrue(!isTrue);
  };

  const [openSubMenu, setOpenSubMenu] = useState(false);

  const [openSubMenuIndex, setopenSubMenuIndex] = useState();

  const handleSubMenuToggle = (index) => {
    if (openSubMenuIndex === undefined) {
      setOpenSubMenu(!openSubMenu);
      if (!openSubMenu == true) {
        setopenSubMenuIndex(index);
      } else {
        setopenSubMenuIndex();
      }
    } else {
      if (openSubMenuIndex === index) {
        setOpenSubMenu(!openSubMenu);
        if (!openSubMenu == true) {
          setopenSubMenuIndex(index);
        } else {
          setopenSubMenuIndex();
        }
      } else {
        setopenSubMenuIndex(index);
      }
    }
  };

  const [openSubMenu2, setOpenSubMenu2] = useState(false);

  const [openSubMenuIndex2, setopenSubMenuIndex2] = useState();

  const handleSubMenuToggle2 = (index) => {
    if (openSubMenuIndex2 === undefined) {
      setOpenSubMenu2(!openSubMenu2);
      if (!openSubMenu2 == true) {
        setopenSubMenuIndex2(index);
      } else {
        setopenSubMenuIndex2();
      }
    } else {
      if (openSubMenuIndex2 === index) {
        setOpenSubMenu2(!openSubMenu2);
        if (!openSubMenu2 == true) {
          setopenSubMenuIndex2(index);
        } else {
          setopenSubMenuIndex2();
        }
      } else {
        setopenSubMenuIndex2(index);
      }
    }
  };

  return (
    <>
      {Menuitems.map((item, index) => (
        <List
          component="div"
          disablePadding
          key={item.id}
          className="menu_box_style"
          sx={item.id === openSubMenuIndex ? { backgroundColor: "white" } : {}}
        >
          <ListItem sx={{ padding: "0px", paddingBottom: "2px" }}>
            {item.submenu.length == 0 ? (
              <ListItemButton
                component={Link}
                href={item.href}
                disabled={item.disabled}
                selected={
                  pathDirect === item.href ||
                  item.related_path?.includes(pathDirect)
                }
                target={item.external ? "_blank" : ""}
                onClick={() => handleOnclick()}
                className="menubutton_style_2"
                style={{ padding: "6px 16px" }}
              >
                <picture className="display_flex">
                  <img
                    src={item.icon}
                    alt=""
                    style={{ objectFit: "cover", width: "25px" }}
                  />
                </picture>
                <ListItemText
                  style={{ marginLeft: "10px", marginBottom: "5px" }}
                >
                  <span
                    className="menu_font_style nunito_font_width"
                    style={{
                      fontWeight: 600,
                      fontSize: "15px",
                      color: "black",
                    }}
                  >
                    {item.title}
                  </span>
                </ListItemText>
              </ListItemButton>
            ) : (
              <ListItemButton
                disabled={item.disabled}
                target={item.external ? "_blank" : ""}
                onClick={() => handleSubMenuToggle(item.id)}
                className="menubutton_style_2"
                style={{ padding: "6px 16px" }}
              >
                <picture className="display_flex">
                  <img
                    src={item.icon}
                    alt=""
                    style={{ objectFit: "cover", width: "25px" }}
                  />
                </picture>
                <ListItemText
                  style={{ marginLeft: "10px", marginBottom: "5px" }}
                >
                  <span
                    className="menu_font_style nunito_font_width"
                    style={{
                      fontWeight: 600,
                      fontSize: "15px",
                      color: "black",
                    }}
                  >
                    {item.title}
                  </span>
                </ListItemText>
                {item.id != openSubMenuIndex ? (
                  <KeyboardArrowDownIcon
                    style={{ color: "black", fontSize: "20px" }}
                  />
                ) : (
                  <KeyboardArrowUpIcon
                    style={{ color: "black", fontSize: "20px" }}
                  />
                )}
              </ListItemButton>
            )}
          </ListItem>
          {item.submenu && item.id === openSubMenuIndex && (
            <Collapse in={openSubMenu} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.submenu.map((subItem, index2) => (
                  <div key={subItem.id}>
                    <ListItem style={{ padding: "0px", paddingBottom: "2px" }}>
                      {subItem.submenu2.length === 0 ? (
                        <ListItemButton
                          component={Link}
                          href={subItem.href}
                          disabled={subItem.disabled}
                          selected={pathDirect === subItem.href}
                          target={subItem.external ? "_blank" : ""}
                          onClick={() => handleOnclick(subItem.href)}
                          className="menubutton_style"
                          style={{ padding: "5px 15px" }}
                        >
                          <picture className="display_flex">
                            <img
                              src="/images/icons/point.svg"
                              alt=""
                              style={{ objectFit: "cover", width: "5px" }}
                            />
                          </picture>
                          <ListItemText>
                            <span
                              className="menu_font_style nunito_font_width display_full_width"
                              style={{
                                fontWeight: 600,
                                fontSize: "15px",
                                color: "black",
                                marginLeft: "27px",
                                textTransform: "capitalize",
                              }}
                            >
                              {subItem.title}
                            </span>
                          </ListItemText>
                        </ListItemButton>
                      ) : (
                        <ListItemButton
                          disabled={item.disabled}
                          target={item.external ? "_blank" : ""}
                          onClick={() => handleSubMenuToggle2(subItem.id)}
                          style={{ padding: "5px 15px" }}
                        >
                          <ListItemText>
                            <span
                              className="menu_font_style nunito_font_width display_full_width"
                              style={{
                                fontWeight: 600,
                                fontSize: "15px",
                                color: "black",
                                marginLeft: "27px",
                                textTransform: "capitalize",
                              }}
                            >
                              {subItem.title}
                            </span>
                          </ListItemText>
                          {subItem.id !== openSubMenuIndex2 ? (
                            <KeyboardArrowDownIcon
                              style={{ color: "black", fontSize: "20px" }}
                            />
                          ) : (
                            <KeyboardArrowUpIcon
                              style={{ color: "black", fontSize: "20px" }}
                            />
                          )}
                        </ListItemButton>
                      )}
                    </ListItem>
                    {subItem.submenu2 && subItem.id === openSubMenuIndex2 && (
                      <Collapse in={openSubMenu2} timeout="auto" unmountOnExit>
                        <List component="div" disablePadding>
                          {subItem.submenu2.map((subItem2) => (
                            <ListItem
                              key={subItem2.id}
                              style={{ padding: "0px", paddingBottom: "2px" }}
                            >
                              <ListItemButton
                                component={Link}
                                href={subItem2.href}
                                disabled={subItem2.disabled}
                                selected={pathDirect === subItem2.href}
                                target={subItem2.external ? "_blank" : ""}
                                onClick={() => handleOnclick(subItem2.href)}
                                style={{ padding: "3px 0px 3px 40px" }}
                              >
                                <ListItemText>
                                  <span
                                    className="menu_font_style nunito_font_width display_full_width"
                                    style={{
                                      fontWeight: 600,
                                      fontSize: "15px",
                                      color: "black",
                                      marginLeft: "27px",
                                      textTransform: "capitalize",
                                    }}
                                  >
                                    {subItem2.title}
                                  </span>
                                </ListItemText>
                              </ListItemButton>
                            </ListItem>
                          ))}
                        </List>
                      </Collapse>
                    )}
                  </div>
                ))}
              </List>
            </Collapse>
          )}
        </List>
      ))}
    </>
  );
};

export default NavItem;
