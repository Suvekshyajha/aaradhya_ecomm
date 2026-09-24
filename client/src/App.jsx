


// import { Routes, Route } from "react-router-dom";
// import AuthLayout from "./components/auth/layout";
// import AuthLogin from "./pages/auth/login";
// import AuthRegister from "./pages/auth/register";
// import AdminLayout from "./components/admin-view/layout";
// import AdminDashboard from "./pages/admin-view/dashboard";
// import AdminProducts from "./pages/admin-view/products";
// import AdminOrders from "./pages/admin-view/orders";
// import AdminFeatures from "./pages/admin-view/features";
// import ShoppingLayout from "./components/shopping-view/layout";
// import NotFound from "./pages/not-found";
// import ShoppingHome from "./pages/shopping-view/home";
// import ShoppingListing from "./pages/shopping-view/listing";
// import ShoppingCheckout from "./pages/shopping-view/checkout";
// import ShoppingAccount from "./pages/shopping-view/account";
// import CheckAuth from "./components/common/check-auth";
// import UnauthPage from "./pages/unauth-page";
// import SearchProducts from "./pages/shopping-view/search";



// function App() {
//   const isAuthenticated = true;
//   const user = {
//     name: "Alisha",
//     role: "admin", // Add role to avoid undefined behavior
//   };

//   return (
//     <div className="flex flex-col overflow-hidden bg-white">
//       <Routes>
//         {/*  Allow Unauthenticated Users to Access Auth Pages */}




//         <Route path="/auth/*" element={<AuthLayout />}>
//           <Route path="login" element={<AuthLogin />} />
//           <Route path="register" element={<AuthRegister />} />
//         </Route>

//         {/* Protect Admin Routes */}
//         <Route
//           path="/admin/*"
//           element={
//             <CheckAuth isAuthenticated={isAuthenticated} user={user}>
//               <AdminLayout />
//             </CheckAuth>
//           }
//         >
//           <Route path="dashboard" element={<AdminDashboard />} />
//           <Route path="products" element={<AdminProducts />} />
//           <Route path="orders" element={<AdminOrders />} />
//           <Route path="features" element={<AdminFeatures />} />
//         </Route>

//         {/*  Protect Shopping Routes */}
//         <Route
//           path="/shop/*"
//           element={
//             <CheckAuth isAuthenticated={isAuthenticated} user={user}>
//               <ShoppingLayout />
//             </CheckAuth>
//           }
//         >
//           <Route path="home" element={<ShoppingHome />} />
//           <Route path="listing" element={<ShoppingListing />} />
//           <Route path="checkout" element={<ShoppingCheckout />} />
//           <Route path="account" element={<ShoppingAccount />} />

//           <Route path="search" element={<SearchProducts />} />

         



        



//         </Route>

//         {/*  Unauthorized Page */}
//         <Route path="/unauth-page" element={<UnauthPage />} />

//         {/*  Catch-All Not Found */}
//         <Route path="*" element={<NotFound />} />
//       </Routes>
//     </div>
//   );
// }

// export default App;

















import { Routes, Route } from "react-router-dom";
import AuthLayout from "./components/auth/layout";
import AuthLogin from "./pages/auth/login";
import AuthRegister from "./pages/auth/register";
import AdminLayout from "./components/admin-view/layout";
import AdminDashboard from "./pages/admin-view/dashboard";
import AdminProducts from "./pages/admin-view/products";
import AdminOrders from "./pages/admin-view/orders";
import AdminFeatures from "./pages/admin-view/features";
import AdminAdvertisements from "./pages/admin-view/ads";
import ShoppingLayout from "./components/shopping-view/layout";
import NotFound from "./pages/not-found";
import ShoppingHome from "./pages/shopping-view/home";
import ShoppingListing from "./pages/shopping-view/listing";
import ShoppingCheckout from "./pages/shopping-view/checkout";
import ShoppingAccount from "./pages/shopping-view/account";
import CheckAuth from "./components/common/check-auth";
import UnauthPage from "./pages/unauth-page";
import SearchProducts from "./pages/shopping-view/search";
import About from "./pages/shopping-view/about";
import Contact from "./pages/shopping-view/contact";
import { Skeleton } from "@/components/ui/skeleton";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initGA, trackPageView } from "./lib/analytics";
import { checkAuth } from "./store/auth-slice";

