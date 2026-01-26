import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser'; // 🔹 NUEVO
import passport from 'passport'; // 🔹 NUEVO

import productRouter from './routes/productRouter.js';
import cartRouter from './routes/cartRouter.js';
import viewsRouter from './routes/viewsRouter.js';
import sessionsRouter from './routes/sessions.router.js'; // 🔹 NUEVO

import { initializePassport } from './config/passport.config.js'; // 🔹 NUEVO

import __dirname from './utils/constantsUtil.js';
import websocket from './websocket.js';

const app = express();

// 🔹 MongoDB
const uri = 'mongodb://127.0.0.1:27017/entrega-final';
mongoose.connect(uri);

// 🔹 Handlebars Config
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/../views');
app.set('view engine', 'handlebars');

// 🔹 Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser()); // 🔹 NUEVO

// 🔹 Passport
initializePassport(); // 🔹 NUEVO
app.use(passport.initialize()); // 🔹 NUEVO

// 🔹 Routers
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);
app.use('/api/sessions', sessionsRouter); // 🔹 NUEVO
app.use('/', viewsRouter);

// 🔹 Server
const PORT = 8080;
const httpServer = app.listen(PORT, () => {
  console.log(`Start server in PORT ${PORT}`);
});

// 🔹 Socket.io
const io = new Server(httpServer);
websocket(io);
