import { Portal } from "@b6y/ui/core";
import ScrollController from "@b6y/ui/core/ScrollController";
import React from "react";

interface Props {
}

interface State {
  portal1Visible: boolean;
}

export class ScrollKitchenSink extends React.Component<Props, State> {
  public state = {
    portal1Visible: true,
  };

  public render() {
    return (
      <div style={{ marginTop: "133px", marginLeft: "233px" }}>
        <Portal
          span={30}
          visible={this.state.portal1Visible}
          onHide={() => this.setState({ portal1Visible: false })}
          content={<div style={{ width: 250, height: 50, backgroundColor: "black", color: "white" }}>PORTAL</div>}
          reference={<b>REFERENCE</b>}
        />
        <ScrollController name="ks1" x={true} y={true} height={500} width={500}>
          <div style={{ width: 1000, height: 1000, backgroundColor: "green", paddingTop: 133 }}>
            <Portal
              span={30}
              content={<div style={{ width: 250, height: 50, backgroundColor: "black", color: "white" }}>PORTAL</div>}
              reference={<b>REFERENCE</b>}
            />
          </div>
          <ScrollController name="ks2" x={true} y={true} height={500} width={500}>
            <div style={{ width: 1000, height: 1000, backgroundColor: "red", marginLeft: 50 }}>
              <Portal
                span={30}
                visible={this.state.portal1Visible}
                onHide={() => this.setState({ portal1Visible: false })}
                content={<div style={{ width: 250, height: 50, backgroundColor: "black", color: "white" }}>PORTAL</div>}
                reference={<b>REFERENCE</b>}
              />
            </div>
            <ScrollController name="ks3" x={true} y={true} height={500} width={500}>
              <div style={{ width: 1000, height: 1000, backgroundColor: "blue", marginLeft: 100 }}>
                <Portal
                  span={30}
                  visible={this.state.portal1Visible}
                  onHide={() => this.setState({ portal1Visible: false })}
                  content={<div style={{ width: 250, height: 50, backgroundColor: "black", color: "white" }}>PORTAL</div>}
                  reference={<b>REFERENCE</b>}
                />
              </div>
            </ScrollController>
          </ScrollController>
        </ScrollController>
      </div>
    );
  }
}

export default ScrollKitchenSink;
