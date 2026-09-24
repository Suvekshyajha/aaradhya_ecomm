




// import { useState, useEffect } from 'react';
// import bannerOne from '../../assets/hotgown.jpg';
// import bannerTwo from '../../assets/redhotsari.jpg';
// import bannerThree from '../../assets/panjabi.jpg';
// import { Button } from '@/components/ui/button';
// import { ChevronLeftIcon, ChevronRightIcon, CloudLightning, ShirtIcon, WatchIcon, PartyPopperIcon, HeartIcon, CrownIcon, StarIcon, GemIcon } from 'lucide-react';
// import { Card, CardContent } from '@/components/ui/card';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchAllFilteredProducts } from '@/store/shop/products-slice';
// import ShoppingProductTile from '@/components/shopping-view/product-tile';
// import { useNavigate } from 'react-router-dom';

// const categoriesWithIcon = [
//   { id: "casualwears", label: "Casual Wears", icon: ShirtIcon },
//   { id: "partywears", label: "Party Wears", icon: PartyPopperIcon },
//   { id: "weddingwears", label: "Wedding Wears", icon: HeartIcon },
// ];

// const brandsWithIcons=
// [
//   { id: "sabyasachi", label: "Sabyasachi", icon: CrownIcon },
//   { id: "biba", label: "Biba", icon: StarIcon },
//   { id: "manishMalhotra", label: "Manish Malhotra",  icon: GemIcon },
// ]

// function ShoppingHome() {
//   const slides = [bannerOne, bannerTwo, bannerThree];
//   const [currentSlide, setCurrentSlide] = useState(0);
//   const {productList} =useSelector(state=> state.shopProducts);
//   const dispatch =useDispatch();
//   const navigate = useNavigate()



//   function handleNavigateToListingPage(getCurrentItem, section){
//     sessionStorage.removeItem('filters')
//     const currentFilter ={
//       [section]: [getCurrentItem.id]
//     }

//     sessionStorage.setItem('filters', JSON.stringify(currentFilter))
//     navigate('/shop/listing')
//   }

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentSlide((prev) => (prev + 1) % slides.length);
//     }, 3000); // Change slide every 3 seconds

//     return () => clearInterval(interval); // Cleanup on component unmount
//   }, []);

//   const handlePrevSlide = () => {
//     setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
//   };

//   const handleNextSlide = () => {
//     setCurrentSlide((prev) => (prev + 1) % slides.length);
//   };

//   const handleGetProductDetails = (productId) => {
//     // Implement product details functionality
//     console.log("View product details:", productId);
//   };

//   const handleAddtoCart = (product) => {
//     // Implement add to cart functionality
//     console.log("Add to cart:", product);
//   };

//   useEffect(()=>{
//     dispatch(fetchAllFilteredProducts({filterParams :{},sortParams:'price-lowtohigh'}));
//   },[dispatch]);
  
//   console.log(productList,'productList');

//   return (
//     <div>
//       {/* Main Content with Flex Layout */}
//       <div className="flex min-h-screen">
//         {/* Text Section */}
//         <div className="flex flex-col justify-center items-start w-1/2 p-8 bg-gray-100">
//           <h1 className="text-4xl font-bold">Discover Chic & Luxury</h1>
//           <p className="mt-4 text-lg">Find the latest trends and timeless fashion pieces.</p>
//         </div>

//         {/* Image Section */}
//         <div className="relative w-1/2 h-screen overflow-hidden">
//           {slides.map((slide, index) => (
//             <img
//               src={slide}
//               key={index}
//               className={`absolute top-0 left-0 w-full h-full object-contain transition-opacity duration-1000 ${
//                 index === currentSlide ? 'opacity-100' : 'opacity-0'
//               }`}
//             />
//           ))}

//           {/* Navigation Buttons */}
//           <Button
//             variant="outline"
//             size="icon"
//             className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
//             onClick={handlePrevSlide}
//           >
//             <ChevronLeftIcon className="w-6 h-6" />
//           </Button>
//           <Button
//             variant="outline"
//             size="icon"
//             className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
//             onClick={handleNextSlide}
//           >
//             <ChevronRightIcon className="w-6 h-6" />
//           </Button>
//         </div>
//       </div>

//       {/* Shop by Category Section */}
//       <section className="py-12 bg-gray-50">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl font-bold text-center mb-8">
//             Shop by category
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
//             {categoriesWithIcon.map(categoryItem => (
//               <Card onclick={()=>handleNavigateToListingPage(categoryItem, 'category')} key={categoryItem.id} className="cursor-pointer hover:shadow-lg transition-shadow border-none">
//                 <CardContent className="flex flex-col items-center justify-center p-4">
//                   <categoryItem.icon className="w-8 h-8 mb-2 text-primary" />
//                   <span className="font-bold text-sm">{categoryItem.label}</span>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>



      


