import React from "react";
import styled from "styled-components";

export const Grid = styled.div`
  display: flex;
  justify-content: start;
  flex-wrap: wrap;
`;

const GridItemWrapper = styled.div`
  flex: 0 0 25%;
  display: flex;
  justify-content: center;
  align-items: stretch;
  box-sizing: border-box;
  :before {
    content: "";
    display: table;
    padding-top: 100%;
  }
`;

export const GridItem = ({ forwardedRef, ...props }) => (
  <GridItemWrapper ref={forwardedRef} {...props} />
);