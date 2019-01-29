import styled from "@emotion/styled";
import PropTypes from "prop-types";

import { Box } from "../../styled";
import { getSpace } from "../../styled/system";

const BoxGroup = styled(Box)`
  display: flex;
  margin-left: ${(props) => getSpace(-props.spacing)(props)};
  margin-right: ${(props) => getSpace(-props.spacing)(props)};
  & > * {
    padding-left: ${(props) => getSpace(props.spacing)(props)};
    padding-right: ${(props) => getSpace(props.spacing)(props)};
  }
`;

BoxGroup.propTypes = {
  spacing: PropTypes.oneOfType([PropTypes.number]),
};

BoxGroup.defaultProps = {
  spacing: 2,
};

export default BoxGroup;