//       <section className="py-12 bg-gray-50">
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl font-bold text-center mb-8">
//             Shop by brand
//           </h2>
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
//             {brandsWithIcons.map(brandItem => (
//               <Card onclick={()=> handleNavigateToListingPage(brandItem,'brand')} key={brandItem.id} className="cursor-pointer hover:shadow-lg transition-shadow border-none">
//                 <CardContent className="flex flex-col items-center justify-center p-4">
//                   <brandItem.icon className="w-8 h-8 mb-2 text-primary" />
//                   <span className="font-bold text-sm">{brandItem.label}</span>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>
//       </section>

//       {/* Featured Products Section */}
//       <section className='py-12'>
//         <div className="container mx-auto px-4">
//           <h2 className="text-3xl font-bold text-center mb-8">
//             Feature Products
//           </h2>

//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//             {productList && productList.length > 0
//               ? productList.map((productItem) => (
//                   <ShoppingProductTile
//                     key={productItem.id || productItem._id}
//                     handleGetProductDetails={handleGetProductDetails}
//                     product={productItem}
//                     handleAddtoCart={handleAddtoCart}
//                   />
//                 ))
//               : null}
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// }

// export default ShoppingHome;














import { useState, useEffect } from 'react';
import bannerOne from '../../assets/download.webp';
import bannerTwo from '../../assets/d2.webp';
import bannerThree from '../../assets/d3.webp';
import { Button } from '@/components/ui/button';
import { ChevronLeftIcon, ChevronRightIcon, CloudLightning, ShirtIcon, WatchIcon, PartyPopperIcon, HeartIcon, CrownIcon, StarIcon, GemIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllFilteredProducts, fetchProductDetails, fetchSponsoredProducts } from '@/store/shop/products-slice';
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice';
import ShoppingProductTile from '@/components/shopping-view/product-tile';
import ProductDetailsDialog from '@/components/shopping-view/product-details';
import AdBanner from '@/components/shopping-view/ad-banner';
import { useToast } from '@/components/ui/use-toast';
import { useSEO } from '@/components/common/seo';
import { trackAddToCart, trackViewItem } from '@/lib/analytics';
import { useNavigate } from 'react-router-dom';

const categoriesWithIcon = [
  { id: "casualwears", label: "Casual Wears", icon: ShirtIcon },
  { id: "partywears", label: "Party Wears", icon: PartyPopperIcon },
  { id: "weddingwears", label: "Wedding Wears", icon: HeartIcon },
];

const brandsWithIcons=
[
  { id: "sabyasachi", label: "Sabyasachi", icon: CrownIcon },
  { id: "biba", label: "Biba", icon: StarIcon },
  { id: "manishMalhotra", label: "Manish Malhotra",  icon: GemIcon },
]

