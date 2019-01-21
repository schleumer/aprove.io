import R from "ramda";
import React from "react";

import { Box } from "@/components/styled";
import { Box as BoxType } from "@/components/styled/types";
import styled from "@emotion/styled";

interface State {
}

interface Props extends BoxType {
  name: string;
  x?: boolean;
  y?: boolean;
}

const StyledScrollController = styled(Box)<Props>`
overflow-x: ${(props) => props.x ? "auto" : "visible"};
overflow-y: ${(props) => props.y ? "auto" : "visible"};
`;

const omit = R.omit<string>(["name"]);

export const Context = React.createContext({
  bus: null,
  parents: [],
});

export default class ScrollController extends React.Component<Props, State> {
  public containerRef = React.createRef();

  constructor(props) {
    super(props);

    this.scrolled = this.scrolled.bind(this);
  }

  public componentDidMount(): void {
    const { current } = this.containerRef;

    if (current !== null && current instanceof HTMLElement) {
      current.addEventListener("scroll", this.scrolled);
    }
  }

  public componentWillUnmount(): void {
    const { current } = this.containerRef;

    console.log("unmonted", current);

    if (current !== null && current instanceof HTMLElement) {
      current.removeEventListener("scroll", this.scrolled);
    }
  }

  public scrolled(evt: UIEvent) {
    console.log(this, evt);
  }

  public render() {
    const safeProps = omit<Props>(this.props);

    return (
      <Context.Consumer>
        {(x) => {
          return (
            <Context.Provider value={{ ...x, parents: [...x.parents, this] }}>
              <StyledScrollController ref={this.containerRef} {...safeProps} />
            </Context.Provider>
          );
        }}
      </Context.Consumer>
    );
  }
}
