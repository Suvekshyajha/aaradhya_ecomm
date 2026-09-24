import { Outlet } from "react-router-dom";
import ShoppingHeader from "./header";
import ShoppingFooter from "./footer";


function ShoppingLayout() {
    return (
        <div className="flex min-h-screen flex-col bg-background overflow-hidden">
            {/* header */}
            <ShoppingHeader />
            <main className="flex w-full flex-1 flex-col">
                <Outlet />
            </main>
            <ShoppingFooter />
        </div>
    );
}

export default ShoppingLayout;







