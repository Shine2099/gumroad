import React from "react";

import { Layout } from "$app/components/Developer/Layout";
import { API_METHODS } from "$app/data/apiDocumentation";

import { ApiResource } from "./ApiResource";
import { Authentication } from "./Authentication";
import { Errors } from "./Errors";
import { Introduction } from "./Introduction";
import { Navigation } from "./Navigation";
import { Resources } from "./Resources";
import { Scopes } from "./Scopes";

const ApiDocumentation: React.FC = () => {
  return (
    <Layout currentPage="api">
      <main className="p-4 md:p-8">
        <div>
          <div className="grid grid-cols-1 items-start gap-x-16 gap-y-8 lg:grid-cols-[var(--grid-cols-sidebar)]">
            <Navigation resources={API_METHODS} />
            <article style={{ display: "grid", gap: "var(--spacer-6)" }}>
              <Introduction />
              <Authentication />
              <Scopes />
              <Resources />
              <Errors />
              <div className="stack" id="api-methods">
                <div>
                  <h2>API Methods</h2>
                </div>
                <div>
                  <p>
                    Gumroad's OAuth 2.0 API lets you see information about your products, as well as you can add, edit,
                    and delete offer codes, variants, and custom fields. Finally, you can see a user's public
                    information and subscribe to be notified of their sales.
                  </p>
                </div>
              </div>
              {API_METHODS.map((resource) => (
                <ApiResource key={resource.name} resource={resource} />
              ))}
            </article>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default ApiDocumentation;
