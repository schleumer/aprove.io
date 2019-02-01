import React from "react";
import { IntlProvider } from "react-intl";
import { connect } from "react-redux";
import { createSelector } from "reselect";

import { makeSelectLocale } from "./selectors";

interface IProps {
  locale: string;
  messages: any;
  children: React.ReactNode;
}

export class LanguageProvider extends React.PureComponent<IProps> {
  public render() {
    const { locale, messages, children } = this.props;

    return (
      <IntlProvider locale={locale} key={locale} messages={messages[locale]}>
        {React.Children.only(children)}
      </IntlProvider>
    );
  }
}

const mapStateToProps = createSelector(
  makeSelectLocale(),
  (locale) => ({ locale }),
);

export default connect(mapStateToProps)(LanguageProvider);
