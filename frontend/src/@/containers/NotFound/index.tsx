import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Heading } from '@/components/core';
import messages from './messages';

export default function NotFound() {
  return (
    <div>
      <Heading>
        <FormattedMessage {...messages.header} />
      </Heading>
    </div>
  );
}
