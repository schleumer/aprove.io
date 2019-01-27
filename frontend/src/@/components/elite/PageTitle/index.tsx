import styled from "@emotion/styled";
import React from "react";
import { FormattedMessage } from "react-intl";
import { theme } from "styled-tools";

import { getSpace } from "@/components/styled/system";

import { Box, Flex } from "@/components/styled";

import Icon from "@/components/core/Icon";
import RouterLink from "@/components/core/RouterLink";

const PageTitleWrapper = styled(Flex)((props) => {
  const nSpace = getSpace(-3)(props);
  const space = getSpace(3)(props);

  return {
    marginLeft: nSpace,
    marginRight: nSpace,
    marginTop: nSpace,
    backgroundColor: "white",
    padding: space,
    marginBottom: space,
  };
});

const TitleWraper = styled.h4((props) => {
  return {
    fontWeight: 300,
    fontSize: "18px",
    // minHeight: size.h,
    margin: "0",
    width: "100%",
    display: "flex",
    alignItems: "center",
  };
});

const ExtraWrapper = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
`;

const BreadcrumbSeparatorWrapper = styled(Box)(
  `
    margin-left: 8px;
    margin-right: 8px;
    font-weight: 100;
  `,
);

const BreadcrumbSeparator = () => (
  <BreadcrumbSeparatorWrapper color="darken">
    <Icon name="chevron-right" size={12} />
  </BreadcrumbSeparatorWrapper>
);

const StyledRouterLink = styled(RouterLink)`
  color: #212529;
  text-decoration: none;
`;

const BreadcrumbWrapper = styled(Box)`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  margin-right: 15px;
  font-size: 12px;
  ${StyledRouterLink}:last-of-type {
    color: ${theme("defaults.bg.primary")};
    font-weight: 500;
  }
`;

const breadcrumb = (values) => {
  if (!values || (values && values.length < 1)) {
    return null;
  }

  return values
    .map((value) => [
      value.id,
      <StyledRouterLink to={value.path} key={value.id}>
        <FormattedMessage values={value.values} {...value.name} />
      </StyledRouterLink>,
    ])
    .reduce(
      (prev, [id, curr]) => [
        ...prev,
        <BreadcrumbSeparator key={`${id}.sep`} />,
        curr,
      ],
      [],
    )
    .slice(1);
};

const PageTitle = (props) => (
  <PageTitleWrapper>
    <TitleWraper>
      {props.title}
    </TitleWraper>
    <BreadcrumbWrapper fontSize={1}>
      {breadcrumb(props.breadcrumb)}
    </BreadcrumbWrapper>
    <ExtraWrapper>{props.children}</ExtraWrapper>
  </PageTitleWrapper>
);

// PageTitle.propTypes = {
//   children: PropTypes.node,
//   title: PropTypes.node,
//   breadcrumb: PropTypes.arrayOf(
//     PropTypes.shape({
//       id: PropTypes.string.isRequired,
//       name: PropTypes.shape(FormattedMessage.propTypes),
//       path: PropTypes.string.isRequired,
//     }),
//   ),
// };

export default PageTitle;
