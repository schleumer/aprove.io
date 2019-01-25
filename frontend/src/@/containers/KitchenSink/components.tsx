import { FastField, Field, Form, Formik, FormikProps } from "formik";
import React from "react";
import { Helmet } from "react-helmet";
import { connect } from "react-redux";
import { compose } from "redux";
import * as yup from "yup";

import { FormattedMessage } from "react-intl";

import {
  Box,
  BoxGroup,
  Button,
  ButtonOutline,
  ButtonTransparent,
  FakeTextInput,
  Flex,
  Group,
  Icon,
  TextInput,
} from "@/components/core";

import {
  PageBody,
  PageTitle,
} from "@/components/elite";

import { createStructuredSelector } from "reselect";

import {
  Channel,
  DatePickerInput as FormikDatePickerInput,
  DisplayState,
  ErrorBag,
  PhoneInput as FormikPhoneInput,
  SelectInput as FormikSelectInput,
  TextAreaInput as FormikTextAreaInput,
  TextInput as FormikTextInput,
} from "@/components/formik";

import breadcrumbMessages from "@/messages/breadcrumbs";
import { makeSelectAuth } from "@/root/selectors";
import injectReducer from "@/utils/injectReducer";
import messages from "./messages";
import reducer from "./reducer";
import Section from "./section";

import { AuthState } from "@/root/types";
import defineBreadcrumbs from "@/utils/defineBreadcrumbs";

import { ArrayOptions, RemoteGraphQLOptions } from "@/components/core/SelectInput/adapter";
import gql from "graphql-tag";

const customersOptions = new RemoteGraphQLOptions(
  (params) => ({
    query: gql`
      query ($request: CustomersRequest!) {
        result: customers(request: $request) {
          ${params.defaultFields.join("\n")}
          items {
            id
            code
            name
          }
        }
      }
    `,
    variables: {
      request: {
        page: params.page,
        limit: params.limit,
        search: {
          nameOp: {
            contains: params.text,
          },
        },
      },
    },
    transform: (item) => ({ label: item.name, value: item.id }),
  }),
  (params) => ({
    query: gql`
      query ($id: Long!) {
        result: customer(id: $id) {
          id
          code
          name
        }
      }
    `,
    variables: {
      id: params.id,
    },
    transform: (item) => ({ label: item.name, value: item.id }),
  }),
);

const testOptions = new ArrayOptions([
  { value: 0, label: "vázio", option: <b>vázio</b> },
  { value: 1, label: "top", option: <s>top</s> },
  { value: 2, label: "top2", option: <i>top2</i> },
]);

const breadcrumbs = defineBreadcrumbs({
  test: [
    {
      id: "home",
      name: breadcrumbMessages.home,
      path: "/",
    },
    {
      id: "test",
      name: breadcrumbMessages.test,
      path: "/kitchen-sink",
    },
  ],
});

const validationSchema = yup.object({
  test1: yup.number().nullable(true),
  test2: yup.string().required(),
  inexistentField: yup.string().required(),
});

interface FormProps extends FormikProps<any> {
  auth: AuthState;
}

interface FormState {
  testid: string;
}

class TestForm extends React.Component<FormProps, FormState> {
  public state = {
    testid: "test",
  };

  constructor(props) {
    super(props);

    this.changeId = this.changeId.bind(this);
  }

  public changeId() {
    if (this.state.testid === "test") {
      this.setState({ testid: "test2" });
    } else {
      this.setState({ testid: "test" });
    }
  }

