import { Portal } from "@/components/core";
import ScrollController from "@/components/core/ScrollController";
import React from "react";

interface Props {}

export class ScrollKitchenSink extends React.Component<Props> {
  public render() {
    return (
      <ScrollController name="ks1" x={true} y={true} height={500} width={500}>
        <div style={{ width: 1000, height: 1000, backgroundColor: "green" }}>
          <Portal
            visible={true}
            content={<div style={{ width: 250, height: 50, backgroundColor: "black" }}>Ok</div>}
            reference={<b>reference</b>}
          />
        </div>
        <ScrollController name="ks2" x={true} y={true} height={500} width={500}>
          <div style={{ width: 1000, height: 1000, backgroundColor: "red", marginLeft: 50 }}/>
          <ScrollController name="ks3" x={true} y={true} height={500} width={500}>
            <div style={{ width: 1000, height: 1000, backgroundColor: "blue", marginLeft: 100 }}/>
          </ScrollController>
        </ScrollController>
      </ScrollController>
    );
  }
}

export default ScrollKitchenSink;
