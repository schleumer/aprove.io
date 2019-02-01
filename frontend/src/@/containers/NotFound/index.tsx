import React from "react";
import { FormattedMessage } from "react-intl";

import { Heading } from "@b6y/ui/styled";
import messages from "./messages";

export default function NotFound() {
  return (
    <div>
      <Heading>
        <FormattedMessage {...messages.header} />
      </Heading>
    </div>
  );
}
