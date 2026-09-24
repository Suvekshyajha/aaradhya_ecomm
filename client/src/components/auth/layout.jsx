import { Outlet } from "react-router-dom";
import bannerImage from "../../assets/d2.webp";

function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full bg-background">

      <div className="relative hidden w-1/2 overflow-hidden lg:block">
        <img
          src={bannerImage}
          alt="AARADHYA festive fashion editorial"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#2b0f1e]/90 via-[#2b0f1e]/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-12 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            AARADHYA
          </p>
          <h1 className="mt-3 font-display text-4xl font-bold leading-tight">
            Elegance is an attitude, wear it daily.
          </h1>
          <p className="mt-3 max-w-md font-light text-white/80">
            Join AARADHYA for curated festive fashion, secure checkout and
            members-only drops.
          </p>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md rounded-3xl border border-border/70 bg-card p-8 shadow-xl shadow-primary/5 sm:p-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
