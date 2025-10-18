import express from "express";
import session from "express-session";
import redis from "./lib/redis";
import  { RedisStore } from "connect-redis";
import { errorHandler } from "./middleware/errorHandler";
import registrationRoutes from "./routes/auth/registration.routes";
import stripeCustomerCardAttatchRoutes from "./routes/stripe/stripeCustomer.route";
import loginRoutes from "./routes/auth/login.route";
import categoryRoutes from "./routes/category/category.route";
import auctionRouter from "./routes/auction/auction.route";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin : "*",
    methods : ["GET","POST","PUT","DELETE"],
    credentials : true,
}));


const redisStore = new RedisStore({
    client: redis,
    prefix : "sess:"
});

app.use(session({
    store : redisStore,
    secret : "alkdsfjlajsd",
    resave : false,
    saveUninitialized : false,
    cookie : {
        secure : false,
        httpOnly : false,
        maxAge: 1000 * 60 * 60 * 24,
    }
}));

// Routes
app.use("/api/user", registrationRoutes , loginRoutes);
app.use("api/stripe", stripeCustomerCardAttatchRoutes);
app.use("/api/category",categoryRoutes );
app.use("/api/auction", auctionRouter);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;
