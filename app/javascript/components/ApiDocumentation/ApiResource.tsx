import React from "react";

export const ApiResource = ({
  name,
  id,
  endpoints,
}: {
  name: string;
  id: string;
  endpoints: React.ReactNode[];
}) => (
  <div className="stack" id={id}>
    <div>
      <h2>{name}</h2>
    </div>
    {endpoints}
  </div>
);
