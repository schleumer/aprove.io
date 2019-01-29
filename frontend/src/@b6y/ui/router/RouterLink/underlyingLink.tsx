/**
 * Extracted from `react-router`'s Link
 */

import styled from "@emotion/styled";
import { createLocation } from "history";
import invariant from "invariant";
import PropTypes from "prop-types";
import React from "react";
import { LinkProps } from "react-router-dom";

const isModifiedEvent = (event) =>
  !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);

const Anchor = styled.a``;

/**
 * The public API for rendering a history-aware <a>.
 */
class Link extends React.Component<LinkProps> {
  public static propTypes = {
    onClick: PropTypes.func,
    target: PropTypes.string,
    replace: PropTypes.bool,
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
    innerRef: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
  };

  public static defaultProps = {
    replace: false,
  };

  public static contextTypes = {
    router: PropTypes.shape({
      history: PropTypes.shape({
        push: PropTypes.func.isRequired,
        replace: PropTypes.func.isRequired,
        createHref: PropTypes.func.isRequired,
      }).isRequired,
    }).isRequired,
  };

  public handleClick = (event) => {
    if (this.props.onClick) { this.props.onClick(event); }

    if (
      !event.defaultPrevented && // onClick prevented default
      event.button === 0 && // ignore everything but left clicks
      !this.props.target && // let browser handle "target=_blank" etc.
      !isModifiedEvent(event) // ignore clicks with modifier keys
    ) {
      event.preventDefault();

      const { history } = this.context.router;
      const { replace, to } = this.props;

      if (replace) {
        history.replace(to);
      } else {
        history.push(to);
      }
    }
  }

  public render() {
    const { replace, to, innerRef, css, ...props } = this.props; // eslint-disable-line no-unused-vars

    invariant(
      this.context.router,
      "You should not use <Link> outside a <Router>",
    );

    invariant(to !== undefined, 'You must specify the "to" property');

    const { history } = this.context.router;
    const location =
      typeof to === "string"
        ? createLocation(to, null, null, history.location)
        : to;

    const href = history.createHref(location);
    return (
      <Anchor {...props} onClick={this.handleClick} href={href} ref={innerRef} />
    );
  }
}

export default Link;
