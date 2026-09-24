

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import accImg from "../../assets/hunx.avif";

import Address from "@/components/shopping-view/address";
import ShoppingOrders from "@/components/shopping-view/orders";
import { useSEO } from "@/components/common/seo";



function ShoppingAccount() {
    useSEO({
      title: "My Account | AARADHYA",
      description:
        "Manage your AARADHYA account - view orders and manage delivery addresses.",
      path: "/shop/account",
    });
    return (
        <div className="flex flex-col page-sheen">
            <div className="relative h-[260px] w-full overflow-hidden">
                <img
                    src={accImg}
                    className="h-full w-full object-cover object-top"
                    alt="Shopping Account"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#2b0f1e]/80 via-[#2b0f1e]/40 to-transparent" />
                <div className="absolute inset-0 mx-auto flex max-w-7xl flex-col justify-center px-4 md:px-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gold">
                    Welcome Back
                  </p>
                  <h1 className="mt-2 font-display text-4xl font-bold text-white md:text-5xl">
                    My Account
                  </h1>
                </div>
            </div>

            <div className="container mx-auto grid grid-cols-1 gap-8 py-8">
                <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
                    <Tabs defaultValue="orders">
                        <TabsList>
                            <TabsTrigger value="orders">Orders</TabsTrigger>
                            <TabsTrigger value="address">Address</TabsTrigger>
                        </TabsList>

                        <TabsContent value="orders">
                           <ShoppingOrders/>
                        </TabsContent>

                        <TabsContent value="address">
                            <Address/>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}

export default ShoppingAccount;
