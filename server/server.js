import './config/instrument.js'
import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'
import * as Sentry from "@sentry/node";
import { clerkWebhooks } from './controllers/webhooks.js'
import sellerRoutes from './routes/sellerRoutes.js'
import connectCloudinary from './config/cloudinary.js'
import carRoutes from './routes/carRoutes.js'
import userRoutes from './routes/userRoutes.js'
import {clerkMiddleware} from '@clerk/express'

// Initialize Express
const app = express()

// Connect to DB
await connectDB()
await connectCloudinary()

//Middlewares
app.use(cors())
app.use(express.json())
app.use(clerkMiddleware())

//Routes
app.get('/', (req, res) => res.send('API is working'))
app.get("/debug-sentry", function mainHandler(req, res) {
  throw new Error("My first Sentry error!");
});
// Webhook route needs raw body for signature verification
app.post('/webhooks', express.raw({ type: 'application/json' }), clerkWebhooks)
app.use('/api/sellers', sellerRoutes)
app.use('/api/cars', carRoutes)
app.use('/api/users', userRoutes)

//Port
const PORT = process.env.PORT || 5000

Sentry.setupExpressErrorHandler(app);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})