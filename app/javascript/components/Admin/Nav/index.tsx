import * as React from "react";

import { useAppDomain } from "$app/components/DomainSettings";

import { Nav as NavFramework, NavLink } from "$app/components/Nav/Base";

import { CurrentUser } from "$app/types/user";
import AdminNavFooter from "$app/components/Admin/Nav/Footer";

type Props = { title: string; current_user: CurrentUser };

const Nav = ({ title, current_user }: Props) => {
  const routeParams = { host: useAppDomain() };

  return (
    <NavFramework
      title={title}
      footer={<AdminNavFooter current_user={current_user} />}
    >
      <section>
        <NavLink
          text="Suspend users"
          icon="shield-exclamation"
          href={Routes.admin_suspend_users_url(routeParams)}
        />
        <NavLink
          text="Block emails"
          icon="envelope-fill"
          href={Routes.admin_block_email_domains_url(routeParams)}
        />
        <NavLink
          text="Unblock emails"
          icon="envelope-open-fill"
          href={Routes.admin_unblock_email_domains_url(routeParams)}
        />
        <NavLink
          text="Sidekiq"
          icon="lighting-fill"
          href={Routes.admin_sidekiq_web_url(routeParams)}
        />
        <NavLink
          text="Features"
          icon="solid-flag"
          href={Routes.admin_flipper_ui_url(routeParams)}
        />
        <NavLink
          text="Refund queue"
          icon="solid-currency-dollar"
          href={Routes.admin_refund_queue_url(routeParams)}
        />
        <NavLink
          text="Sales reports"
          icon="bar-chart-fill"
          href={Routes.admin_sales_reports_url(routeParams)}
        />
      </section>
    </NavFramework>
  );
};

export default Nav;
