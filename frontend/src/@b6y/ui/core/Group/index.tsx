import styled from "@emotion/styled";
import { theme } from "styled-tools";

import { Flex } from "../../styled";

const radii = theme("radii.2", 4);

export const Group = styled(Flex)`
  & > button {
    margin-left: -1px;
    border-radius: 0;
  }

  & > button:first-of-type {
    border-radius: ${radii}rem 0 0 ${radii}rem;
  }

  & > button:last-child {
    border-radius: 0 ${radii}rem ${radii}rem 0;
  }

  & > button:hover,
  & > button:focus {
    z-index: 1;
    position: relative;
  }
`;

Group.displayName = "Group";

export default Group;
