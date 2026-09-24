import { useEffect } from "react";

const DEFAULT_TITLE = "AARADHYA | Chic & Luxury Fashion Online";
const DEFAULT_DESCRIPTION =
  "AARADHYA is your destination for chic and luxury fashion - shop casual, party and wedding wears from Sabyasachi, Biba, Manish Malhotra and more.";

function getSiteUrl() {
  const url = (import.meta.env.VITE_SITE_URL || "").trim().replace(/\/$/, "");
  return url || window.location.origin;
}

function upsertMetaByName(name, content) {
  if (!content) return;
  let tag = document.querySelector(`meta[name="${name}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("name", name);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function upsertMetaProperty(property, content) {
  if (!content) return;
  let tag = document.querySelector(`meta[property="${property}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function upsertCanonical(href) {
  if (!href) return;
  let link = document.querySelector('link[rel="canonical"]');
  if (!link) {
    link = document.createElement("link");
    link.setAttribute("rel", "canonical");
    document.head.appendChild(link);
  }
  link.setAttribute("href", href);
}

/**
 * Sets title, meta description, canonical and Open Graph tags for the
 * current page. Every value falls back to the AARADHYA defaults so a
 * page can pass only what it needs.
 */
export function useSEO({ title, description, path, image, type = "website" } = {}) {
  useEffect(() => {
    const siteUrl = getSiteUrl();
    const finalTitle = title || DEFAULT_TITLE;
    const finalDescription = description || DEFAULT_DESCRIPTION;
    const canonical = `${siteUrl}${path || window.location.pathname}`;

    document.title = finalTitle;
    upsertMetaByName("description", finalDescription);
    upsertCanonical(canonical);
    upsertMetaProperty("og:title", finalTitle);
    upsertMetaProperty("og:description", finalDescription);
    upsertMetaProperty("og:type", type);
    upsertMetaProperty("og:url", canonical);
    if (image) upsertMetaProperty("og:image", image);
  }, [title, description, path, image, type]);
}

export const SEO_DEFAULTS = { DEFAULT_TITLE, DEFAULT_DESCRIPTION };
