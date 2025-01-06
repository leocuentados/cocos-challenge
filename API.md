# Cocos-api
### Obtener Portfolio
* `GET /api/portfolio?userId={userId}`
* El portfolio se crea a partir de las ordenes ejecutadas (incluyendo cash-in/cash-out). Cualquier usuario que no tenga ordenes ejecutadas previamente no tendra porfolio.
* Respuesta 200:
```
{
    "userId": "1",
    "portfolioId": "934361dd-dfe7-4ade-98b3-f6dc0f37d5d3",
    "availableMoneyAmount": 9000002,
    "instruments": [
        {
            "instrumentId": 47,
            "quantity": 400,
            "originalPrice": 930,
            "currentPrice": 925.85,
            "previousPrice": 921.8,
            "balance": -0.4462365591397825,
            "dailyBalance": 0.4393577782599336
        },
        {
            "instrumentId": 54,
            "quantity": 5000,
            "originalPrice": 250,
            "currentPrice": 229.5,
            "previousPrice": 232,
            "balance": -8.200000000000001,
            "dailyBalance": -1.0775862068965518
        }
    ],
    "currentPrice": 10517842
}
```
* Si no tiene ninguna cantidad de algun instrumento, la lista de instrumentos vendra vacia.
* availableMoneyAmount representa el dinero en pesos disponible.
* balance de cada instrumento representa la relacion porcentual del precio actual con respecto al precio original.
* dailyBalance de cada instrumento representa la relacion porcentual del precio actual con respecto al precio de ayer.
* currentPrice del portfolio representa la suma de availableMoneyAmount y la suma del currentPrice de todos los instrumentos.
* todos los balances y precios se calculan en el momento usando Marketdata, salvo por el originalPrice.
* Respuesta 404 (si no existe portfolio del usuario):
```
{
    "message": "Request failed with status code 404"
}
```

### Buscar Instrumento por ticker o por nombre
* `GET /api/instruments/search?searchParam={string}`
* Si el parametro de busqueda no coincide con ningun instrumento, entonces devuelve una lista vacia.
* Si no se provee ningun parametro de busqueda, entonces devuelve error 400.
* Respuesta 200:
```
[
    {
        "id": 34,
        "ticker": "GGAL",
        "name": "Grupo Financiero Galicia",
        "type": "ACCIONES"
    },
    {
        "id": 39,
        "ticker": "GCLA",
        "name": "Grupo Clarin S.A.",
        "type": "ACCIONES"
    },
    {
        "id": 56,
        "ticker": "SUPV",
        "name": "Grupo Supervielle S.A.",
        "type": "ACCIONES"
    }
]
```

### Crear orden
```
curl --location '{COCOS_API_URL}/api/orders' \
--header 'Content-Type: application/json' \
--data '{
    "userId": "1",
    "instrumentId": "1",
    "side": "BUY",
    "size": 1,
    "price": 1,
    "type": "MARKET"
}'
```
* El side debe ser "BUY" o "SELL", el type "MARKET" o "LIMIT" y todos los campos son requeridos. Si no se cumple cualquiera retorna error 400.
* Respuesta 202:
```
{
    "message": "Order created for user 1"
}
```
* Respuesta 404 (si el usuario no existe):
```
{
    "message": "User 0 does not exists"
}
```

# Information-ms
* Si bien el servicio implementa varios endpoints hay solo uno relevante para pruebas manuales.

### Crear ordenes cash-in/cash-out
```
curl --location '{INFORMATION_MS_URL}/orders/money' \
--header 'Content-Type: application/json' \
--data '{
    "side": "CASH_IN",
    "price": 999999999,
    "userId": 1
}'
```
* Respuesta 201 si se logro crear la orden.