import * as React from 'react';
import { ToggleButtonGroup, ToggleButtonGroupProps } from '@mui/material';

export type OptionsObject = { [key: string]: boolean };

export type OptionsArray = Array<keyof OptionsObject>;

export type OnChangeCallback = (
  event: React.MouseEvent<HTMLElement>,
  newOptions: OptionsArray
) => void;

export type OnChangeOptionsCallback = (
  event: React.MouseEvent<HTMLElement>,
  newOptions: OptionsObject
) => void;

export function OptionsBar({
  defaultOptions,
  onChange,
  children,
  ...props
}: {
  defaultOptions: OptionsObject;
  onChange: OnChangeOptionsCallback;
} & ToggleButtonGroupProps): JSX.Element {
  const defaultValues: OptionsArray = React.useMemo(
    () =>
      Object.keys(defaultOptions).filter((option) => defaultOptions[option]),
    [defaultOptions]
  );
  const [values, setValues] = React.useState(defaultValues);

  const onChangeOptions: OnChangeCallback = (event, newOptions) => {
    setValues(newOptions);
    const options = newOptions.reduce(
      (options, keys) => {
        options[keys] = true;
        return options;
      },
      { ...defaultOptions }
    );
    onChange(event, options);
  };

  return (
    <ToggleButtonGroup
      aria-label="search options"
      title="search options"
      size={'small'}
      {...props}
      value={values}
      onChange={onChangeOptions}
    >
      {children}
    </ToggleButtonGroup>
  );
}
