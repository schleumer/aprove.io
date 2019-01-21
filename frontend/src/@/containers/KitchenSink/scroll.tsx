import ScrollController from "@/components/core/ScrollController";
import React from "react";

interface Props {}

export class ScrollKitchenSink extends React.Component<Props> {
  public render() {
    return (
      <ScrollController name="ks1" x={true} y={true} style={{ height: 500, width: 500 }}>
        <div style={{ width: 1000, height: 1000, backgroundColor: "green" }}></div>
        <ScrollController name="ks2" x={true} y={true} style={{ height: 500, width: 500 }}>
          <div style={{ width: 1000, height: 1000, backgroundColor: "red", marginLeft: 50 }}></div>
          <ScrollController name="ks3" x={true} y={true} style={{ height: 500, width: 500 }}>
            <div style={{ width: 1000, height: 1000, backgroundColor: "blue", marginLeft: 100 }}></div>
          </ScrollController>
        </ScrollController>
      </ScrollController>
    );
  }
}

export default ScrollKitchenSink;
