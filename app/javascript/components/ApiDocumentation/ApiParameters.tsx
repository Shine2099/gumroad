import React from "react";

type ApiParametersProps = {
  children: React.ReactNode;
};

export const ApiParameters: React.FC<ApiParametersProps> = ({ children }) => (
  <div className="parameters">
    <h4>Parameters:</h4>
    {children}
  </div>
);

type ApiParameterProps = {
  name: string;
  required?: boolean;
  children?: React.ReactNode;
};

export const ApiParameter: React.FC<ApiParameterProps> = ({ name, children }) => (
  <>
    <strong>{name}</strong>
    {children ? <> {children}</> : null}
  </>
);
