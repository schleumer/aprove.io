import styled from "@emotion/styled";
import PropTypes from "prop-types";
import React from "react";

interface WrapperProps {
  compact: boolean;
}

const Wrapper = styled.div<WrapperProps>`
  margin-bottom: ${({ compact }) => (compact ? "0px" : "15px")};
`;

const Label = styled.label`
  font-size: 12px;
  display: block;
  margin-bottom: 5px;
`;

const FormGroup = ({ label, children, compact }) => (
  <Wrapper compact={compact}>
    <Label>{label}</Label>
    {children}
  </Wrapper>
);

FormGroup.propTypes = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  children: PropTypes.element,
  compact: PropTypes.bool,
};

FormGroup.defaultProps = {
  compact: false,
};

export default FormGroup;
