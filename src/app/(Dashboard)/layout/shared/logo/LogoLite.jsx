import Link from "next/link";
import { Typography, styled } from "@mui/material";
import Image from "next/image";

const LinkStyled = styled(Link)(() => ({
  overflow: "hidden",
  display: "block",
}));

const LogoLite = () => {
  return (
    <LinkStyled style={{display:"flex",alignItems:'center'}} href="/">
      <img src="/images/logos/CM-Logo.svg" alt="logo" style={{height:"30px"}} priority />
      {/* <Typography variant="h4" sx={{color:"white"}}>Clay ERP</Typography> */}
    </LinkStyled>
  );
};

export default LogoLite;
