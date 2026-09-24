import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  clearRecommendations,
  fetchProductRecommendations,
} from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Skeleton } from "@/components/ui/skeleton";

function ProductRecommendations({
  productId,
  handleGetProductDetails,
  handleAddtoCart,
  limit = 5,
}) {
  const dispatch = useDispatch();
  const { recommendations, recommendationsLoading, recommendationsError } =
    useSelector((state) => state.shopProducts);

  useEffect(() => {
    if (!productId) return;
    dispatch(fetchProductRecommendations({ productId, limit }));
    return () => dispatch(clearRecommendations());
  }, [dispatch, productId, limit]);

  // Never show the current product inside its own recommendations.
  const items = (recommendations || []).filter(
    (item) => String(item._id) !== String(productId)
  );

  if (recommendationsLoading) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">You May Also Like</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-[280px] w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (recommendationsError) {
    return (
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-2">You May Also Like</h2>
        <p className="text-sm text-muted-foreground">
          Recommendations are unavailable right now. Please try again later.
        </p>
      </div>
    );
  }

  if (!items.length) return null;

  return (
    <div className="mt-8">
      <h2 className="mb-1 font-display text-2xl font-bold">You May Also Like</h2>
      <div className="gold-rule" style={{ marginLeft: 0 }} />
      <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <ShoppingProductTile
            key={item._id}
            product={item}
            handleGetProductDetails={handleGetProductDetails}
            handleAddtoCart={handleAddtoCart}
          />
        ))}
      </div>
    </div>
  );
}

export default ProductRecommendations;
