import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchActiveAdvertisements } from "@/store/shop/ads-slice";
import { trackAdClick } from "@/lib/analytics";
import axios from "axios";
import { API_BASE } from "@/lib/api";

/**
 * Paid display-advertisement slot. Renders the newest active ad for the
 * given placement, clearly labelled as an advertisement. Outbound clicks
 * are counted server-side (fire-and-forget) and reported to GA4.
 * Renders nothing when no active ad exists for the placement.
 */
function AdBanner({ placement }) {
  const dispatch = useDispatch();
  const { ads } = useSelector((state) => state.shopAds);

  useEffect(() => {
    dispatch(fetchActiveAdvertisements(placement));
  }, [dispatch, placement]);

  const ad = (ads || []).filter((item) => item.placement === placement)[0];

  if (!ad) return null;

  function handleAdClick() {
    trackAdClick(ad);
    axios
      .post(`${API_BASE}/api/shop/ads/${ad._id}/click`)
      .catch(() => {});
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-4 md:px-6">
      <div className="overflow-hidden rounded-2xl border border-border/70 shadow-sm">
        <a
          href={ad.linkUrl}
          target="_blank"
          rel="sponsored nofollow noopener noreferrer"
          onClick={handleAdClick}
          aria-label={`${ad.title} (advertisement)`}
        >
          <img
            src={ad.image}
            alt={`${ad.title} - sponsored advertisement`}
            loading="lazy"
            className="h-36 w-full object-cover transition-transform duration-500 hover:scale-[1.02] md:h-48"
          />
        </a>
        <p className="bg-muted/60 px-4 py-1 text-center text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground">
          Advertisement
        </p>
      </div>
    </div>
  );
}

export default AdBanner;
