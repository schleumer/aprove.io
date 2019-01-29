import React from "react";

import Context from "./context";

export interface Props {
    definition: any;
}

class Application extends React.Component<Props> {
    public render() {
        return (
            <Context.Provider value={this.props.definition}>
                {this.props.children}
            </Context.Provider>
        );
    }
}

export default Application;
