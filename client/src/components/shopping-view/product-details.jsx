import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Separator } from "../ui/separator";
import { useSEO } from "../common/seo";
import ProductRecommendations from "./product-recommendations";
import { trackAffiliateClick } from "@/lib/analytics";
import { trackAffiliateClick as trackAffiliateClickCount } from "@/store/shop/products-slice";
import { useDispatch } from "react-redux";
import { ExternalLink } from "lucide-react";

function ProductDetailsDialog({
  open,
  setOpen,
  productDetails,
  handleAddtoCart,
  handleGetProductDetails,
}) {
  const dispatch = useDispatch();
  // Dynamic SEO for the open product: title/description use the actual
  // product information while the dialog is visible.
  useSEO({
    title: productDetails
      ? `${productDetails.title} | AARADHYA`
      : undefined,
    description: productDetails
      ? `${productDetails.title} - ${productDetails.description || ""}`.slice(0, 160)
      : undefined,
    path: productDetails ? `/shop/listing?product=${productDetails._id}` : undefined,
    image: productDetails?.image || undefined,
  });

  function onAddToCart() {
    if (!productDetails?._id || typeof handleAddtoCart !== "function") return;
    handleAddtoCart(productDetails._id, productDetails.totalStock);
  }

  function onAffiliateBuy() {
    if (!productDetails?.affiliateUrl) return;
    // Affiliate referral: count the outbound click server-side and in GA4
    // (product id + partner only, no personal data), then open the partner.
    trackAffiliateClick(productDetails, productDetails.affiliatePartner);
    dispatch(trackAffiliateClickCount(productDetails._id));
    window.open(productDetails.affiliateUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-card max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw] max-h-[90vh] overflow-y-auto rounded-3xl border-border/70 p-6 sm:p-8">
        <DialogTitle className="sr-only">
          {productDetails?.title || "Product details"}
        </DialogTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="relative overflow-hidden rounded-2xl">
            <img
              src={productDetails?.image}
              alt={
                productDetails?.title
                  ? `${productDetails.title} - AARADHYA product image`
                  : "AARADHYA product image"
              }
              width={600}
              height={600}
              loading="lazy"
              decoding="async"
              className="aspect-square w-full object-cover"
            />
            {productDetails?.salePrice > 0 ? (
              <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#2b0f1e]">
                Sale
              </span>
            ) : null}
          </div>
          <div>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.24em] text-gold">
                {productDetails?.brand ? `${productDetails.brand} · ` : ""}{productDetails?.category || "AARADHYA"}
              </p>
              <h1 className="mt-2 font-display text-3xl font-bold leading-tight">{productDetails?.title}</h1>
              <p className="text-muted-foreground text-base font-light leading-relaxed mb-5 mt-4">
                {productDetails?.description}
              </p>
            </div>
            <div className="flex items-baseline gap-3">
              {productDetails?.salePrice > 0 ? (
                <p className="text-3xl font-semibold text-primary">
                  Rs. {productDetails?.salePrice}
                </p>
              ) : null}
              <p
                className={`text-2xl font-semibold ${
                  productDetails?.salePrice > 0 ? "line-through text-muted-foreground text-lg font-normal" : "text-primary"
                }`}
              >
                Rs. {productDetails?.price}
              </p>
            </div>

            <div className="mt-6 mb-5 flex flex-col gap-2">
              {productDetails?.totalStock === 0 ? (
                <Button className="w-full rounded-full py-6 opacity-60 cursor-not-allowed">
                  Out of Stock
                </Button>
              ) : (
                <Button
                  className="w-full rounded-full py-6 text-sm font-semibold uppercase tracking-[0.14em]"
                  onClick={onAddToCart}
                >
                  Add to Cart
                </Button>
              )}
              {productDetails?.affiliateUrl ? (
                <Button
                  variant="outline"
                  className="w-full rounded-full py-6 text-sm font-semibold uppercase tracking-[0.14em]"
                  onClick={onAffiliateBuy}
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Buy from {productDetails.affiliatePartner || "Partner"}
                </Button>
              ) : null}
            </div>
            <Separator className="h-px bg-border my-4" />
          </div>
        </div>

        {productDetails?._id ? (
          <div className="sm:px-6 pb-2">
            <ProductRecommendations
              productId={productDetails._id}
              handleGetProductDetails={handleGetProductDetails}
              handleAddtoCart={handleAddtoCart}
              limit={5}
            />
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsDialog;
