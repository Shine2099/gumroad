import React from "react";

export const Navigation = ({ resources }: { resources: { name: string; id: string }[] }) => (
  <div
    role="navigation"
    aria-label="API Reference"
    className="lg:sticky lg:top-8 lg:h-full lg:max-h-[calc(100vh-4rem)] lg:overflow-auto"
  >
    <menu>
      <li>
        <a href="#api-intro">Introduction</a>
      </li>
      <li>
        <a href="#api-authentication">Authentication</a>
      </li>
      <li>
        <a href="#api-scopes">Scopes</a>
      </li>
      <li>
        <a href="#api-errors">Errors</a>
      </li>
      <li>
        <a href="#api-methods">Methods</a>
        <menu>
          {resources.map((resource) => (
            <li key={resource.id}>
              <a href={`#${resource.id}`}>{resource.name}</a>
            </li>
          ))}
        </menu>
      </li>
    </menu>
  </div>
);
