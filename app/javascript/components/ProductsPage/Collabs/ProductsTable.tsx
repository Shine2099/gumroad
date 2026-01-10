import { router } from "@inertiajs/react";
import * as React from "react";

import { Product } from "$app/data/collabs";
import { classNames } from "$app/utils/classNames";
import { formatPriceCentsWithCurrencySymbol } from "$app/utils/currency";

import { Pagination, PaginationProps } from "$app/components/Pagination";
import { ProductIconCell } from "$app/components/ProductsPage/ProductIconCell";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "$app/components/ui/Table";
import { useUserAgentInfo } from "$app/components/UserAgent";
import { Sort, useSortingTableDriver } from "$app/components/useSortingTableDriver";

type ProductSortKey = "name" | "display_price_cents" | "cut" | "successful_sales_count" | "revenue";

export const CollabsProductsTable = (props: {
  entries: Product[];
  pagination: PaginationProps;
  sort: Sort<ProductSortKey> | null;
}) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const tableRef = React.useRef<HTMLTableElement>(null);
  const userAgentInfo = useUserAgentInfo();
  const [sort, setSort] = React.useState<Sort<ProductSortKey> | null>(props.sort);
  const products = props.entries;

  const onSetSort = (newSort: Sort<ProductSortKey> | null) => {
    setSort(newSort);
    setIsLoading(true);
    router.reload({
      data: {
        products_sort_key: newSort?.key,
        products_sort_direction: newSort?.direction,
        products_page: undefined,
      },
      only: ["products", "products_pagination", "products_sort"],
      onFinish: () => setIsLoading(false),
    });
  };

  const thProps = useSortingTableDriver<ProductSortKey>(sort, onSetSort);

  const handlePageChange = (page: number) => {
    setIsLoading(true);
    router.reload({
      data: { products_page: page },
      only: ["products", "products_pagination", "products_sort"],
      onFinish: () => {
        setIsLoading(false);
        tableRef.current?.scrollIntoView({ behavior: "smooth" });
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <Table ref={tableRef} aria-live="polite" className={classNames(isLoading && "pointer-events-none opacity-50")}>
        <TableCaption>Products</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead />
            <TableHead {...thProps("name")} className="lg:relative lg:-left-20">
              Name
            </TableHead>
            <TableHead {...thProps("display_price_cents")}>Price</TableHead>
            <TableHead {...thProps("cut")}>Cut</TableHead>
            <TableHead {...thProps("successful_sales_count")}>Sales</TableHead>
            <TableHead {...thProps("revenue")}>Revenue</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <ProductIconCell
                href={product.can_edit ? product.edit_url : product.url}
                thumbnail={product.thumbnail?.url ?? null}
              />

              <TableCell hideLabel>
                <div>
                  {/* Safari currently doesn't support position: relative on <tr>, so we can't make the whole row a link here */}
                  <a href={product.can_edit ? product.edit_url : product.url} style={{ textDecoration: "none" }}>
                    <h4 className="font-bold">{product.name}</h4>
                  </a>

                  <a href={product.url} title={product.url} target="_blank" rel="noreferrer">
                    <small>{product.url_without_protocol}</small>
                  </a>
                </div>
              </TableCell>

              <TableCell className="whitespace-nowrap">{product.price_formatted}</TableCell>

              <TableCell>{product.cut}%</TableCell>

              <TableCell className="whitespace-nowrap">
                <a href={Routes.customers_link_id_path(product.permalink)}>
                  {product.successful_sales_count.toLocaleString(userAgentInfo.locale)}
                </a>

                {product.remaining_for_sale_count ? (
                  <small>{product.remaining_for_sale_count.toLocaleString(userAgentInfo.locale)} remaining</small>
                ) : null}
              </TableCell>

              <TableCell className="whitespace-nowrap">
                {formatPriceCentsWithCurrencySymbol("usd", product.revenue, { symbolFormat: "short" })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={4}>Totals</TableCell>
            <TableCell label="Sales">
              {products
                .reduce((sum, product) => sum + product.successful_sales_count, 0)
                .toLocaleString(userAgentInfo.locale)}
            </TableCell>

            <TableCell label="Revenue">
              {formatPriceCentsWithCurrencySymbol(
                "usd",
                products.reduce((sum, product) => sum + product.revenue, 0),
                { symbolFormat: "short" },
              )}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>

      {props.pagination.pages > 1 ? <Pagination onChangePage={handlePageChange} pagination={props.pagination} /> : null}
    </div>
  );
};
