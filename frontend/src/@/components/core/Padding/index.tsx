import styled from "@emotion/styled";
import PropTypes from "prop-types";

import { Box } from "@/components/styled";
import { getSpace } from "@/components/styled/system";

const Padding = styled(Box)`
  display: flex;
  & > * {
    margin-right: ${(props) => getSpace(props.spacing)(props)};
  }
`;

Padding.propTypes = {
  spacing: PropTypes.oneOfType([PropTypes.number]),
};

Padding.defaultProps = {
  spacing: 2,
};

export default Padding;
