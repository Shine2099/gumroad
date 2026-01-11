import { Head, usePage } from "@inertiajs/react";
import * as React from "react";
import { cast } from "ts-safe-cast";

import { ArticleModule, getArticle } from "$app/components/HelpCenterPage/Articles";
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
  category: ArticleCategory;
}

interface Meta {
  title: string;
  canonical_url: string;
}

interface Props {
  article: Article;
  sidebar_categories: SidebarCategory[];
  meta: Meta;
}

export default function HelpCenterArticle() {
  const { article, sidebar_categories, meta } = cast<Props>(usePage().props);
  const [articleModule, setArticleModule] = React.useState<ArticleModule | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    setIsLoading(true);
    void getArticle(article.slug).then((module) => {
      setArticleModule(module ?? null);
      setIsLoading(false);
    });
  }, [article.slug]);

  const ArticleComponent = articleModule?.component;
  const description = articleModule?.description ?? "";

  return (
    <HelpCenterLayout showSearchButton>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={meta.canonical_url} />
        <meta property="og:title" content={meta.title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={meta.canonical_url} />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content={meta.title} />
        <meta name="twitter:description" content={description} />
      </Head>
      <div className="flex max-w-7xl flex-col-reverse gap-8 md:flex-row md:gap-16">
        <CategorySidebar categories={sidebar_categories} activeSlug={article.category.slug} />
        <div className="flex-1 grow rounded-sm border border-[rgb(var(--parent-color)/var(--border-alpha))] bg-[rgb(var(--filled))] p-8">
          <h2 className="mb-6 text-3xl font-bold">{article.title}</h2>
          <div className="scoped-tailwind-preflight prose dark:prose-invert">
            {isLoading ? <p>Loading...</p> : ArticleComponent ? <ArticleComponent /> : <p>Article not found</p>}
          </div>
        </div>
      </div>
    </HelpCenterLayout>
  );
}
