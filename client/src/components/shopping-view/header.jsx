import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, ShoppingBag, UserRoundCog, LogOut, Sparkles } from "lucide-react";
import { logoutUser } from "@/store/auth-slice";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { shoppingViewHeaderMenuItems } from "@/config";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  Avatar,
  AvatarFallback
} from "@/components/ui/avatar";
import UserCartWrapper from "./cart-wrapper";


function MenuItems({ onNavigate }) {
  return (
    <nav className="flex flex-col gap-1 lg:mb-0 lg:flex-row lg:items-center lg:gap-1">
      {shoppingViewHeaderMenuItems.map(menuItem => (
        <NavLink
          className={({ isActive }) =>
            `relative rounded-full px-4 py-2 text-[13px] font-medium uppercase tracking-[0.14em] transition-colors ${
              isActive
                ? "text-primary"
                : "text-foreground/70 hover:text-primary"
            }`
          }
          key={menuItem.id}
          to={menuItem.path}
          onClick={onNavigate}
        >
          {menuItem.label}
        </NavLink>
      ))}
    </nav>
  );
}

function HeaderRightContent() {
  const [openCartSheet, setOpenCartSheet] = useState(false);

  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    dispatch(logoutUser());
    navigate('/auth/login'); // Navigate to login page after logout
  }

  useEffect(() => {
    dispatch(fetchCartItems(user?.id));
  }, [dispatch]);

  console.log(cartItems, "Aaradhya");


  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">


<Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => setOpenCartSheet(true)}
          variant="outline"
          size="icon"
          className="relative rounded-full border-border hover:border-primary hover:text-primary"
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="absolute top-[-6px] right-[-4px] flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-semibold text-primary-foreground">
            {cartItems?.items?.length || 0}
          </span>
          <span className="sr-only">User cart</span>
        </Button>
        <UserCartWrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={
            cartItems && cartItems.items && cartItems.items.length > 0
              ? cartItems.items
              : []
          }
        />
      </Sheet>


      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="w-10 h-10 bg-primary flex items-center justify-center rounded-full cursor-pointer ring-2 ring-gold ring-offset-2">
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {user?.userName?.[0]?.toUpperCase() || ''}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>

          <DropdownMenuContent side="right" className="w-56">
          <DropdownMenuLabel>Logged in as {user?.userName}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate('/shop/account')}>
            <UserRoundCog className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>




    </div>
  );
}

function ShoppingHeader() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="flex items-center justify-center gap-2 bg-primary px-4 py-2 text-center text-[12px] font-medium uppercase tracking-[0.18em] text-primary-foreground">
        <Sparkles className="h-3.5 w-3.5 text-gold" />
        <span>Complimentary shipping on orders over Rs. 150 — festive edit live now</span>
        <Sparkles className="h-3.5 w-3.5 text-gold" />
      </div>
      <div className="border-b border-border/70 bg-background/90 backdrop-blur-md">
        <div className="relative mx-auto flex h-[72px] max-w-7xl items-center justify-between px-4 md:px-6">
          <Link to="/shop/home" className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-display text-xl font-bold text-gold">
              A
            </span>
            <span className="leading-none">
              <span className="block font-display text-[26px] font-bold tracking-wide text-primary">
                Aaradhya
              </span>
              <span className="block text-[10px] font-medium uppercase tracking-[0.32em] text-gold">
                Chic &amp; Luxury
              </span>
            </span>
          </Link>


          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="rounded-full lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle header menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs bg-background">
              <MenuItems />
              <HeaderRightContent />
            </SheetContent>
          </Sheet>

          <div className="hidden lg:block">
            <MenuItems />
          </div>



          <div className="hidden lg:block">
            <HeaderRightContent />
          </div>
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
