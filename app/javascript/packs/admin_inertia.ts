import { createInertiaApp } from "@inertiajs/react";
import React, { createElement } from "react";
import { createRoot } from "react-dom/client";

import AdminAppWrapper, { GlobalProps } from "../inertia/admin_app_wrapper";
import Layout from "../layouts/Admin";

const AdminLayout = (page: React.ReactNode) => React.createElement(Layout, { children: page });

type PageComponent = React.ComponentType & { layout?: (page: React.ReactNode) => React.ReactElement };

const resolvePageComponent = async (name: string): Promise<PageComponent> => {
  try {
    const page = await import(`../pages/${name}.tsx`);
    const component: PageComponent = page.default;
    component.layout = AdminLayout;
    return component;
  } catch {
    try {
      const page = await import(`../pages/${name}.jsx`);
      const component: PageComponent = page.default;
      component.layout = AdminLayout;
      return component;
    } catch {
      throw new Error(`Admin page component not found: ${name}`);
    }
  }
};

void createInertiaApp<GlobalProps>({
  progress: false,
  resolve: (name: string) => resolvePageComponent(name),
  setup({ el, App, props }) {
    const global = props.initialPage.props;

    const root = createRoot(el);
    root.render(createElement(AdminAppWrapper, { global, children: createElement(App, props) }));
  },
  title: (title: string) => (title ? `${title} - Admin` : "Admin"),
});
