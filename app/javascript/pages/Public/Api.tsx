import React from "react";


import { ApiResource } from "$app/components/ApiDocumentation/ApiResource";
import { Authentication } from "$app/components/ApiDocumentation/Authentication";
import { API_RESOURCES } from "$app/components/ApiDocumentation/Endpoints";
import { Errors } from "$app/components/ApiDocumentation/Errors";
import { Introduction } from "$app/components/ApiDocumentation/Introduction";
import { Navigation } from "$app/components/ApiDocumentation/Navigation";
import { Resources } from "$app/components/ApiDocumentation/Resources";
import { Scopes } from "$app/components/ApiDocumentation/Scopes";
import { Layout } from "$app/components/Developer/Layout";

export default function Api() {
  return (
    <Layout currentPage="api">
      <main className="p-4 md:p-8">
        <div>
          <div className="grid grid-cols-1 items-start gap-x-16 gap-y-8 lg:grid-cols-[var(--grid-cols-sidebar)]">
            <Navigation resources={API_RESOURCES} />
            <article className="grid gap-8">
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
              {API_RESOURCES.map((resource) => (
                <ApiResource key={resource.id} name={resource.name} id={resource.id} endpoints={resource.endpoints} />
              ))}
            </article>
          </div>
        </div>
      </main>
    </Layout>
  );
}
