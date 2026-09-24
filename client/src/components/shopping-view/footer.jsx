import { Link } from "react-router-dom";

function ShoppingFooter() {
  return (
    <footer className="mt-auto bg-[#2b0f1e] text-[#f5e9dd]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 md:grid-cols-4 md:px-6">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold font-display text-xl font-bold text-[#2b0f1e]">
              G
            </span>
            <span className="leading-none">
              <span className="block font-display text-2xl font-bold tracking-wide">
                Aaradhya
              </span>
              <span className="block text-[10px] font-medium uppercase tracking-[0.32em] text-gold">
                Chic &amp; Luxury
              </span>
            </span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[#f5e9dd]/70">
            Handpicked traditional and modern fashion, crafted with premium
            fabrics for every occasion.
          </p>
        </div>

        <div>
          <h5 className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
            Shop
          </h5>
          <ul className="mt-4 space-y-2.5 text-sm text-[#f5e9dd]/80">
            <li><Link className="transition-colors hover:text-gold" to="/shop/listing">All Products</Link></li>
            <li><Link className="transition-colors hover:text-gold" to="/shop/search">Search</Link></li>
            <li><Link className="transition-colors hover:text-gold" to="/shop/checkout">Checkout</Link></li>
            <li><Link className="transition-colors hover:text-gold" to="/shop/account">My Orders</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
            Company
          </h5>
          <ul className="mt-4 space-y-2.5 text-sm text-[#f5e9dd]/80">
            <li><Link className="transition-colors hover:text-gold" to="/shop/about">About Us</Link></li>
            <li><Link className="transition-colors hover:text-gold" to="/shop/contact">Contact Us</Link></li>
            <li><Link className="transition-colors hover:text-gold" to="/shop/home">Home</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="text-sm font-semibold uppercase tracking-[0.2em] text-gold">
            Customer Care
          </h5>
          <ul className="mt-4 space-y-2.5 text-sm text-[#f5e9dd]/80">
            <li>Store Policy</li>
            <li>Secure eSewa Payments</li>
            <li>Easy Returns</li>
            <li>FAQ</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="mx-auto max-w-7xl px-4 py-5 text-center text-xs tracking-wide text-[#f5e9dd]/60 md:px-6">
          © {new Date().getFullYear()} AARADHYA — All Rights Reserved
        </p>
      </div>
    </footer>
  );
}

export default ShoppingFooter;
