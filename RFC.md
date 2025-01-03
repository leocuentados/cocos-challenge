# Contexto


# Desafios tecnicos

# Implementacion

## Microservicios
* cocos-api: recibe peticiones para
    - crear una orden
    - ver las ordenes creadas y en que estado estan de un usuario
    - buscar instrumentos
    - ver el portfolio de activos una persona
* order-validation-ms: recibe solicitudes de creacion de ordenes, evalua si pueden ser creadas y genera eventos para crearlas
* order-matching-ms: encargado de recibir eventos de creacion de ordenes, matchear compras con ventas de manera transaccional y emitir eventos con los resultados de c/u
* money-orders-ms: gestiona ordenes de transacciones de dinero a partir de eventos de ordenes resueltas y disponibiliza para consulta
* information-ms: CRUD para datos de usuario, marketdata y instrumentos
* portfolio-ms: cache de portfolio de activos de todas las personas del sistema
* cocos-sls: repositorio serverless de recursos para todo el sistema
