import * as React from "react";

import { PoweredByFooter } from "$app/components/PoweredByFooter";
import { Product, useSelectionFromUrl, Props as ProductProps } from "$app/components/Product";

const PurchaseProductPage = (props: ProductProps & { custom_css?: string }) => {
  const [selection, setSelection] = useSelectionFromUrl(props.product);

  return (
    <div>
      {props.custom_css ? <style dangerouslySetInnerHTML={{ __html: props.custom_css }} /> : null}
      <div>
        <section>
          <Product {...props} selection={selection} setSelection={setSelection} />
        </section>
        <PoweredByFooter className="p-0" />
      </div>
    </div>
  );
};

PurchaseProductPage.loggedInUserLayout = true;
export default PurchaseProductPage;