function ShoppingHome() {
  const slides = [
    { src: bannerOne, alt: "AARADHYA maroon bridal lehenga in a palace hall - hero banner" },
    { src: bannerTwo, alt: "AARADHYA champagne bridal gown on a grand staircase - hero banner" },
    { src: bannerThree, alt: "AARADHYA red bridal lehenga with gold embroidery - hero banner" },
  ];
  const [currentSlide, setCurrentSlide] = useState(0);
  const {productList, productDetails, sponsoredList} =useSelector(state=> state.shopProducts);
  const { user } = useSelector((state) => state.auth);
  const [openDetailsDialog, setOpenDetailsDialog] = useState(false);
  const dispatch =useDispatch();
  const navigate = useNavigate()
  const { toast } = useToast();

  useSEO({
    title: "AARADHYA | Chic & Luxury Fashion Online",
    description:
      "Discover chic and luxury fashion at AARADHYA - shop casual, party and wedding wears from top brands. New arrivals and featured products.",
    path: "/shop/home",
  });



  function handleNavigateToListingPage(getCurrentItem, section){
    sessionStorage.removeItem('filters')
    const currentFilter ={
      [section]: [getCurrentItem.id]
    }

    sessionStorage.setItem('filters', JSON.stringify(currentFilter))
    navigate('/shop/listing')
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handleGetProductDetails = (productId) => {
    dispatch(fetchProductDetails(productId)).then((data) => {
      if (data?.payload?.success && data?.payload?.data) {
        trackViewItem(data.payload.data);
      }
    });
  };

  const handleAddtoCart = (getCurrentProductId) => {
    if (!user?.id) {
      toast({
        title: "Please log in to add items to the cart",
        variant: "destructive",
      });
      return;
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
        toast({ title: "Product is added to cart" });
      } else {
        toast({
          title: data?.payload?.message || "Unable to add the item to the cart",
          variant: "destructive",
        });
      }
    });
  };

  useEffect(()=>{
    dispatch(fetchAllFilteredProducts({filterParams :{},sortParams:'price-lowtohigh'}));
    dispatch(fetchSponsoredProducts(8));
  },[dispatch]);

  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);
  
  console.log(productList,'productList');

  return (
    <div className="page-sheen">
      {/* Hero */}
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 pb-14 pt-10 md:grid-cols-2 md:px-6 md:pt-16">
        {/* Text Section */}
        <div className="flex flex-col items-start">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold bg-accent px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            The Festive Edit — 2026
          </span>
          <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] text-foreground md:text-6xl">
            Discover Chic <span className="italic text-primary">&amp;</span> Luxury
          </h1>
          <p className="mt-4 max-w-md text-lg font-light leading-relaxed text-muted-foreground">
            Find the latest trends and timeless fashion pieces, curated for
            every celebration.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              className="rounded-full px-8 py-6 text-sm font-semibold uppercase tracking-[0.14em]"
              onClick={() => navigate('/shop/listing')}
            >
              Shop Now
            </Button>
            <Button
              variant="outline"
              className="rounded-full px-8 py-6 text-sm font-semibold uppercase tracking-[0.14em]"
              onClick={() => navigate('/shop/search')}
            >
              Explore
            </Button>
          </div>
          <div className="mt-10 flex items-center gap-8 border-t border-border pt-6">
            {[
              { value: "500+", label: "Curated Styles" },
              { value: "20k+", label: "Happy Customers" },
              { value: "4.9", label: "Average Rating" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="font-display text-2xl font-bold text-primary">{stat.value}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Image Section */}
        <div className="relative h-[420px] overflow-hidden rounded-[2rem] shadow-2xl shadow-primary/20 md:h-[560px]">
          {slides.map((slide, index) => (
            <img
              src={slide.src}
              alt={slide.alt}
              key={index}
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : "auto"}
              decoding="async"
              className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ${
                index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/50 to-transparent" />

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 left-4 transform -translate-y-1/2 rounded-full bg-white/90 shadow-lg"
            onClick={handlePrevSlide}
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 right-4 transform -translate-y-1/2 rounded-full bg-white/90 shadow-lg"
            onClick={handleNextSlide}
          >
            <ChevronRightIcon className="w-5 h-5" />
          </Button>

          {/* Dots */}
          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                aria-label={`Go to slide ${index + 1}`}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentSlide ? 'w-8 bg-gold' : 'w-2 bg-white/70 hover:bg-white'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Shop by Category Section */}
      <section className="py-14">
        <div className="container mx-auto px-4">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.28em] text-gold">
            Curated For You
          </p>
          <h2 className="mt-2 text-center font-display text-3xl font-bold md:text-4xl">
            Shop by Category
          </h2>
          <div className="gold-rule" />
          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
            {categoriesWithIcon.map(categoryItem => (
              <Card onClick={() => handleNavigateToListingPage(categoryItem, 'category')} key={categoryItem.id} className="group cursor-pointer border-border/70 bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
                <CardContent className="flex flex-col items-center justify-center p-8">
                  <span className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary transition-colors group-hover:bg-primary">
                    <categoryItem.icon className="h-6 w-6 text-primary transition-colors group-hover:text-primary-foreground" />
                  </span>
                  <span className="mt-4 font-display text-lg font-semibold">{categoryItem.label}</span>
                  <span className="mt-1 text-xs uppercase tracking-[0.2em] text-gold">Explore →</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>



      


      <section className="bg-secondary/60 py-14">
        <div className="container mx-auto px-4">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.28em] text-gold">
            Designer Houses
          </p>
          <h2 className="mt-2 text-center font-display text-3xl font-bold md:text-4xl">
            Shop by Brand
          </h2>
          <div className="gold-rule" />
          <div className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-3">
            {brandsWithIcons.map(brandItem => (
              <Card onClick={() => handleNavigateToListingPage(brandItem, 'brand')} key={brandItem.id} className="group cursor-pointer border-border/70 bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
                <CardContent className="flex flex-col items-center justify-center p-8">
                  <brandItem.icon className="h-7 w-7 text-gold" />
                  <span className="mt-3 font-display text-lg font-semibold">{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className='py-14'>
        <div className="container mx-auto px-4">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.28em] text-gold">
            Handpicked
          </p>
          <h2 className="mt-2 text-center font-display text-3xl font-bold md:text-4xl">
            Featured Products
          </h2>
          <div className="gold-rule" />

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <ShoppingProductTile
                    key={productItem.id || productItem._id}
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddtoCart={handleAddtoCart}
                  />
                ))
              : null}
          </div>
        </div>
      </section>

      {/* Sponsored picks — paid prominent placement revenue stream */}
      {sponsoredList && sponsoredList.length > 0 ? (
        <section className='py-14 bg-secondary/60'>
          <div className="container mx-auto px-4">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.28em] text-gold">
              Sponsored
            </p>
            <h2 className="mt-2 text-center font-display text-3xl font-bold md:text-4xl">
              Sponsored Picks
            </h2>
            <div className="gold-rule" />

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {sponsoredList.map((productItem) => (
                <ShoppingProductTile
                  key={productItem.id || productItem._id}
                  handleGetProductDetails={handleGetProductDetails}
                  product={productItem}
                  handleAddtoCart={handleAddtoCart}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Paid display-advertisement strip */}
      <section className="py-10">
        <AdBanner placement="home-strip" />
      </section>

      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
        handleAddtoCart={handleAddtoCart}
        handleGetProductDetails={handleGetProductDetails}
      />
    </div>
  );
}

export default ShoppingHome;






