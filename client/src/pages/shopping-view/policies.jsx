import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Truck, Undo2, CreditCard, ShieldCheck } from "lucide-react";
import { useSEO } from "@/components/common/seo";

const sections = [
  {
    id: "shipping",
    icon: Truck,
    title: "Shipping & Delivery",
    body: [
      "We deliver across Nepal. Delivery addresses can be saved and managed from My Account.",
      "Orders are confirmed only after your eSewa payment is verified, then packed and dispatched. You can follow every order's status under My Orders.",
      "Delivery times vary by location - customer care can give you an estimate for your city at +977 9865366077.",
    ],
  },
  {
    id: "returns",
    icon: Undo2,
    title: "Returns & Exchanges",
    body: [
      "Unused items in their original condition and packaging can be returned or exchanged within 7 days of delivery.",
      "To start a return, contact customer care with your order number. Refunds for eSewa payments are processed back through eSewa after we receive and inspect the item.",
      "Sale items and items damaged by misuse are not eligible for return.",
    ],
  },
  {
    id: "payments",
    icon: CreditCard,
    title: "Payments",
    body: [
      "We accept eSewa for all online orders. The amount you approve on eSewa is matched against your order total on our server before anything is confirmed.",
      "Stock is reduced only after eSewa reports the transaction as COMPLETE, so you are never charged for items we cannot ship.",
      "Card and wallet credentials are handled entirely by eSewa - they are never stored on our servers.",
    ],
  },
  {
    id: "privacy",
    icon: ShieldCheck,
    title: "Privacy",
    body: [
      "We store only what your orders need: account details, delivery addresses and order history.",
      "Passwords are stored as bcrypt hashes, sessions live in httpOnly cookies, and you can only ever see your own carts, addresses and orders.",
      "We never sell your personal information. For questions, email info@Aaradhya.com.",
    ],
  },
];

function Policies() {
  useSEO({
    title: "Store Policies | AARADHYA",
    description:
      "AARADHYA store policies - shipping and delivery across Nepal, 7-day returns and exchanges, secure eSewa payments and privacy.",
    path: "/shop/policies",
  });
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" });
    }
  }, [hash]);

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-4xl px-4 py-12 md:px-6 md:py-16">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.28em] text-gold">
          Good To Know
        </p>
        <h1 className="mt-2 text-center font-display text-4xl font-bold tracking-wide text-foreground md:text-5xl">
          Store Policies
        </h1>
        <div className="gold-rule" />

        <div className="mt-10 space-y-4">
          {sections.map((section) => (
            <section
              key={section.id}
              id={section.id}
              className="scroll-mt-24 rounded-3xl border border-border/70 bg-card p-6 shadow-xl shadow-primary/5 sm:p-8"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2b0f1e] text-gold">
                  <section.icon className="h-5 w-5" />
                </span>
                <h2 className="font-display text-xl font-bold text-foreground sm:text-2xl">
                  {section.title}
                </h2>
              </div>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground sm:text-[15px]">
                {section.body.map((line, i) => (
                  <li key={i}>{line}</li>
                ))}
              </ul>
            </section>
          ))}
        </div>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Questions about these policies?{" "}
          <Link to="/shop/faq" className="font-medium text-primary hover:underline">
            Read the FAQ
          </Link>{" "}
          or{" "}
          <Link to="/shop/contact" className="font-medium text-primary hover:underline">
            contact us
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

export default Policies;
