import React from "react";
import styled from "styled-components";

const Wrapper = styled.div` 
  display: flex;
  margin: 0 auto;
  background-color:black;
  justify-content: center;
  color: white;
`

const Layout = ({ children }) => {
  return <Wrapper>{children}</Wrapper>;
};

export default Layout;
