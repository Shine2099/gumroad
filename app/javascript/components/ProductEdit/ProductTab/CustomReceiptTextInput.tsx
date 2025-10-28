import * as React from "react";

export const CustomReceiptTextInput = ({
  value,
  onChange,
  maxLength,
}: {
  value: string | null;
  onChange: (value: string) => void;
  maxLength: number;
}) => {
  const uid = React.useId();
  return (
    <fieldset>
      <label htmlFor={uid}>Additional text on receipt</label>
      <textarea
        id={uid}
        maxLength={maxLength}
        placeholder="Add any additional information you'd like to highlight on the receipt..."
        value={value ?? ""}
        onChange={(evt) => onChange(evt.target.value)}
        rows={3}
      />
    </fieldset>
  );
};
