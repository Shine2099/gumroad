import { Head, router, usePage } from "@inertiajs/react";
import * as React from "react";
import { cast } from "ts-safe-cast";

import { CategorySidebar, SidebarCategory } from "$app/components/HelpCenterPage/CategorySidebar";

import { HelpCenterLayout } from "../Layout";

interface ArticleCategory {
  title: string;
  slug: string;
  url: string;
}

interface Article {
  title: string;
  slug: string;
  content: string;
  category: ArticleCategory;
}

interface Meta {
  title: string;
  description: string;
  canonical_url: string;
}

interface Props {
  article: Article;
  sidebar_categories: SidebarCategory[];
  meta: Meta;
}

export default function HelpCenterArticle() {
  const { article, sidebar_categories, meta } = cast<Props>(usePage().props);
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const handleClick = (e: MouseEvent) => {
      if (!(e.target instanceof HTMLElement)) return;
      const anchor = e.target.closest("a");
      if (!anchor) return;

      const resolvedUrl = new URL(anchor.href);
      if (resolvedUrl.origin === window.location.origin && resolvedUrl.pathname.startsWith("/help/")) {
        e.preventDefault();
        router.visit(resolvedUrl.pathname);
      }
    };

    container.addEventListener("click", handleClick);
    return () => container.removeEventListener("click", handleClick);
  }, []);

  return (
    <HelpCenterLayout showSearchButton>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <link rel="canonical" href={meta.canonical_url} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={meta.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={meta.canonical_url} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={meta.description} />
      </Head>
      <div className="flex max-w-7xl flex-col-reverse gap-8 md:flex-row md:gap-16">
        <CategorySidebar categories={sidebar_categories} activeSlug={article.category.slug} />
        <div className="flex-1 grow rounded-sm border border-[rgb(var(--parent-color)/var(--border-alpha))] bg-[rgb(var(--filled))] p-8">
          <h2 className="mb-6 text-3xl font-bold">{article.title}</h2>
          <div
            ref={contentRef}
            className="scoped-tailwind-preflight prose dark:prose-invert"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>
      </div>
    </HelpCenterLayout>
  );
}
