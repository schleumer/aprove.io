// TODO: types
import styled from "@emotion/styled";
import { theme } from "styled-tools";

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
  getRadii,
  getSpace,
} from "../../styled/system";
import NavLink from "./underlyingNavLink";

const themed = (key) => (props) => props.theme[key];
const cssProp = (props) => props.css;

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
  cssProp,
  (props) => ({
    ":focus": {
      outline: "none",
      position: "relative",
    },
    ":focus:before": {
      position: "absolute",
      content: "''",
      top: getSpace(-1)(props),
      left: getSpace(-1)(props),
      right: getSpace(-1)(props),
      bottom: getSpace(-1)(props),
      display: "block",
      boxShadow: `0px 0px 0px 3px ${theme(`colors.alphacyan`)(props)}`,
      borderRadius: getRadii(1)(props),
    },
  }),
);

RouterLink.defaultProps = {
  as: "a",
  color: "blue",
  tabIndex: 0,
  activeClassName: "__active",
};

export default RouterLink;
