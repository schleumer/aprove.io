import messages from "@/messages/breadcrumbs";

import defineBreadcrumbs from "@/utils/defineBreadcrumbs";

export default defineBreadcrumbs({
  list: [
    {
      id: "home",
      name: messages.home,
      path: "/",
    },
    {
      id: "customers",
      name: messages.customers,
      path: "/customers",
    },
  ],
  view: [
    {
      id: "home",
      name: messages.home,
      path: "/",
    },
    {
      id: "customers",
      name: messages.customers,
      path: "/customers",
    },
  ],
});
