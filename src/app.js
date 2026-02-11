import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import dotenv from 'dotenv';

import productRouter from './routes/productRouter.js';
import cartRouter from './routes/cartRouter.js';
import viewsRouter from './routes/viewsRouter.js';
import sessionsRouter from './routes/sessions.router.js';

import { initializePassport } from './config/passport.config.js';
import __dirname from './utils/constantsUtil.js';
import websocket from './websocket.js';

// 🔹 Config ENV
dotenv.config();

const app = express();

// 🔹 MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Atlas connected"))
  .catch(err => {
    console.error("❌ Mongo connection error:", err);
    process.exit(1);
  });

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/../views');
app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());

initializePassport();
app.use(passport.initialize());

app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/sessions', sessionsRouter);
app.use('/', viewsRouter);

const PORT = process.env.PORT || 8080;

const httpServer = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

const io = new Server(httpServer);
websocket(io);
