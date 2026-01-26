import { Link } from "@inertiajs/react";
import * as React from "react";

import { classNames } from "$app/utils/classNames";

import { useDomains } from "$app/components/DomainSettings";
import LoadingSkeleton from "$app/components/LoadingSkeleton";
import { Card, CardContent } from "$app/components/ui/Card";
import useRouteLoading from "$app/components/useRouteLoading";

export const Layout = ({ heading, children }: { heading: string; children: React.ReactNode }) => {
  const { rootDomain } = useDomains();
  const isRouteLoading = useRouteLoading();

  return (
    <div id="inertia-shell" className="flex h-screen flex-col lg:flex-row">
      {isRouteLoading ? <LoadingSkeleton /> : null}
      <main className={classNames("flex-1 overflow-y-auto", { hidden: isRouteLoading })}>
        <Card>
          <CardContent asChild>
            <header>
              <h2 className="grow">{heading}</h2>
            </header>
          </CardContent>
          <CardContent asChild details>
            <p>{children}</p>
          </CardContent>
        </Card>
        <footer className="p-4 text-center">
          Powered by&ensp;
          <Link href={Routes.root_url({ host: rootDomain })} className="logo-full" aria-label="Gumroad" />
        </footer>
      </main>
    </div>
  );
};
