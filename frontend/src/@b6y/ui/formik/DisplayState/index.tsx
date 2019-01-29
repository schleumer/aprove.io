import styled from "@emotion/styled";
import { connect as formikConnect } from "formik";
import R from "ramda";
import React from "react";

const DisplayFormikState = (props) => (
  <div style={{ margin: "1rem 0" }}>
    <h3 style={{ fontFamily: "monospace" }} />
    <pre
      style={{
        background: "#f6f8fa",
        fontSize: ".65rem",
        padding: ".5rem",
      }}
    >
      <strong>props</strong> ={" "}
      {JSON.stringify(
        R.dissocPath(["formik", "validationSchema"], props),
        null,
        2,
      )}
    </pre>
  </div>
);

DisplayFormikState.propTypes = {};

export default styled(formikConnect(DisplayFormikState))();
