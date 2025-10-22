import * as React from "react";

const MAX_VIEW_CONTENT_BUTTON_TEXT_LENGTH = 26;

export const CustomViewContentButtonTextInput = ({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (value: string) => void;
}) => {
  const uid = React.useId();
  return (
    <fieldset>
      <label htmlFor={uid}>View content button text</label>
      <input
        id={uid}
        type="text"
        placeholder="View content"
        value={value ?? ""}
        onChange={(evt) => onChange(evt.target.value)}
        maxLength={MAX_VIEW_CONTENT_BUTTON_TEXT_LENGTH}
      />
      <small>
        Customize the text on the download button in receipts and product pages (max{" "}
        {MAX_VIEW_CONTENT_BUTTON_TEXT_LENGTH} characters)
      </small>
    </fieldset>
  );
};
