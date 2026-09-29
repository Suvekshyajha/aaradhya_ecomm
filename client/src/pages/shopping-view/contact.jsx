import { MapPin, Phone, Mail, Clock } from "lucide-react";
import imageOne from "../../assets/download.webp";
import imageTwo from "../../assets/d2.webp";
import imageThree from "../../assets/d3.webp";
import imageFour from "../../assets/bluesari3.jpg";
import { useSEO } from "@/components/common/seo";

const contactCards = [
  {
    icon: MapPin,
    title: "Visit Our Store",
    lines: ["Ekantakuna, Lalitpur, Nepal"],
  },
  {
    icon: Phone,
    title: "Call Us",
    lines: ["+977 9865366077"],
    href: "tel:+9779865366077",
  },
  {
    icon: Mail,
    title: "Email Us",
    lines: ["info@Aaradhya.com"],
    href: "mailto:info@Aaradhya.com",
  },
  {
    icon: Clock,
    title: "Store Hours",
    lines: ["Sun – Fri, 10:00 AM – 7:00 PM"],
  },
];

const gallery = [imageOne, imageTwo, imageThree, imageFour];

function Contact() {
  useSEO({
    title: "Contact Us | AARADHYA",
    description:
      "Get in touch with AARADHYA customer care - visit us at Ekantakuna, Lalitpur or call +977 9865366077 for fashion support.",
    path: "/shop/contact",
  });

  return (
    <div className="bg-background">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-16">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.28em] text-gold">
          We&apos;d Love To Hear From You
        </p>
        <h1 className="mt-2 text-center font-display text-4xl font-bold tracking-wide text-foreground md:text-5xl">
          Contact Us
        </h1>
        <div className="gold-rule" />

        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:items-start">
          <div className="grid gap-4 sm:grid-cols-2">
            {contactCards.map((card) => (
              <div
                key={card.title}
                className="rounded-3xl border border-border/70 bg-card p-6 shadow-xl shadow-primary/5 transition-transform duration-300 hover:-translate-y-1"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#2b0f1e] text-gold">
                  <card.icon className="h-5 w-5" />
                </span>
                <h2 className="mt-4 font-display text-lg font-semibold text-foreground">
                  {card.title}
                </h2>
                {card.lines.map((line) => (
                  <p key={line} className="mt-1 text-sm text-muted-foreground">
                    {card.href ? (
                      <a
                        href={card.href}
                        className="font-medium text-primary hover:underline"
                      >
                        {line}
                      </a>
                    ) : (
                      line
                    )}
                  </p>
                ))}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {gallery.map((src, index) => (
              <div
                key={index}
                className="overflow-hidden rounded-3xl border border-border/60 shadow-lg shadow-primary/5"
              >
                <img
                  src={src}
                  alt={`AARADHYA festive collection ${index + 1}`}
                  className="h-56 w-full object-cover transition-transform duration-500 hover:scale-105 sm:h-64"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;
