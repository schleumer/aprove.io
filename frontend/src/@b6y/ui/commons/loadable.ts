import Loadable from "react-loadable";

import LoadingIndicator from "../../core/LoadingIndicator";

export default (promise) =>
  Loadable({
    loader: () => {
      return promise().catch((ex) => {
        console.trace(ex);
        throw ex;
      });
    },
    loading: LoadingIndicator,
  });
