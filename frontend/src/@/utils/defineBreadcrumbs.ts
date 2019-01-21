import * as intl from "react-intl";

interface Breadcrumb {
  id: string;
  name: string | intl.FormattedMessage.MessageDescriptor;
  path: string;
  values?: any;
}

interface Breadcrumbs {
  [key: string]: Breadcrumb[];
}

export default (definition: Breadcrumbs) => definition;
