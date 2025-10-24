import express from 'express';
import { readFile } from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3130;

// Necesario para que 'path.join' funcione correctamente con import/export
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE_PATH = path.join(__dirname, 'cuentas.json');


// RUTA GET /cuentas
app.get('/cuentas', (req, res) => {

    if (cuentas.length === 0) {
        return handleNoData(res);
    }

    res.status(200).json({
        count: cuentas.length,
        data: cuentas
    });
});


// RUTA GET /cuenta/:id
app.get('/cuenta/:id', (req, res) => {

    if (cuentas.length === 0) {
        return handleNoData(res);
    }

    const idParam = req.params.id;
    const cuentaEncontrada = cuentas.find(cuenta => cuenta._id === idParam);

    if (cuentaEncontrada) {
        res.status(200).json({
            finded: true,
            account: cuentaEncontrada
        });
    } else {
        res.status(404).json({
            finded: false,
            account: {}
        });
    }
});

// RUTA GET /cuentas/buscar
app.get('/cuentas/buscar', (req, res) => {

    if (cuentas.length === 0) {
        return handleNoData(res);
    }

    const queryKeys = Object.keys(req.query);
    const queryParam = queryKeys.length > 0 ? queryKeys[0] : null;
    const queryValue = req.query[queryParam];

    if (!queryParam || !queryValue) {
        //Ejemplo: /cuentas/buscar?gender=male"
        return res.status(400).json({
            finded: false,
            message: "Error: Se requiere un parametro de busqueda."
        });
    }

    const resultados = cuentas.filter(cuenta => {
        const valorCuenta = cuenta[queryParam];

        if (typeof valorCuenta === 'string') {
            return valorCuenta.toLowerCase().includes(queryValue.toLowerCase());
        }
        return valorCuenta == queryValue;
    });

    // Respuesta 
    if (resultados.length === 1) {
        return res.status(200).json({ finded: true, account: resultados[0] });
    } else if (resultados.length > 1) {
        return res.status(200).json({ finded: true, count: resultados.length, data: resultados });
    } else {
        return res.status(404).json({ finded: false, message: `No se encontraron cuentas con ${queryParam} igual a ${queryValue}` });
    }
});

// RUTA GET /cuentasBalance
app.get('/cuentasBalance', (req, res) => {

    if (cuentas.length === 0) {
        return handleNoData(res);
    }

    const activeCuentas = cuentas.filter(cuenta => cuenta.isActive === true);

    if (activeCuentas.length === 0) {
        return res.status(200).json({
            status: false,
            accountBalance: "0",
            message: "No hay cuentas activas para calcular el balance."
        });
    }
    const totalBalance = activeCuentas.reduce((sum, cuenta) => {
        if (typeof cuenta.balance === 'string') {
            const balanceValue = parseFloat(cuenta.balance.replace('$', '').replace(/,/g, ''));
            return sum + balanceValue;
        }
        return sum;
    }, 0);

    const formattedTotalBalance = `$${totalBalance.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}`;

    res.status(200).json({
        status: true,
        accountBalance: formattedTotalBalance
    });
});


    app.listen(PORT, () => {
        console.log(`Server running at http://localhost:${PORT}`);
    });