  public render() {
    const { testid } = this.state;

    return (
      <Form>
        <Flex>
          <Box p={3} bg="white" borderColor="blue" border={1} width={1} mb={3}>
            <div>
              <hr/>
              <h4 style={{ marginTop: 0 }}>Form Example</h4>
              <ErrorBag mb={3}/>
              <ErrorBag field="inexistentField"/>
              <Section id="kitchensink.form.datePickerInputs" title="Date Picker Inputs">
                <Box mb={3}>
                  <Field
                    fieldId={testid}
                    label="DatePicker Label"
                    placeholder="DatePicker Placeholder"
                    component={FormikDatePickerInput}
                    name="test9"
                    debugId
                  />
                </Box>
                <Box mb={3}>
                  <Field
                    fieldId={testid}
                    label="DatePicker Label"
                    placeholder="DatePicker Placeholder"
                    component={FormikDatePickerInput}
                    name="test10"
                    debugId
                  />
                </Box>
              </Section>
              <Section id="kitchensink.form.textInputs" title="Text Inputs">
                <Box mb={3}>
                  <h5>Field(makes useless changes thus making useless rendering)</h5>
                  <Field
                    fieldId={testid}
                    label="TextInput Label"
                    placeholder="TextInput Placeholder"
                    component={FormikTextInput}
                    name="test2"
                    debugId
                  />
                </Box>
                <Box mb={3}>
                  <h5>FastField(may not update props from parent changes)</h5>
                  <FastField
                    fieldId={testid}
                    label="TextInput Label"
                    placeholder="TextInput Placeholder"
                    component={FormikTextInput}
                    name="test2"
                    debugId
                  />
                </Box>
                <Button state="info" type="button" onClick={this.changeId}>
                  change input id {testid}
                </Button>
              </Section>
              <Section id="kitchensink.form.select" title="Select and Remote Select Inputs">
                <Box mb={3} mt={3}>
                  <BoxGroup>
                    <Box width={1}>
                      <FastField
                        fieldId="select-test"
                        label="SelectInput Label"
                        placeholder="SelectInput Placeholder"
                        component={FormikSelectInput}
                        options={customersOptions}
                        name="test1"
                        debugId
                      />
                    </Box>
                    <Box width={1}>
                      <FastField
                        fieldId={testid}
                        label="TextInput Label"
                        placeholder="TextInput Placeholder"
                        component={FormikTextInput}
                        name="test2"
                        debugId
                      />
                    </Box>
                    <Box width={1}>
                      <FastField
                        fieldId="select5-test"
                        label="SelectInput Label"
                        placeholder="SelectInput Placeholder"
                        component={FormikSelectInput}
                        options={testOptions}
                        name="test5"
                        debugId
                      />
                    </Box>
                  </BoxGroup>
                </Box>
                <Box mb={3} mt={3}>
                  <FastField
                    fieldId="select2-test"
                    label="SelectInput Label"
                    placeholder="SelectInput Placeholder"
                    component={FormikSelectInput}
                    options={customersOptions}
                    name="test6"
                    debugId
                  />
                </Box>
                <Box mb={3}>
                  <FastField
                    fieldId="select3-test"
                    label="SelectInput Label"
                    placeholder="SelectInput Placeholder"
                    component={FormikSelectInput}
                    options={testOptions}
                    name="test3"
                    debugId
                  />
                </Box>
                <Box mb={3}>
                  <BoxGroup>
                    <Box width={1}>
                      <FastField
                        fieldId="select4-test"
                        label="SelectInput Label"
                        placeholder="SelectInput Placeholder"
                        component={FormikSelectInput}
                        options={testOptions}
                        name="test4"
                        debugId
                      />
                    </Box>
                    <Box width={1}>
                      <FastField
                        fieldId={testid}
                        label="TextInput Label"
                        placeholder="TextInput Placeholder"
                        component={FormikTextInput}
                        name="test2"
                        debugId
                      />
                    </Box>
                  </BoxGroup>
                </Box>
                <Box mb={3}>
                  <FastField
                    fieldId="select5-test"
                    label="SelectInput Label"
                    placeholder="SelectInput Placeholder"
                    component={FormikSelectInput}
                    options={testOptions}
                    name="test5"
                    debugId
                  />
                </Box>
              </Section>
              <Section id="kitchensink.form.phone" title="Phone Inputs">
                <Box mb={3}>
                  <BoxGroup>
                    <Box width={1}>
                      <FastField
                        fieldId="phone-test"
                        label="PhoneInput Label"
                        placeholder="PhoneInput Placeholder"
                        component={FormikPhoneInput}
                        name="test7"
                        debugId
                      />
                    </Box>
                    <Box width={1}>
                      <FastField
                        fieldId={testid}
                        label="TextInput Label"
                        placeholder="TextInput Placeholder"
                        component={FormikTextInput}
                        name="test2"
                        debugId
                      />
                    </Box>
                  </BoxGroup>
                </Box>
              </Section>
              <Section id="kitchensink.form.textArea" title="Textarea Inputs">
                <Box mb={3}>
                  <FastField
                    fieldId="text-area-test"
                    label="TextAreaInput Label"
                    placeholder="TextAreaInput Placeholder"
                    component={FormikTextAreaInput}
                    name="test8"
                    debugId
                  />
                </Box>
              </Section>
              <Section id="kitchensink.form.state" title="Form State">
                <DisplayState/>
              </Section>
            </div>
            <div style={{ textAlign: "right" }}>
              <Button state="primary" type="submit">
                testar
              </Button>
            </div>
          </Box>
        </Flex>
      </Form>
    );
  }
}

const sizes = [
  "xs",
  "sm",
  "md",
  "lg",
  "xlg",
  "xxlg",
  "xxxlg",
];

const states = [
  "default",
  "primary",
  "secondary",
  "success",
  "danger",
  "warning",
  "info",
];

interface Props {
  auth: AuthState;
}

export class ComponentsKitchenSink extends React.Component<Props> {
  constructor(a) {
    super(a);

    this.submit = this.submit.bind(this);
  }

