import { getValue, translateSize } from "../../styled/system";
import Theme from "../../types/theme";
import { withTheme } from "emotion-theming";
import { FieldProps } from "formik";
import R from "ramda";
import React from "react";
import AsyncSelect from "react-select/lib/Async";
import { Adapter } from "./adapter";

import * as emotion from "emotion";

import { Styles as ReactSelectStyles } from "react-select/lib/styles";

const defaultSize = R.defaultTo(2);

const height = (size, theme) => {
  const translatedSize = translateSize(defaultSize(size));

  const padding: any = theme.rectangularPaddings[translatedSize];
  const fontSize: any = theme.fontSizes[translatedSize];

  return {
    fontSize: `${fontSize}rem`,
    lineHeight: `1.5`,
    padding: `${padding.y}rem ${padding.x}rem`,
    height: "auto",
    minHeight: "auto",
    maxHeight: "auto",
  };
};

const customStyles = (size, theme: Theme): ReactSelectStyles => ({
  input: (base) => ({
    ...base,
    label: "input",
    margin: 0,
    paddingTop: 0,
    paddingBottom: 0,
    background: theme.colors.white,
  }),
  group: (base) => ({
    ...base,
    label: "group",
  }),
  container: (base) => ({
    ...base,
    label: "container",
    background: "none",
    padding: 0,
  }),
  control: (base, state) => ({
    ...base,
    ...height(size, theme),
    "label": "control",
    "border": state.isFocused
      ? `1px solid ${theme.colors.cyan}`
      : `1px solid ${theme.colors.gray}`,
    "boxShadow": state.isFocused ? `0 0 0 3px ${theme.colors.alphacyan}` : "none",
    "borderRadius": getValue(theme.radii)(2),
    "background": theme.colors.white,
    "&:hover": {
      border: `1px solid ${theme.colors.cyan}`,
    },
  }),
  menuList: (base) => ({
    ...base,
    label: "menuList",
  }),
  menu: (base) => ({
    ...base,
    label: "menu",
    paddingBottom: 0,
    paddingTop: 0,
  }),
  loadingMessage: (base) => ({
    ...base,
    label: "loadingMessage",
  }),
  loadingIndicator: (base) => ({
    ...base,
    label: "loadingIndicator",
  }),
  indicatorSeparator: (base) => ({
    ...base,
    label: "indicatorSeparator",
    padding: 0,
    width: 0,
  }),
  indicatorsContainer: (base) => ({
    ...base,
    label: "indicatorsContainer",
  }),
  groupHeading: (base) => ({
    ...base,
    label: "groupHeading",
  }),
  dropdownIndicator: (base) => ({
    ...base,
    label: "dropdownIndicator",
    padding: 0,
    paddingLeft: 4,
    paddingRight: 0,
    margin: 0,
  }),
  clearIndicator: (base) => ({
    ...base,
    label: "clearIndicator",
    padding: 0,
    paddingLeft: 0,
    paddingRight: 4,
    margin: 0,
  }),
  multiValue: (base) => ({
    ...base,
    label: "multiValue",
  }),
  multiValueLabel: (base) => ({
    ...base,
    label: "multiValueLabel",
  }),
  multiValueRemove: (base) => ({
    ...base,
    label: "multiValueRemove",
  }),
  noOptionsMessage: (base) => ({
    ...base,
    label: "noOptionsMessage",
  }),
  option: (base) => ({
    ...base,
    label: "option",
  }),
  placeholder: (base) => ({
    ...base,
    label: "placeholder",
  }),
  singleValue: (base) => ({
    ...base,
    label: "singleValue",
  }),
  valueContainer: (base) => ({
    ...base,
    label: "valueContainer",
    padding: 0,
  }),
  menuPortal: (base) => ({
    ...base,
    label: "menuPortal",
    zIndex: 9999,
  }),
});

interface Props extends FieldProps {
  options: Adapter;
  theme: Theme;
  id: any;
  isClearable: boolean;
}

