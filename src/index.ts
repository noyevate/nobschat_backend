import express  from "express";
import { json } from "body-parser";
import {autRoutes} from "routes/auth_routes"

const app = express()

app.use(json())

app.use('/auth', autRoutes);