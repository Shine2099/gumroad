import React from "react";

export const ApiParameters = ({ children }: { children: React.ReactNode }) => (
  <div className="parameters">
    <h4>Parameters:</h4>
    <div className="flex flex-col gap-2">{children}</div>
  </div>
);

export const ApiParameter = ({ name, children }: { name: string; required?: boolean; children?: React.ReactNode }) => (
  <>
    <strong>{name}</strong>
    {children ? <> {children}</> : null}
  </>
);
