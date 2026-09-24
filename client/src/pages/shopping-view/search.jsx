

import ProductDetailsDialog from "@/components/shopping-view/product-details";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
import { fetchProductDetails } from "@/store/shop/products-slice";
import {
  getSearchResults,
  resetSearchResults,
} from "@/store/shop/search-slice";
import { Loader2, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { useSEO } from "@/components/common/seo";
import { trackAddToCart, trackViewItem } from "@/lib/analytics";

function SearchProducts() {
  const [keyword, setKeyword] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { searchResults, isLoading } = useSelector((state) => state.shopSearch);
  const { productDetails } = useSelector((state) => state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.shopCart);
  const { toast } = useToast();

  useSEO({
    title: keyword
      ? `Search results for "${keyword}" | AARADHYA`
      : "Search Products | AARADHYA",
    description:
      "Search AARADHYA fashion by name, description, brand or category and find your next favourite outfit.",
    path: "/shop/search",
  });
  
  // Initialize keyword from URL on component mount
  useEffect(() => {
    const keywordFromUrl = searchParams.get("keyword");
    if (keywordFromUrl) {
      setKeyword(keywordFromUrl);
      dispatch(getSearchResults(keywordFromUrl));
    }
  }, []);

  // Handle search submission
  const handleSearch = (e) => {
    e?.preventDefault(); // Handle both form submit and manual calls
    
    if (keyword && keyword.trim() !== "") {
      setIsSearching(true);
      setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
      dispatch(getSearchResults(keyword))
        .finally(() => {
          setIsSearching(false);
        });
    } else {
      setSearchParams(new URLSearchParams(``));
      dispatch(resetSearchResults());
    }
  };

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getTotalStock} quantity available for this item`,
            variant: "destructive",
          });
          return;
        }
      }
    }

    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        const addedProduct = searchResults?.find(
          (item) => String(item._id) === String(getCurrentProductId)
        );
        trackAddToCart(addedProduct || { _id: getCurrentProductId }, 1);
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product was added to your cart",
        });
      } else {
        // e.g. "Only 2 left in stock for <product>" returned by the server
        toast({
          title: data?.payload?.message || "Unable to add the item to the cart",
          variant: "destructive",
        });
      }
    });
  }

  function handleGetProductDetails(getCurrentProductId) {
    dispatch(fetchProductDetails(getCurrentProductId)).then((data) => {
      if (data?.payload?.success && data?.payload?.data) {
        trackViewItem(data.payload.data);
      }
    });
  }

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);

  return (
    <div className="page-sheen">
      <div className="mx-auto max-w-7xl px-4 pt-10 md:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold">
          Find Your Look
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">Search Products</h1>
      </div>
      <div className="container mx-auto md:px-6 px-4 py-8">
      
      <div className="flex justify-center mt-8 mb-8">
        <form onSubmit={handleSearch} className="w-full max-w-2xl flex gap-2 rounded-full border border-border/70 bg-card p-2 shadow-sm">
          <Input
            value={keyword}
            name="keyword"
            onChange={(event) => setKeyword(event.target.value)}
            className="rounded-full border-0 bg-transparent py-6 pl-5 shadow-none focus-visible:ring-0"
            placeholder="Search saris, gowns, brands..."
          />
          <Button 
            type="submit" 
            disabled={isSearching || isLoading}
            className="min-w-[120px] rounded-full"
          >
            {isSearching || isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <Search className="h-4 w-4 mr-2" />
                Search
              </>
            )}
          </Button>
        </form>
      </div>
      
      {isLoading || isSearching ? (
        <div className="flex flex-col items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin mb-4" />
          <p>Searching for products...</p>
        </div>
      ) : searchResults.length === 0 ? (
        <div className="text-center py-8">
          {keyword && keyword.trim() !== "" ? (
            <>
              <h2 className="text-xl font-semibold mb-2">No products found for "{keyword}"</h2>
              <p className="text-muted-foreground">
                Try using different keywords or browse our categories.
              </p>
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold mb-2">Enter a search term above</h2>
              <p className="text-muted-foreground">
                Search for products by name, description, brand, or category.
              </p>
            </>
          )}
        </div>
      ) : (
        <>
          <p className="mb-4">Found {searchResults.length} product(s) for "{keyword}"</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {searchResults.map((item) => (
              <ShoppingProductTile
                key={item._id} // Add missing key prop
                handleAddtoCart={handleAddtoCart}
                product={item}
                handleGetProductDetails={handleGetProductDetails}
              />
            ))}
          </div>
        </>
      )}
      
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
        handleAddtoCart={handleAddtoCart}
        handleGetProductDetails={handleGetProductDetails}
      />
      </div>
    </div>
  );
}

export default SearchProducts;








