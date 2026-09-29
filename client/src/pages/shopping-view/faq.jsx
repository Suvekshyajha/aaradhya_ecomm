import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, MessageCircle } from "lucide-react";
import { useSEO } from "@/components/common/seo";

const faqs = [
  {
    q: "How do I place an order?",
    a: "Add items to your cart, go to Checkout, choose a saved delivery address (or add a new one), then pay securely with eSewa. Your order is confirmed as soon as eSewa verifies the payment.",
  },
  {
    q: "Which payment methods do you accept?",
    a: "We accept eSewa for online payments. Every payment is verified directly with eSewa before your order is confirmed - card details never touch our servers.",
  },
  {
    q: "Where do you deliver?",
    a: "We deliver across Nepal. Delivery addresses are managed from My Account, and you can track every order's status there too.",
  },
  {
    q: "What is your return / exchange policy?",
    a: "Unused items in original condition can be returned or exchanged within 7 days of delivery. Read the full terms on our Store Policies page or contact customer care to start a return.",
  },
  {
    q: "How can I track my order?",
    a: "Sign in and open My Orders from your account - each order shows its current status, from pending to confirmed and delivered.",
  },
  {
    q: "The product I want is out of stock. What now?",
    a: "Stock is limited on festive and designer pieces. Check the recommendations on any product page for similar items, or contact us and we will tell you about restocks.",
  },
];

function Faq() {
  useSEO({
    title: "FAQ | AARADHYA",
    description:
      "AARADHYA frequently asked questions - ordering, eSewa payments, delivery across Nepal, returns and order tracking.",
    path: "/shop/faq",
  });
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-16">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.28em] text-gold">
          Help Center
        </p>
        <h1 className="mt-2 text-center font-display text-4xl font-bold tracking-wide text-foreground md:text-5xl">
          Frequently Asked Questions
        </h1>
        <div className="gold-rule" />

        <div className="mt-10 space-y-3">
          {faqs.map((faq, index) => {
            const open = openIndex === index;
            return (
              <div
                key={faq.q}
                className="overflow-hidden rounded-2xl border border-border/70 bg-card shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={open}
                >
                  <span className="font-display text-base font-semibold text-foreground sm:text-lg">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-gold transition-transform duration-300 ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {open && (
                  <p className="px-5 pb-5 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                    {faq.a}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-10 rounded-3xl bg-[#2b0f1e] p-8 text-center text-[#f5e9dd]">
          <MessageCircle className="mx-auto h-8 w-8 text-gold" />
          <h2 className="mt-3 font-display text-2xl font-bold">
            Still need help?
          </h2>
          <p className="mt-2 text-sm text-[#f5e9dd]/75">
            Call us at{" "}
            <a href="tel:+9779865366077" className="font-semibold text-gold hover:underline">
              +977 9865366077
            </a>{" "}
            or visit our{" "}
            <Link to="/shop/contact" className="font-semibold text-gold hover:underline">
              Contact page
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}

export default Faq;