  public submit(a, b) {
    console.log("submitted", a, b);
  }

  public render() {
    const { auth } = this.props;

    const pageTitle = (
      <FormattedMessage
        {...messages.welcome}
        values={{ name: auth.user.name }}
      />
    );

    return (
      <div>
        <Helmet>
          <title>Kitchen Sink</title>
        </Helmet>
        <div>
          <PageTitle title={pageTitle} breadcrumb={breadcrumbs.test}>
            <Button state="primary">
              <Icon size={16} name="plus-circle"/>
              <span>primary</span>
            </Button>
          </PageTitle>
          <Box mt={3}>
            <Channel name="kitchen-sink">
              <Formik
                validationSchema={validationSchema}
                initialValues={{
                  test1: 82,
                  test2: "texto",
                  test3: 2,
                  test4: 0,
                  test5: null,
                  test6: null,
                  test7: "+5513981176000",
                  test8: "teste",
                  test9: null,
                  test10: "1990-02-13",
                }}
                render={(props) => <TestForm {...props} auth={auth}/>}
                onSubmit={this.submit}
              />
            </Channel>
          </Box>
          <PageBody>
            <Section id="kitchensink.buttonAndInputColorsAndSizes" title="Buttons And Inputs Colors And Sizes">
              <h6>Input and Button must have the same height and should be equals side-by-side</h6>
              <Box width={1} p={3} mb={3} style={{ overflowX: "auto" }}>
                {sizes.map((size, index) => {
                  return (
                    // tslint:disable-next-line
                    <BoxGroup width={1} key={`same-height1-${size}`} name={`same-height1-${size}`}
                              style={{ width: 8000, position: "relative" }} mb={2}>
                      {/* tslint:disable-next-line */}
                      <div style={{
                        borderBottom: "1px solid red",
                        opacity: .6,
                        position: "absolute",
                        top: "25%",
                        width: "100%",
                        zIndex: 99,
                      }} />
                      {/* tslint:disable-next-line */}
                      <div style={{
                        borderBottom: "1px solid red",
                        opacity: .6,
                        position: "absolute",
                        bottom: "25%",
                        width: "100%",
                        zIndex: 99,
                      }} />
                      {/* tslint:disable-next-line */}
                      <div style={{
                        borderBottom: "1px solid green",
                        opacity: .6,
                        position: "absolute",
                        top: "0",
                        width: "100%",
                        zIndex: 99,
                      }} />
                      {/* tslint:disable-next-line */}
                      <div style={{
                        borderBottom: "1px solid green",
                        opacity: .6,
                        position: "absolute",
                        bottom: "0",
                        width: "100%",
                        zIndex: 99,
                      }} />
                      {states.map((state) => {
                        return (
                          <React.Fragment key={`same-height1-1-${size}-${state}`}>
                            <Box width={1}
                                 style={{ verticalAlign: "baseline", lineHeight: 0 }}>
                              <Button state={state} size={size} width={1}>
                                <Icon name="user" size={8 + (3 * index)}/>
                                {size} {state}
                              </Button>
                            </Box>
                            <Box width={1}>
                              <TextInput state={state} size={size} defaultValue={size + " " + state}/>
                            </Box>
                            <Box width={1}>
                              <FakeTextInput state={state} size={size} defaultValue={size + " " + state}/>
                            </Box>
                          </React.Fragment>
                        );
                      })}
                    </BoxGroup>
                  );
                })}
              </Box>
            </Section>

            <Section id="kitchensink.buttonOutlineColorsAndSizes" title="Buttons Outlined Colors And Sizes">
              <Box width={1} p={3} mb={3} style={{ overflowX: "auto" }}>
                {sizes.map((size, index) => {
                  return (
                    // tslint:disable-next-line
                    <BoxGroup width={1} key={`same-height2-${size}`} name={`same-height2-${size}`}
                              style={{ width: 2400, position: "relative" }} mb={2}>
                      {/* tslint:disable-next-line */}
                      <div style={{
                        borderBottom: "1px solid red",
                        opacity: .6,
                        position: "absolute",
                        top: "25%",
                        width: "100%",
                        zIndex: 99,
                      }} />
                      {/* tslint:disable-next-line */}
                      <div style={{
                        borderBottom: "1px solid red",
                        opacity: .6,
                        position: "absolute",
                        bottom: "25%",
                        width: "100%",
                        zIndex: 99,
                      }} />
                      {/* tslint:disable-next-line */}
                      <div style={{
                        borderBottom: "1px solid green",
                        opacity: .6,
                        position: "absolute",
                        top: "0",
                        width: "100%",
                        zIndex: 99,
                      }} />
                      {/* tslint:disable-next-line */}
                      <div style={{
                        borderBottom: "1px solid green",
                        opacity: .6,
                        position: "absolute",
                        bottom: "0",
                        width: "100%",
                        zIndex: 99,
                      }} />
                      {states.map((state) => {
                        return (
                          <React.Fragment key={`same-height2-1-${size}-${state}`}>
                            <Box width={1}
                                 style={{ verticalAlign: "baseline", lineHeight: 0 }}>
                              <ButtonOutline state={state} size={size} width={1}>
                                <Icon name="user" size={8 + (3 * index)}/>
                                {size} {state}
                              </ButtonOutline>
                            </Box>
                          </React.Fragment>
                        );
                      })}
                    </BoxGroup>
                  );
                })}
              </Box>
            </Section>

            <Section id="kitchensink.buttonTransparentColorsAndSizes" title="Buttons Transparent Colors And Sizes">
              <Box width={1} p={3} mb={3} style={{ overflowX: "auto" }}>
                {sizes.map((size, index) => {
                  return (
                    // tslint:disable-next-line
                    <BoxGroup width={1} key={`same-height3-${size}`} name={`same-height3-${size}`}
                              style={{ width: 2400, position: "relative" }} mb={2}>
                      {/* tslint:disable-next-line */}
                      <div style={{
                        borderBottom: "1px solid red",
                        opacity: .6,
                        position: "absolute",
                        top: "25%",
                        width: "100%",
                        zIndex: 99,
                      }} />
                      {/* tslint:disable-next-line */}
                      <div style={{
                        borderBottom: "1px solid red",
                        opacity: .6,
                        position: "absolute",
                        bottom: "25%",
                        width: "100%",
                        zIndex: 99,
                      }} />
                      {/* tslint:disable-next-line */}
                      <div style={{
                        borderBottom: "1px solid green",
                        opacity: .6,
                        position: "absolute",
                        top: "0",
                        width: "100%",
                        zIndex: 99,
                      }} />
                      {/* tslint:disable-next-line */}
                      <div style={{
                        borderBottom: "1px solid green",
                        opacity: .6,
                        position: "absolute",
                        bottom: "0",
                        width: "100%",
                        zIndex: 99,
                      }} />
                      {states.map((state) => {
                        return (
                          <React.Fragment key={`same-height3-1-${size}-${state}`}>
                            <Box width={1}
                                 style={{ verticalAlign: "baseline", lineHeight: 0 }}>
                              <ButtonTransparent state={state} size={size} width={1}>
                                <Icon name="user" size={8 + (3 * index)}/>
                                {size} {state}
                              </ButtonTransparent>
                            </Box>
                          </React.Fragment>
                        );
                      })}
                    </BoxGroup>
                  );
                })}
              </Box>
            </Section>

            <Section id="kitchensink.buttonGroups" title="Button Groups">
              <Group>
                <Button>default</Button>
                <Button state="primary">primary</Button>
                <Button state="secondary">secondary</Button>
                <Button state="success">success</Button>
                <Button state="danger">danger</Button>
                <Button state="warning">warning</Button>
                <Button state="info">info</Button>
              </Group>
              <h4>Outline</h4>
              <Group>
                <ButtonOutline>default</ButtonOutline>
                <ButtonOutline state="primary">primary</ButtonOutline>
                <ButtonOutline state="secondary">secondary</ButtonOutline>
                <ButtonOutline state="success">success</ButtonOutline>
                <ButtonOutline state="danger">danger</ButtonOutline>
                <ButtonOutline state="warning">warning</ButtonOutline>
                <ButtonOutline state="info">info</ButtonOutline>
              </Group>
              <h4>Transparent</h4>
              <Group>
                <ButtonTransparent>default</ButtonTransparent>
                <ButtonTransparent state="primary">primary</ButtonTransparent>
                <ButtonTransparent state="secondary">secondary</ButtonTransparent>
                <ButtonTransparent state="success">success</ButtonTransparent>
                <ButtonTransparent state="danger">danger</ButtonTransparent>
                <ButtonTransparent state="warning">warning</ButtonTransparent>
                <ButtonTransparent state="info">info</ButtonTransparent>
              </Group>
              <h4>Mixed</h4>
              <Group>
                <Button state="primary">primary</Button>
                <ButtonOutline state="primary">primary</ButtonOutline>
                <ButtonTransparent state="primary">primary</ButtonTransparent>
              </Group>
            </Section>
          </PageBody>
        </div>
      </div>
    );
  }
}

export function mapDispatchToProps() {
  return {};
}

const mapStateToProps = createStructuredSelector({
  auth: makeSelectAuth(),
});

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: "components-kitchen-sink", reducer });

export default compose(
  withReducer,
  withConnect,
)(ComponentsKitchenSink);
