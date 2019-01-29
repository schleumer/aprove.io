// TODO: types
import styled from "@emotion/styled";

import NavLink from "./underlyingNavLink";
import {
  alignSelf,
  borderColor,
  borderRadius,
  borders,
  color,
  flex,
  fontSize,
  order,
  space,
  width,
} from "../../styled/system";

const themed = (key) => (props) => props.theme[key];
const css = (props) => props.css;

const RouterLink = styled(NavLink)(
  space,
  width,
  fontSize,
  color,
  flex,
  order,
  alignSelf,
  borderRadius,
  borders,
  borderColor,
  themed("Link"),
  css,
);

RouterLink.defaultProps = {
  as: "a",
  color: "blue",
  tabIndex: 0,
  activeClassName: "__active",
};

export default RouterLink;
