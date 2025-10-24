import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import bodyParser from "body-parser";
import cors from "cors";
import cuentas from "./cuentas.json"

const app = express();
const PORT = 3130;

const cuentas = require('./cuentas.json');

// Ruta GET /Cuentas
app.get('/cuentas', (req, res) => {
    const count = cuentas.length;
    const data = cuentas; 
    
    res.status(200).json({
        count: count,
        data: data
    });
});

app.listen(PORT, () =>
    console.log(`Server running at http://localhost:${PORT}`)
);

