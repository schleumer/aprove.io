import styled from "@emotion/styled";
import * as Luxon from "luxon";
import R from "ramda";
import React from "react";
import { FormattedMessage } from "react-intl";
import { theme } from "styled-tools";

import messages from "../../messages/calendar";
import { Box, Flex } from "../../styled";
import ButtonTransparent from "../ButtonTransparent";
import Icon from "../Icon";

interface DayValue {
  isToday: boolean;
  isFaux: boolean;
  year?: number;
  month?: number;
  week?: number;
  day?: number;
  weekday?: number;
  date?: Luxon.DateTime;
  value?: string;
}

interface WeekValue {
  firstWeekDay: number;
  lastWeekDay: number;
  firstDay: number;
  lastDay: number;
  year: number;
  month: number;
  week: number;
  fauxDays: number;
  days: DayValue[];
}

interface MonthValue {
  alias: string;
  year: number;
  month: number;
  weeks: WeekValue[];
}

const normalizeSunday = (day: number) => {
  if (day === 7) {
    return 0;
  }

  return day;
};

const headAndTail = <T extends {}>(predicate: (T) => boolean, values: T[]): [T, T[]] => {
  const headIndex = R.findIndex(predicate, values);

  if (headIndex > -1) {
    const head = values[headIndex];
    const newValues = R.remove(headIndex, 1, values);

    return [head, newValues];
  }

  return [null, values];
};

const getWeekDay = (ref: Luxon.DateTime): number => {
  const weekStartsOn = 0;
  const startWeekDay = normalizeSunday(ref.startOf("month").weekday);
  const currentWeekDay = normalizeSunday(ref.weekday);

  const startWeekDayWithOptions =
    startWeekDay < weekStartsOn ? 7 - weekStartsOn : startWeekDay;
  const diff = startWeekDayWithOptions > currentWeekDay ? 7 - weekStartsOn : 0;

  return Math.ceil((ref.day + diff) / 7);
};

const splitWeeks = R.pipe(
  R.reduce(
    (weeks: WeekValue[], day: DayValue) => {
      const res = headAndTail((w) => w.week === day.week && w.month === day.month && w.year === day.year, weeks);
      let [week] = res;
      const [, restWeeks] = res;

      if (R.isNil(week)) {
        week = {
          firstDay: 0,
          lastDay: 0,
          firstWeekDay: 0,
          lastWeekDay: 0,
          year: day.year,
          days: [],
          month: day.month,
          week: day.week,
          fauxDays: 0,
        };
      }

      week = {
        ...week,
        days: [
          ...week.days,
          day,
        ],
      };

      return [
        week,
        ...restWeeks,
      ];
    },
    [],
  ),
  R.map((w: WeekValue) => {
    w.firstWeekDay = normalizeSunday(R.head(w.days).weekday);
    w.lastWeekDay = normalizeSunday(R.last(w.days).weekday);
    w.firstDay = R.head(w.days).day;
    w.lastDay = R.last(w.days).day;
    return w;
  }),
  R.sortBy((w: WeekValue) => w.week),
);

const DayRow = styled.div`
padding: 0;
margin: 0;
list-style: none;
display: -webkit-box;
display: -moz-box;
display: -ms-flexbox;
display: -webkit-flex;
display: flex;
-webkit-flex-flow: row;
justify-content: space-around;
user-select: none;
`;

interface DayCellWrapperProps {
  selected: boolean;
  active: boolean;
  isFaux: boolean;
}

const DayCellWrapper = styled.div<DayCellWrapperProps>`
position: relative;
width: 100%;
box-sizing: border-box;
box-shadow: ${(props) =>
  props.selected
    ? `inset 0px -6px 0px -2px ${theme("colors.blue")(props)}`
    : (props.active
        ? `inset 0px -4px 0px -2px ${theme("colors.lime")(props)}`
        : null)
};
cursor: pointer;
pointer-events: ${({isFaux}) => isFaux ? "none" : null};
user-select: none;

&::before {
  content: '';
  display: block;
  padding-top: 100%;
}

&:hover {
  background-color: ${theme("colors.light")};
}
`;

