import React from "react";

interface SectionProps {
  id: string;
  title: React.ReactNode;
  children: React.ReactNode;
}

interface SectionState {
  visible: boolean;
}

// DON'T EVER DO THAT ON PRODUCTION!!!
if (!window.__openedSections__) {
  window.__openedSections__ = {};
}

// <Section id="kitchensink.example" title="Section Example">
//   {() => (
//     <React.Fragment>
//       <div>Example</div>
//     </React.Fragment>
//   )}
// </Section>
export default class Section extends React.PureComponent<SectionProps, SectionState> {
  public state = {
    visible: !!window.__openedSections__[this.props.id],
  };

  constructor(props, context) {
    super(props, context);
  }

  public toggle() {
    const visible = !this.state.visible;
    this.setState((s) => ({ visible }));

    window.__openedSections__[this.props.id] = visible;
  }

  public render() {
    return (
      <div style={{ marginTop: 15, marginBottom: 15 }}>
        <div onClick={() => this.toggle()} style={{
          backgroundColor: "#ddd",
          padding: 10,
          borderRadius: 3,
          cursor: "pointer",
          position: "relative",
          zIndex: 2,
          userSelect: "none",
        }}>
          {this.props.title}
        </div>
        {this.state.visible && (
          <div style={{
            padding: 10,
            paddingTop: 15,
            backgroundColor: "#eee",
            borderRadius: 3,
            marginTop: -6,
            position: "relative",
            zIndex: 1,
            userSelect: "none",
          }}>
            {this.props.children}
          </div>
        )}
      </div>
    );
  }
}
