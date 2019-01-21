import React from 'react';

import { DateTime } from 'luxon';
import { PropTypes } from '@/commons';

const DateTimeComponent = props => {
  const {
    input: { value },
    defaultValue,
  } = props;

  if (!value) {
    return <span>{defaultValue}</span>;
  }

  return (
    <span>
      {DateTime.fromISO(value).toLocaleString(DateTime.DATETIME_SHORT)}
    </span>
  );
};

DateTimeComponent.propTypes = {
  input: PropTypes.shape({
    value: PropTypes.string,
  }),
  defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

DateTimeComponent.defaultProps = {
  defaultValue: 'Vázio',
};

export default DateTimeComponent;