const DayCellContent = styled.div`
position: absolute;
top: 0;
left: 0;
height: 100%;
width: 100%;
display: flex;
align-items: center;
justify-content: center;
user-select: none;
`;

const HeaderRow = styled.div`
padding: 0;
margin: 0;
list-style: none;
display: -webkit-box;
display: -moz-box;
display: -ms-flexbox;
display: -webkit-flex;
display: flex;
-webkit-flex-flow: row;
justify-content: space-around;
user-select: none;
`;

const WeekDayHeaderWrapper = styled.div`
position: relative;
width: 100%;
box-sizing: border-box;
font-weight: 600;
user-select: none;

&::before {
  content: '';
  display: block;
  padding-top: 100%;
}
`;

const WeekDayHeaderContent = styled.div`
position: absolute;
top: 0;
left: 0;
height: 100%;
width: 100%;
display: flex;
align-items: center;
justify-content: center;
user-select: none;
`;

const buildCalendar = (ref: Luxon.DateTime, today: Luxon.DateTime): MonthValue => {
  const start = ref.startOf("month");
  const end = ref.endOf("month");
  const interval = start.until(end);
  const daysLength = Math.ceil(interval.length("days"));
  const todayFormattedDate = today.toFormat("yyyy-LL-dd");

  const range = R.map(
    (d: number): DayValue => {
      const date = start.plus({ days: d });

      const week = getWeekDay(date);

      const formattedDate = date.toFormat("yyyy-LL-dd");

      return {
        isToday: todayFormattedDate === formattedDate,
        isFaux: false,
        date,
        week,
        day: date.day,
        month: date.month,
        year: date.year,
        weekday: normalizeSunday(date.weekday),
        value: formattedDate,
      };
    },
    R.range(0, daysLength),
  );

  const weeks = splitWeeks(range).map((week) => {
    if (week.days.length < 7) {
      if (week.firstDay === 1) {
        const day = R.head(week.days);
        week.days = R.reverse(R.range(0, 7 - week.days.length)).map((value): DayValue => {
          return {
            isToday: false,
            isFaux: true,
            value: day.date.minus({ days: value + 1 }).toFormat("yyyy-LL-dd"),
          };
        }).concat(week.days);
      } else {
        const day = R.last(week.days);
        week.days = week.days.concat(R.range(0, 7 - week.days.length).map((value): DayValue => {
          return {
            isToday: false,
            isFaux: true,
            value: day.date.plus({ days: value + 1 }).toFormat("yyyy-LL-dd"),
          };
        }));
      }
    }

    return week;
  });

  return {
    alias: monthsAliases[ref.month - 1],
    month: ref.month,
    year: ref.year,
    weeks,
  } as MonthValue;
};

const getMonths = (reference: string | null, today: Luxon.DateTime, visibleMonths: number): MonthValue[] => {
  const months = [];

  let ref = today;

  if (reference) {
    ref = Luxon.DateTime.fromFormat(reference, "yyyy-LL-dd");
  }

  for (let i = 0; i < visibleMonths; i++) {
    const month = buildCalendar(ref, today);
    ref = ref.plus({ months: 1 });
    months.push(month);
  }

  return months;
};

export interface Props {
  onChange?: (value: string | null) => void;
  value?: string;
  visibleMonths?: number;
}

interface State {
  reference?: string;
  today: Luxon.DateTime;
  months: MonthValue[];
}

const TODAY = Luxon.DateTime.utc();

const weekDays = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
];

const monthsAliases = [
  "january",
  "february",
  "march",
  "april",
  "may",
  "june",
  "july",
  "august",
  "september",
  "october",
  "november",
  "december",
];

class DatePicker extends React.Component<Props, State> {
  public static defaultProps = {
    visibleMonths: 3,
    reference: null,
    onPick: null,
  };

  // public static getDerivedStateFromProps(props: Props, state: State) {
  //   if (props.value !== state.reference) {
  //     return {
  //       ...state,
  //       months: getMonths(props.value, TODAY, props.visibleMonths),
  //     };
  //   }
  //
  //   return { ...state };
  // }

