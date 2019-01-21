import styled from "@emotion/styled";
import React from "react";

interface ISvgIconProps extends React.SVGProps<SVGSVGElement> {
  mr?: number;
  ml?: number;
  /**
   * _N_o line-height fix _M_argin
   */
  nm?: boolean;
}
const SvgIcon = styled.svg<ISvgIconProps>`
  margin-right: ${({ mr }) => `${mr}px`};
  margin-left: ${({ ml }) => `${ml}px`};
  shape-rendering: geometricPrecision;
  margin-bottom: ${({nm}) => nm ? "0" : ".125rem"};
`;

interface IProps extends React.SVGProps<SVGSVGElement> {
  name: string;
  size?: number;
  mr?: number;
  ml?: number;
  nm?: boolean;
}

class Icon extends React.PureComponent<IProps> {
  public static defaultProps = {
    size: 16,
    mr: 0,
    ml: 0,
    nm: false,
  };

  public render() {
    const { props } = this;
    const { name, size } = props;

    return (
      <SvgIcon {...props} width={size} height={size}>
        <use xlinkHref={`#${name}`} />
      </SvgIcon>
    );
  }
}

export { SvgIcon };

export default Icon;
