import { useSelector, useDispatch } from 'react-redux'; // Add useSelector import
import ProductFilter from "@/components/shopping-view/filter";
import { DropdownMenu, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { ArrowUpDown, ArrowUpDownIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";
import { sortOptions } from "@/config";
import { useToast } from "@/components/ui/use-toast";
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from "@/store/shop/products-slice";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ShoppingProductTile from '@/components/shopping-view/product-tile';
import ProductDetailsDialog from '@/components/shopping-view/product-details';
import AdBanner from '@/components/shopping-view/ad-banner';
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice';
import { useSEO } from "@/components/common/seo";
import { trackAddToCart, trackViewItem } from "@/lib/analytics";


function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  for (const [key, value] of Object.entries(filterParams)) {
    if (Array.isArray(value) && value.length > 0) {
      const paramValue = value.join(",");

      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
    }
  }

  console.log(queryParams, "queryParams");

  return queryParams.join("&");
}

function ShoppingListing() {

  const dispatch = useDispatch();
  const { productList, productDetails } = useSelector(state => state.shopProducts); 
  const { cartItems } = useSelector((state) => state.shopCart);
  const  {user}=useSelector(state=>state.auth)
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const { toast } = useToast();

  useSEO({
    title: "Shop All Products | AARADHYA",
    description:
      "Browse all AARADHYA products - casual, party and wedding wears. Filter by category and brand, sort by price or title.",
    path: "/shop/listing",
  });

  function handleSort(value) {
    setSort(value);
  }
  
  function handleFilter(getSectionId, getCurrentOption){
    
    let cpyFilters = { ...filters };
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);
    if (indexOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption],
      };
    } else {
      const indexOfCurrentOption =
        cpyFilters[getSectionId].indexOf(getCurrentOption);

      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));

  }

  function handleGetProductDetails(getCurrentProductId) {
    console.log(getCurrentProductId);
    dispatch(fetchProductDetails(getCurrentProductId)).then((data) => {
      if (data?.payload?.success && data?.payload?.data) {
        trackViewItem(data.payload.data);
      }
    });
  }

  function handleAddtoCart(getCurrentProductId, getTotalStock) {
    if (!user?.id) {
      toast({
        title: "Please log in to add items to the cart",
        variant: "destructive",
      });
      return;
    }
    console.log(cartItems);
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
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
        const addedProduct = productList?.find(
          (item) => String(item._id) === String(getCurrentProductId)
        );
        trackAddToCart(addedProduct || { _id: getCurrentProductId }, 1);
        dispatch(fetchCartItems(user?.id));
        toast({
          title: "Product is added to cart",
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

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {});
  }, []);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      setSearchParams(new URLSearchParams(createQueryString));
    }
  }, [filters]);

  useEffect(() => {
    if (filters !== null && sort !== null)
    dispatch(fetchAllFilteredProducts({ filterParams: filters, sortParams: sort }));
  }, [dispatch, sort, filters]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);





  return (
    <div className="page-sheen">
      <div className="mx-auto max-w-7xl px-4 pt-10 md:px-6">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold">
          The Collection
        </p>
        <h1 className="mt-2 font-display text-4xl font-bold md:text-5xl">All Products</h1>
        <p className="mt-2 max-w-xl font-light text-muted-foreground">
          Filter by category and designer, then sort to find your perfect piece.
        </p>
      </div>
      <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-[240px_1fr] gap-6 p-4 md:p-6">
      <ProductFilter filters={filters} handleFilter={handleFilter}/>

      <div className="flex flex-col gap-6">
      <AdBanner placement="listing-top" />
      <div className="bg-card w-full rounded-2xl border border-border/70 shadow-sm">
        
        <div className="p-5 border-b border-border/70 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">{productList?.length ?? 0} Styles</h2>
          <div className="flex items-center gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 rounded-full px-4"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-[200px]">
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map(sortItem => (
                    <DropdownMenuRadioItem value={sortItem.id} key={sortItem.id}>
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-5">

          
{
  productList && productList.length > 0 ?
  productList.map(productItem => (
    <ShoppingProductTile handleGetProductDetails={handleGetProductDetails} key={productItem._id} product={productItem}
    handleAddtoCart={handleAddtoCart}
    
    
    />
  )) : null
}

        </div>
      </div>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
        handleAddtoCart={handleAddtoCart}
        handleGetProductDetails={handleGetProductDetails}
      />

      </div>
      </div>
    </div>
  );
}
export default ShoppingListing;




