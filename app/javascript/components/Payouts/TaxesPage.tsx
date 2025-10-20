import * as React from "react";

import stonksLogo from "images/brands/stonks-logo.svg";
import kickLogo from "images/brands/kick-logo.svg";

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
  answer?: string;
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
    {
      id: "2",
      title: "kick.co",
      description: "Handles your bookkeeping automatically, so you're always tax-ready. Built for creators.",
      icon: "kick",
    },
  ];

  const faqItems: FAQItem[] = [
    {
      id: "why-1099-k",
      question: "Why did I receive a 1099-K?",
    },
    {
      id: "how-gross-sales-calculated",
      question: "How is the 'Gross Sales' amount on my 1099-K calculated?",
      answer:
        "The gross sales amount is the total of all payments processed on your behalf by Gumroad for the calendar year, before any fees, refunds, or adjustments. This is the amount reported to the IRS. Learn more.",
    },
    {
      id: "find-gumroad-fees",
      question: "Where can I find my Gumroad fees to deduct on my tax return?",
    },
    {
      id: "vat-refund",
      question: "How can I get a VAT refund?",
    },
    {
      id: "report-income-no-1099",
      question: "Do I need to report income if I didn't receive a 1099-K?",
    },
  ];

  return (
    <div className="space-y-8">
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
                    <td>
                      <div className="flex items-center gap-2">
                        {doc.isNew && <span className="pill small">New</span>}
                        <span>{doc.document}</span>
                      </div>
                    </td>
                    <td>{doc.type}</td>
                    <td>{doc.gross}</td>
                    <td>{doc.fees}</td>
                    <td>{doc.taxes}</td>
                    <td>{doc.net}</td>
                    <td className="text-right">
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
        <div className="radio-buttons grid-cols-1! sm:grid-cols-2!" role="radiogroup">
          {taxSavingSuggestions.map((suggestion) => (
            <Button
              key={suggestion.id}
              className="vertical !justify-start"
              color="filled"
              data-suggestion={suggestion.id}
            >
              <div className="flex w-full items-center gap-4">
                <div
                  className={`flex h-16 w-16 flex-shrink-0 items-center justify-center rounded ${
                    suggestion.icon === "stonks" ? "" : ""
                  }`}
                  style={{
                    backgroundColor: suggestion.icon === "stonks" ? "#101241" : "#F9F9FB",
                  }}
                >
                  {suggestion.icon === "stonks" ? (
                    <img src={stonksLogo} alt="Stonks" className="h-6 w-6" />
                  ) : (
                    <img src={kickLogo} alt="Kick" className="h-6 w-6" />
                  )}
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
        <h2 className="mb-4">Find answers to your tax questions.</h2>
        <div className="stack">
          {faqItems.map((item) => (
            <details key={item.id}>
              <summary>{item.question}</summary>
              {item.answer && <p className="text-sm">{item.answer}</p>}
            </details>
          ))}
        </div>
        <p className="text-muted mt-4 text-sm">
          Learn more on our <a href="/help">Help Center</a>.
        </p>
      </section>
    </div>
  );
};

export default TaxesPage;
