import styled from "@emotion/styled";
import PropTypes from "prop-types";

import { Box } from "../../styled";

import { getFontSize, getSpace } from "../../styled/system";

import { theme } from "styled-tools";

const TableRow = styled(Box.withComponent("tr"))``;

const TableColumn = styled(Box.withComponent("td"))`
font-size: ${getFontSize(1)};
padding: ${getSpace(2)};
border-top: 1px solid ${theme("colors.light")};
`;

TableColumn.defaultProps = {
  verticalAlign: "top",
};

const TableHeader = styled(Box.withComponent("th"))`
padding: ${getSpace(2)};
`;

const Table = styled(Box.withComponent("table"))`
  & > ${TableRow}:first-of-type > ${TableColumn} {
    border-top: none;
  }
`;

Table.propTypes = {
  spacing: PropTypes.oneOfType([PropTypes.number]),
};

Table.defaultProps = {
  spacing: 2,
  width: 1,
  mb: 3,
  fontSize: 0,
};

export { Table, TableRow, TableColumn, TableHeader };
