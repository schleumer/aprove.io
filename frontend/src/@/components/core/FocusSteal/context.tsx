import React from "react";

import { FocusStealContext } from "./types";

export default React.createContext<FocusStealContext>({
  bus: null,
});
