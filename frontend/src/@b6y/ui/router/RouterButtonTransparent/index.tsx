import styled from "@emotion/styled";

import ButtonTransparent from "../../core/ButtonTransparent";
import RouterLink from "../RouterLink";

const RouterButtonTransparent = styled(ButtonTransparent)();

RouterButtonTransparent.defaultProps = {
  as: RouterLink,
  textDecoration: "none",
  type: null,
};

export default RouterButtonTransparent;
