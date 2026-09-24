require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");
const adminAdsRouter = require("./routes/admin/ads-routes");
const shopProductsRouter = require("./routes/shop/products-routes");
const shopAdsRouter = require("./routes/shop/ads-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopOrderRouter = require("./routes/shop/order-routes");

// Fail fast when required secrets are missing instead of booting with an
// undefined JWT secret / database connection.
const requiredEnvVars = ["MONGODB_URI", "JWT_SECRET"];
const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingEnvVars.length) {
    throw new Error(
        `Missing required environment variable(s): ${missingEnvVars.join(
            ", "
        )}. Copy server/.env.example to server/.env and fill in the values.`
    );
}

// All connection strings / credentials live in server/.env (git-ignored)
mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log("MongoDb connected"))
    .catch((error) => console.log(error));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
    cors({
        // Comma-separated allowlist, e.g. CLIENT_URL=http://localhost:5173,http://localhost:5174
        origin: (process.env.CLIENT_URL || "http://localhost:5173")
            .split(",")
            .map((entry) => entry.trim())
            .filter(Boolean),
        methods: ["GET", "POST", "DELETE", "PUT"],
        allowedHeaders: [
            "Content-Type",
            "Authorization",
            "Cache-Control",
            "Expires",
            "Pragma",
        ],
        credentials: true,
    })
);

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/admin/ads", adminAdsRouter);
app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/ads", shopAdsRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/search", shopSearchRouter);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));