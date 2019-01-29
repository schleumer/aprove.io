import styled from "@emotion/styled";
import PropTypes from "prop-types";

import { Box } from "../../styled";
import { getSpace } from "../../styled/system";

const Padding = styled(Box)`
  display: flex;
  flex-direction: ${(props) => props.inverse ? "row-reverse" : "row"};
  & > * {
    ${(props) => props.inverse ? "margin-left" : "margin-right"}: ${(props) => getSpace(props.spacing)(props)};
  }
`;

Padding.propTypes = {
  spacing: PropTypes.oneOfType([PropTypes.number]),
  inverse: PropTypes.bool,
};

Padding.defaultProps = {
  spacing: 2,
  inverse: false,
};

export default Padding;
