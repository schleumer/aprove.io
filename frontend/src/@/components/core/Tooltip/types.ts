import React from "react";

export interface Props {
  children: React.ReactNode;
  position: string;
  text: React.ReactNode;
}

export interface State {
  visible: boolean;
  elTop: string | number;
  elLeft: string | number;
  translateTop: boolean;
  translateBottom: boolean;
  translateLeft: boolean;
  translateRight: boolean;
}