function RouteChangeTracker() {
  const location = useLocation();

  useEffect(() => {
    initGA();
    trackPageView(location.pathname + location.search);
  }, [location.pathname, location.search]);

  return null;
}
import EsewaSuccessPage from "./pages/shopping-view/esewa-success";
import EsewaFailurePage from "./pages/shopping-view/esewa-failure";
import MockGatewayPage from "./pages/shopping-view/mock-gateway";
import PaymentSuccessPage from "./pages/shopping-view/payment-success";
 
function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) return <Skeleton className="w-[800] bg-black h-[600px]" />;

  console.log(isLoading, user);
  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <RouteChangeTracker />
      <Routes>
        <Route
          path="/"
          element={
            <CheckAuth
              isAuthenticated={isAuthenticated}
              user={user}
            ></CheckAuth>
          }
        />
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="features" element={<AdminFeatures />} />
          <Route path="ads" element={<AdminAdvertisements />} />
        </Route>
        <Route
          path="/shop"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShoppingLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="checkout" element={<ShoppingCheckout />} />
          <Route path="account" element={<ShoppingAccount />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} /> 
          <Route path="search" element={<SearchProducts />} />


          <Route path="esewa-success" element={<EsewaSuccessPage />} />
          <Route path="esewa-failure" element={<EsewaFailurePage />} />
          <Route path="mock-gateway" element={<MockGatewayPage />} />
          <Route path="payment-success" element={<PaymentSuccessPage />} />
          


        </Route>
        <Route path="/unauth-page" element={<UnauthPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
    // <div className="flex flex-col overflow-hidden bg-white">
    //   <Routes>
    //     {/*  Allow Unauthenticated Users to Access Auth Pages */}
        
    //     <Route path="/auth/*" element={<AuthLayout />}>
    //       <Route path="login" element={<AuthLogin />} />
    //       <Route path="register" element={<AuthRegister />} />
    //     </Route>
 
    //     {/* Protect Admin Routes */}
    //     <Route
    //       path="/admin/*"
    //       element={
    //         <CheckAuth isAuthenticated={isAuthenticated} user={user}>
    //           <AdminLayout />
    //         </CheckAuth>
    //       }
    //     >
    //       <Route path="dashboard" element={<AdminDashboard />} />
    //       <Route path="products" element={<AdminProducts />} />
    //       <Route path="orders" element={<AdminOrders />} />
    //       <Route path="features" element={<AdminFeatures />} />
    //     </Route>
 
    //     {/*  Protect Shopping Routes */}
    //     <Route
    //       path="/shop/*"
    //       element={
    //         <CheckAuth isAuthenticated={isAuthenticated} user={user}>
    //           <ShoppingLayout />
    //         </CheckAuth>
    //       }
    //     >
    //       <Route path="home" element={<ShoppingHome />} />
    //       <Route path="listing" element={<ShoppingListing />} />
    //       <Route path="checkout" element={<ShoppingCheckout />} />
    //       <Route path="account" element={<ShoppingAccount />} />
    //<Route path="about" element={<About />} />
    
    //       <Route path="about" element={<About />} />
    //       <Route path="search" element={<SearchProducts />} />
    //       <Route path="contact" element={<Contact />} />         
    //     </Route>
 
    //     {/*  Unauthorized Page */}
    //     <Route path="/unauth-page" element={<UnauthPage />} />
 
    //     {/*  Catch-All Not Found */}
    //     <Route path="*" element={<NotFound />} />
    //   </Routes>
    // </div>
  );
}
 
export default App;






 