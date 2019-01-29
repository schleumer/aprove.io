import styled from "@emotion/styled";

import Button from "../../core/Button";
import RouterLink from "../RouterLink";

const ButtonLinkOutline = styled(Button)();

ButtonLinkOutline.defaultProps = {
  as: RouterLink,
  textDecoration: "none",
  type: null,
};

export default ButtonLinkOutline;
