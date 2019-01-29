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

  const phone = value.replace(/([0-9]{2})([0-9]{4,5})([0-9]{4})/, "($1) $2-$3");

  return <span>{phone}</span>;
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
