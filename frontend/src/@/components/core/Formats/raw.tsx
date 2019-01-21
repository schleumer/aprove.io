import React from "react";

import PropTypes from "prop-types";

const RawComponent = (props) => {
  const {
    input: { value },
    defaultValue,
  } = props;

  if (!value) {
    return <span>{defaultValue}</span>;
  }

  return <span>{value}</span>;
};

RawComponent.propTypes = {
  input: PropTypes.shape({
    value: PropTypes.string,
  }),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

RawComponent.defaultProps = {
  defaultValue: "Vázio",
};

export default RawComponent;
