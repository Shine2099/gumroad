import * as React from "react";

export const CustomReceiptTextInput = ({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (value: string) => void;
}) => {
  const uid = React.useId();
  return (
    <fieldset>
      <label htmlFor={uid}>Additional text on receipt</label>
      <textarea
        id={uid}
        maxLength={500}
        placeholder="Add any additional information you'd like to highlight on the receipt..."
        value={value ?? ""}
        onChange={(evt) => onChange(evt.target.value)}
        rows={3}
      />
      <small>
        Add custom text that will appear on the customer's receipt to highlight important information (max 500
        characters)
      </small>
    </fieldset>
  );
};
