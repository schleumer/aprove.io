import styled from "@emotion/styled";

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

const css = (props) => props.css;

const MutedText = styled.span(
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
  css,
);

MutedText.defaultProps = {
  color: "gray",
};

export default MutedText;
