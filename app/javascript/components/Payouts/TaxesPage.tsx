import * as React from "react";

import stonksLogo from "images/brands/stonks.svg";

import { Button } from "$app/components/Button";
import { Icon } from "$app/components/Icons";
import { Popover } from "$app/components/Popover";
import Placeholder from "$app/components/ui/Placeholder";
import payoutsPlaceholder from "images/placeholders/payouts.png";

interface TaxDocument {
  id: string;
  document: string;
  type: string;
  gross: string;
  fees: string;
  taxes: string;
  net: string;
  isNew?: boolean;
}

interface TaxSavingSuggestion {
  id: string;
  title: string;
  description: string;
  icon: string;
  avgRefund?: string;
}

interface FAQItem {
  id: string;
  question: string;
  answer?: React.ReactNode;
}

const TaxesPage = () => {
  const [selectedYear, setSelectedYear] = React.useState("2025");
  const [yearSelectorOpen, setYearSelectorOpen] = React.useState(false);

  const taxDocuments: TaxDocument[] = [
    {
      id: "1",
      document: "1099-K",
      type: "IRS form",
      gross: "$174,949",
      fees: "-$17,010",
      taxes: "-$1,025",
      net: "$116,887",
      isNew: true,
    },
    {
      id: "2",
      document: "Q4 Earning summary",
      type: "Report",
      gross: "$42,100",
      fees: "-$3,800",
      taxes: "-$220",
      net: "$43,725",
    },
    {
      id: "3",
      document: "Q3 Earning summary",
      type: "Report",
      gross: "$46,000",
      fees: "-$3,800",
      taxes: "-$250",
      net: "$39,520",
    },
    {
      id: "4",
      document: "Q2 Earning summary",
      type: "Report",
      gross: "$48,300",
      fees: "-$4,200",
      taxes: "-$180",
      net: "$41,650",
    },
    {
      id: "5",
      document: "Q1 Earning summary",
      type: "Report",
      gross: "$42,100",
      fees: "-$4,200",
      taxes: "-$375",
      net: "$37,680",
    },
  ];

  const taxSavingSuggestions: TaxSavingSuggestion[] = [
    {
      id: "1",
      title: "stonks.com",
      description: "Helps creators register as a business and unlock major tax deductions. Avg refund: $8,200.",
      icon: "stonks",
      avgRefund: "$8,200",
    },
  ];

  const faqItems: FAQItem[] = [
    {
      id: "why-1099-k",
      question: "Why did I receive a 1099-K?",
      answer: (
        <>
          You received a 1099-K if your U.S.-based Gumroad account had over $20,000 in gross sales and more than 200
          transactions in the previous calendar year. The 1099-K is a purely informational form that summarizes the
          sales activity of your account and is designed to assist you in reporting your taxes.{" "}
          <a href="/help/article/15-1099s" target="_blank" rel="noreferrer">
            Learn more
          </a>
          .
        </>
      ),
    },
    {
      id: "how-gross-sales-calculated",
      question: "How is the 'Gross Sales' amount on my 1099-K calculated?",
      answer: (
        <>
          The 1099-K shows your total unadjusted transaction volume, not your actual payouts. It includes Gumroad fees,
          VAT, affiliate commissions, and other adjustments, so it won't match the amount you were paid.{" "}
          <a href="/help/article/15-1099s#mismatch" target="_blank" rel="noreferrer">
            Learn more
          </a>
          .
        </>
      ),
    },
    {
      id: "find-gumroad-fees",
      question: "Where can I find my Gumroad fees to deduct on my tax return?",
      answer: (
        <>
          You can download a CSV file of your sales data within a selected date range from the{" "}
          <a href="/customers">Sales tab</a>. The CSV will include a <b>Fees</b> column which shows Gumroad's fees plus
          any Apple/Google in-app fees. If you use Stripe Connect or PayPal Connect, check the <b>Stripe Fee Amount</b>{" "}
          and <b>PayPal Fee Amount</b> columns for their respective processing fees.{" "}
          <a href="/help/article/74-the-analytics-dashboard#sales-csv" target="_blank" rel="noreferrer">
            Learn more
          </a>
          .
        </>
      ),
    },
    {
      id: "report-income-no-1099",
      question: "Do I need to report income if I didn't receive a 1099-K?",
      answer:
        "Yes. Even if you didn't meet the IRS thresholds for a 1099-K, you are still required to report all income from Gumroad on your tax return.",
    },
  ];

  return (
    <div className="">
      <section className="p-4 md:p-8">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2>Tax documents</h2>
          {taxDocuments.length > 0 && (
            <div className="flex flex-wrap items-center gap-3">
              <Button color="primary" className="whitespace-nowrap">
                <Icon name="download" />
                Download all
              </Button>
              <Popover
                open={yearSelectorOpen}
                onToggle={setYearSelectorOpen}
                trigger={
                  <div className="input cursor-pointer">
                    <span>{selectedYear}</span>
                    <Icon name="outline-cheveron-down" />
                  </div>
                }
              >
                <div role="menu">
                  <div
                    role="menuitem"
                    onClick={() => {
                      setSelectedYear("2025");
                      setYearSelectorOpen(false);
                    }}
                  >
                    2025
                  </div>
                  <div
                    role="menuitem"
                    onClick={() => {
                      setSelectedYear("2024");
                      setYearSelectorOpen(false);
                    }}
                  >
                    2024
                  </div>
                  <div
                    role="menuitem"
                    onClick={() => {
                      setSelectedYear("2023");
                      setYearSelectorOpen(false);
                    }}
                  >
                    2023
                  </div>
                </div>
              </Popover>
            </div>
          )}
        </div>

        {taxDocuments.length > 0 ? (
          <div className="paragraphs">
            <table>
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Type</th>
                  <th>Gross</th>
                  <th>Fees</th>
                  <th>Taxes</th>
                  <th>Net</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {taxDocuments.map((doc) => (
                  <tr key={doc.id}>
                    <td data-label="Document">
                      <div className="flex items-center gap-2">
                        {doc.isNew && <span className="pill small">New</span>}
                        <span>{doc.document}</span>
                      </div>
                    </td>
                    <td data-label="Type">{doc.type}</td>
                    <td data-label="Gross">{doc.gross}</td>
                    <td data-label="Fees">{doc.fees}</td>
                    <td data-label="Taxes">{doc.taxes}</td>
                    <td data-label="Net">{doc.net}</td>
                    <td data-label="" className="text-right">
                      <div className="flex justify-end">
                        <Button small className="w-full sm:w-auto">
                          Download
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <Placeholder>
            <figure>
              <img src={payoutsPlaceholder} />
            </figure>
            <h2>Let's get your tax info ready.</h2>
            <p>Your 1099-K and quarterly summaries will appear here once they're available.</p>
          </Placeholder>
        )}
      </section>

      <section className="p-4 md:p-8">
        <h2 className="mb-4">Save on your taxes</h2>
        <div className="radio-buttons grid-cols-1" role="radiogroup">
          {taxSavingSuggestions.map((suggestion) => (
            <Button
              key={suggestion.id}
              className="vertical !justify-start"
              color="filled"
              data-suggestion={suggestion.id}
            >
              <div className="flex w-full items-center gap-4">
                <div
                  className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded"
                  style={{
                    backgroundColor: "#101241",
                  }}
                >
                  <img src={stonksLogo} alt="Stonks" className="h-6 w-6" />
                </div>
                <div className="min-w-0 flex-1 space-y-1 text-left">
                  <h4 className="text-lg leading-tight font-semibold">{suggestion.title}</h4>
                  <p className="text-sm opacity-80">{suggestion.description}</p>
                </div>
              </div>
            </Button>
          ))}
        </div>
      </section>

      <section className="p-4 md:p-8">
        <h2 className="mb-4">Find answers to your tax questions</h2>
        <div className="stack">
          {faqItems.map((item) => (
            <details key={item.id}>
              <summary>{item.question}</summary>
              {item.answer && <p className="text-sm">{item.answer}</p>}
            </details>
          ))}
        </div>
        <p className="text-muted mt-4 text-sm">
          Need more help? Search our <a href="/help">Help Center</a>.
        </p>
      </section>
    </div>
  );
};

export default TaxesPage;
