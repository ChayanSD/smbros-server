import express from "express";
import session from "express-session";
import redis from "./lib/redis";
import  { RedisStore } from "connect-redis";
import { errorHandler } from "./middleware/errorHandler";
import config from "./config/config";
import registrationRoutes from "./routes/auth/registration.routes";
import stripeCustomerCardAttatchRoutes from "./routes/stripe/stripeCustomer.route";
import loginRoutes from "./routes/auth/login.route";
import categoryRoutes from "./routes/category/category.route";
import auctionRouter from "./routes/auction/auction.route";
import auctionItemRouter from "./routes/auction/auctionItem.route";
import userRoutes from "./routes/user/user.route";
import bidRoutes from "./routes/bid/bid.route";
import cors from "cors";


const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const isProd = config.nodeEnv === "production";

app.use(cors({
   origin: isProd
        ? "https://auction-site-ten.vercel.app"
        : "http://localhost:3000",
    credentials : true,
}));

if (isProd) {
    app.set('trust proxy', 1);
}

const redisStore = new RedisStore({
    client: redis,
    prefix : "sess:"
});

app.use(session({
    store : redisStore,
    secret : config.sessionSecret,
    resave : false,
    saveUninitialized : false,
    cookie : {
        secure : isProd,
        httpOnly : true,
        sameSite : isProd ? "none" : "lax",
        domain: isProd ? ".vercel.app" : undefined,
        maxAge: 1000 * 60 * 60 * 24,
    }
}));

// Routes
app.use("/api/user", registrationRoutes , loginRoutes , userRoutes);
app.use("/api/stripe", stripeCustomerCardAttatchRoutes);
app.use("/api/category",categoryRoutes );
app.use("/api/auction", auctionRouter);
app.use("/api/auction-item",auctionItemRouter)
app.use("/api/bid", bidRoutes);
// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