  public state: State = {
    today: TODAY,
    reference: this.props.value,
    months: getMonths(this.props.value, TODAY, this.props.visibleMonths),
  };

  constructor(props, context) {
    super(props, context);
  }

  public shouldComponentUpdate(nextProps: Readonly<Props>, nextState: Readonly<State>, nextContext: any): boolean {
    return nextProps.value !== this.props.value
      || nextState.reference !== this.state.reference;
  }

  public pick(day: DayValue, week: WeekValue, month: MonthValue) {
    const value = (day && day.value) || null;

    if (R.isNil(value)) {
      this.props.onChange(null);
    } else {
      this.props.onChange(value);
    }

    this.setState({ reference: value });
  }

  public minus(duration: Luxon.Duration | number | Luxon.DurationObject) {
    const { reference, today } = this.state;

    let ref: Luxon.DateTime = today;

    if (reference) {
      ref = Luxon.DateTime.fromFormat(reference, "yyyy-LL-dd");
    }

    const newRef = ref.minus(duration).toFormat("yyyy-LL-dd");

    const months = getMonths(newRef, today, this.props.visibleMonths);

    this.setState({ reference: newRef, months });
  }

  public plus(duration: Luxon.Duration | number | Luxon.DurationObject) {
    const { reference, today } = this.state;

    let ref: Luxon.DateTime = today;

    if (reference) {
      ref = Luxon.DateTime.fromFormat(reference, "yyyy-LL-dd");
    }

    const newRef = ref.plus(duration).toFormat("yyyy-LL-dd");

    const months = getMonths(newRef, today, this.props.visibleMonths);

    this.setState({ reference: newRef, months });
  }

  public render() {
    const { value } = this.props;

    return (
      <div>
        <Flex justifyContent="space-between" my={2}>
          <ButtonTransparent size="sm"
                         onClick={() => this.minus({ months: 1 })}
                         style={{alignSelf: "left"}}>
            <Icon name="arrow-alt-left" />
          </ButtonTransparent>
          <ButtonTransparent size="sm"
                         onClick={() => this.plus({ months: 1 })}
                         style={{alignSelf: "right"}}>
            <Icon name="arrow-alt-right" />
          </ButtonTransparent>
        </Flex>
        <Flex mx={-3}>
          {this.state.months.map((month) => {
            return (
              <Box mx={3} width={1} key={`month-${month.month}-${month.year}`}>
                <div style={{display: "flex", justifyContent: "center"}}>
                  <div><FormattedMessage {...messages[month.alias]} /></div>
                  <div style={{ marginLeft: 5, marginRight: 5 }}>-</div>
                  <div>{month.year}</div>
                </div>
                <div>
                  <HeaderRow>
                    {weekDays.map((w) => (
                      <WeekDayHeaderWrapper key={`weekday-${month.month}-${w}-${month.year}`}>
                        <WeekDayHeaderContent>
                          <FormattedMessage {...messages[w + "_two"]}/>
                        </WeekDayHeaderContent>
                      </WeekDayHeaderWrapper>
                    ))}
                  </HeaderRow>
                  {month.weeks.map((week) => {
                    return (
                      <DayRow key={`week-${month.month}-${week.week}-${month.year}`}>
                        {week.days.map((day) => {
                          if (day.isFaux) {
                            return (
                              <DayCellWrapper
                                key={`month-${day.value}`}
                                selected={false}
                                active={false}
                                isFaux={day.isFaux}
                              >
                                <DayCellContent>
                                  &nbsp;
                                </DayCellContent>
                              </DayCellWrapper>
                            );
                          } else {
                            return (
                              <DayCellWrapper
                                key={`day-${day.value}`}
                                onClick={() => this.pick(day, week, month)}
                                active={day.isToday}
                                selected={day.value === value}
                                isFaux={day.isFaux}
                                data-day={day.value}>
                                <DayCellContent>
                                  {day.day}
                                </DayCellContent>
                              </DayCellWrapper>
                            );
                          }
                        })}
                      </DayRow>
                    );
                  })}
                </div>
              </Box>
            );
          })}
        </Flex>
      </div>
    );
  }
}

export default DatePicker;
