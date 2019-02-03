import { latinise } from "@b6y/commons";
import R from "ramda";
import React from "react";
import { FormattedMessage, InjectedIntl } from "react-intl";

export interface OptionType {
  label: string | FormattedMessage.MessageDescriptor;
  value: any;
  option?: React.ReactNode;
}

export interface SearchableOptionType {
  text: string;
}

export abstract class Adapter {
  public abstract search(input: string, props: any): Promise<OptionType[]>;

  public abstract single(id: any, props: any): Promise<OptionType>;
}

export class ArrayAdapter extends Adapter {
  protected options: Array<OptionType & SearchableOptionType>;

  constructor(
    options: OptionType[],
  ) {
    super();

    this.options = options.map((o) => {
      if (!R.is(Object, o.label)) {
        return { ...o, text: latinise(o.label as string) };
      } else {
        return { ...o, text: "NOT_TRANSLATED" };
      }
    });
  }

  public intl(intl: InjectedIntl) {
    const translatedOptions = this.options.map((o) => {
      if (!R.is(Object, o.label)) {
        return { ...o, text: latinise(o.label as string) };
      } else {
        const label = intl.formatMessage(o.label as FormattedMessage.MessageDescriptor);
        return { ...o, label, text: latinise(label) };
      }
    });
    return new ArrayAdapter(translatedOptions);
  }

  public search(input: string, props: any): Promise<OptionType[]> {
    return new Promise((resolve) => {
      if (R.isNil(input) || input === "") {
        resolve(this.options);
      } else {
        const text = latinise(input);
        resolve(
          this.options.filter((o) => o.text.includes(text)),
        );
      }
    });
  }

  public single(id: any, props: any): Promise<OptionType> {
    return new Promise((resolve) => {
      resolve(this.options.find((o) => o.value === id) || null);
    });
  }
}
