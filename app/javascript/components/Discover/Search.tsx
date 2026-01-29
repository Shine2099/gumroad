import cx from "classnames";
import * as React from "react";

import { getAutocompleteSearchResults, AutocompleteSearchResults, deleteAutocompleteSearch } from "$app/data/discover";
import { escapeRegExp } from "$app/utils";
import { assertResponseError } from "$app/utils/request";

import { ComboBox } from "$app/components/ComboBox";
import { Icon } from "$app/components/Icons";
import { showAlert } from "$app/components/server-components/Alert";
import { useDebouncedCallback } from "$app/components/useDebouncedCallback";
import { useOnChange } from "$app/components/useOnChange";

import thumbnailPlaceholder from "$assets/images/placeholders/product-cover.png";

export const Search = ({
  query,
  setQuery,
  autocompleteData,
}: {
  query?: string | undefined;
  setQuery: (query: string) => void;
  autocompleteData?: AutocompleteSearchResults | null;
}) => {
  const [enteredQuery, setEnteredQuery] = React.useState(query ?? "");
  const [results, setResults] = React.useState<AutocompleteSearchResults | null>(autocompleteData ?? null);
  const [autocompleteOpen, setAutocompleteOpen] = React.useState(false);

  useOnChange(() => setEnteredQuery(query ?? ""), [query]);

  useOnChange(() => {
    if (autocompleteData) {
      setResults(autocompleteData);
    }
  }, [autocompleteData]);

  const fetchAutocomplete = useDebouncedCallback(async (searchQuery: string) => {
    try {
      const data = await getAutocompleteSearchResults({ query: searchQuery });
      setResults(data);
    } catch (e) {
      assertResponseError(e);
      showAlert("Sorry, something went wrong. Please try again.", "error");
    }
  }, 300);

  useOnChange(() => {
    if (enteredQuery) {
      void fetchAutocomplete(enteredQuery);
    }
  }, [enteredQuery]);

  useOnChange(() => {
    if (autocompleteOpen && !results && enteredQuery) {
      void fetchAutocomplete(enteredQuery);
    }
  }, [autocompleteOpen]);

  const highlightQuery = (text: string) => {
    const index = text.search(new RegExp(escapeRegExp(enteredQuery), "iu"));
    if (index === -1) return text;
    return (
      <>
        {text.slice(0, index)}
        <b>{text.slice(index, index + enteredQuery.length)}</b>
        {text.slice(index + enteredQuery.length)}
      </>
    );
  };

  const deleteRecentSearch = (searchQuery: string) => {
    void deleteAutocompleteSearch({ query: searchQuery });
    if (results) {
      setResults({
        ...results,
        recent_searches: results.recent_searches.filter((q) => q !== searchQuery),
      });
    }
  };

  const options = results ? [...results.recent_searches, ...results.products] : [];

  return (
    <ComboBox
      className="flex-1"
      open={autocompleteOpen ? options.length > 0 : false}
      onToggle={setAutocompleteOpen}
      editable
      input={(props) => (
        <div className="input">
          <Icon name="solid-search" />
          <input
            {...props}
            type="search"
            className="cursor-text!"
            placeholder="Search products"
            aria-label="Search products"
            value={enteredQuery}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                setQuery(enteredQuery);
                fetchAutocomplete.cancel();
              }
            }}
            onChange={(e) => {
              setEnteredQuery(e.target.value);
              setAutocompleteOpen(true);
            }}
            aria-autocomplete="list"
          />
        </div>
      )}
      options={options}
      option={(item, props, index) => (
        <>
          {index === results?.recent_searches.length ? (
            <h3>{enteredQuery ? "Products" : results.viewed ? "Keep shopping for" : "Trending"}</h3>
          ) : null}
          {typeof item === "string" ? (
            <div {...props}>
              <a href={Routes.discover_path({ query: item })} className="flex flex-1 items-center no-underline">
                <Icon name="clock-history" className="mr-2 text-muted" />
                {highlightQuery(item)}
              </a>
              <button onClick={() => deleteRecentSearch(item)} aria-label="Remove" className="cursor-pointer all-unset">
                <Icon name="x" className="text-muted" />
              </button>
            </div>
          ) : (
            <a {...props} href={item.url} className={cx("flex items-center gap-4 no-underline", props.className)}>
              <img src={item.thumbnail_url ?? thumbnailPlaceholder} alt={item.name} />
              <div>
                {highlightQuery(item.name)}
                <small>{item.seller_name ? `Product by ${item.seller_name}` : "Product"}</small>
              </div>
            </a>
          )}
        </>
      )}
    />
  );
};