interface State {
  option: any;
  loading: boolean;
  value?: any;
}

const CustomOption = (props) => {
  const { children, className, cx, getStyles, isDisabled, isFocused, isSelected, innerRef, innerProps } = props;
  return (
    <div
      ref={innerRef}
      className={cx(
        emotion.css(getStyles("option", props)),
        {
          "option": true,
          "option--is-disabled": isDisabled,
          "option--is-focused": isFocused,
          "option--is-selected": isSelected,
        },
        className,
      )}
      {...innerProps}
    >
      {children}
    </div>
  );
};

const CustomDisplayOption = (props) => {
  const { children, className, cx, getStyles, isDisabled, innerProps } = props;
  return (
    <div
      className={cx(
        emotion.css(getStyles("singleValue", props)),
        {
          "single-value": true,
          "single-value--is-disabled": isDisabled,
        },
        className,
      )}
      {...innerProps}
    >
      {children}
    </div>
  );
};

const MenuList = (props) => {
  const { children, className, cx, getStyles, isMulti, innerRef } = props;
  return (
    <div
      className={cx(
        emotion.css(getStyles("menuList", props)),
        {
          "menu-list": true,
          "menu-list--is-multi": isMulti,
        },
        className,
      ) as string}
      ref={innerRef}
    >
      {children}
    </div>
  );
};

class SelectInput extends React.Component<Props, State> {
  // HAHA.
  public isMounted: boolean;

  constructor(props, context) {
    super(props, context);

    this.state = {
      option: null,
      value: null,
      loading: true,
    };

    this.onChange = this.onChange.bind(this);
    this.onBlur = this.onBlur.bind(this);
  }

  public setOption(value) {
    if (value !== null) {
      this.setState({ loading: true });

      const { options } = this.props;

      return options.single(value, this.props).then((res) => {
        if (this.isMounted) {
          this.setState({ value, option: res, loading: false });
        }

        return res;
      });
    } else {
      this.setState({ loading: false, option: null, value: null });

      return Promise.resolve(null);
    }
  }

  public componentDidMount() {
    this.isMounted = true;
    const { field } = this.props;

    if (R.isNil(field) || R.isNil(field.value)) {
      this.setOption(null);
    } else {
      this.setOption(field.value);
    }
  }

  public componentWillUnmount(): void {
    this.isMounted = false;
  }

  public componentWillReceiveProps(a) {
    const { field } = a;

    if (R.isNil(field) || R.isNil(field.value)) {
      this.setOption(null);
    } else {
      this.setOption(field.value);
    }
  }

  public onChange(value) {
    const { field, form } = this.props;

    this.setState({ value });

    if (R.isNil(value) || R.isNil(value.value)) {
      form.setFieldValue(field.name, null);
    } else {
      form.setFieldValue(field.name, value.value);
    }
  }

  public onBlur() {
    const { field, form } = this.props;

    form.setFieldTouched(field.name, true);
  }

  public render() {
    const portalDOM = document.getElementById("portal-target");

    const { field, options, theme, id, isClearable } = this.props;

    const { option, loading } = this.state;

    return (
      <div>
        <AsyncSelect
          components={{ Option: CustomOption, SingleValue: CustomDisplayOption, MenuList }}
          loadOptions={(text) => options.search(text, this.props)}
          defaultOptions={true}
          cacheOptions
          styles={customStyles(2, theme)}
          name={field.name}
          onChange={this.onChange}
          onBlur={this.onBlur}
          value={loading ? null : option}
          inputId={id}
          isClearable={isClearable}
          isSearchable={!loading}
          menuPortalTarget={portalDOM}
          isLoading={loading}
          isDisabled={loading}
          placeholder={loading ? "Carregando..." : "Selecione..."}
        />
      </div>
    );
  }
}

const ConfiguredSelectInput = withTheme(SelectInput);

const WrappedSelectInput = (props) => <ConfiguredSelectInput {...props} />;

export default WrappedSelectInput;
