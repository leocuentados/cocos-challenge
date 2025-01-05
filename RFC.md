# Arquitectura

### Puntos clave
* La decision de usar microservicios y orientarlo a eventos fue para que el sistema sea mas escalable y las acciones se encuentren desacopladas unas de otras y que puedan escalar independientemente, sin que compitan en recursos entre ellas (por ejemplo, el volumen de consultas que reciba para conocer el portfolio de los usuarios es distinto al volumen o el tipo de carga que implica crear ordenes y matchearlas entre si).
* El usar SQS para la comunicacion entre servicios permite que si un servicio no esta disponible entonces la solicitud no se pierde, sino que queda persistida en el mensaje que viaja por la cola hasta que el sistema pueda procesarlo.
* Para todos los microservicios se uso nodejs, usando nest.js y typeorm para los servicios con mucha interaccion con tablas SQL dada la facilidad para integrarse con estas, el resto de los servicios se uso express.js ya que da mas versatilidad y facilidad en otros casos en los que no hay un modelo relacional (por ejemplo integraciones con SQS o con DynamoDB). Sin embargo esta fue una forma opinionada de elegir estos frameworks, la realidad es que podria haberse usado solo uno de los dos para todo, los elegi segun lo que me resultaba mas rapido de implementar en cada caso. 

### Microservicios
* cocos-api: recibe peticiones para
    - crear una orden
    - buscar instrumentos
    - ver el portfolio de activos una persona
* order-validation-ms: recibe solicitudes de creacion de ordenes, evalua si pueden ser creadas y genera eventos para crearlas.
* order-matching-ms: encargado de recibir eventos de creacion de ordenes, matchear compras con ventas de manera transaccional y emitir eventos con los resultados de c/u.
* information-ms: centraliza informacion de usuarios, instrumentos, ordenes completadas y marketdata. Adicionalmente para pruebas se provee un endpoint para ingresar o egresar dinero a un usuario.
* portfolio-ms: cache de portfolio de activos de todas las personas del sistema.

# Implementacion
### Buscar instrumentos por ticker o por nombre
- Mediante `cocos-api` consultamos la busqueda del instrumento a partir de un parametro de busqueda (string). Este mismo consulta a `information-ms` el cual busca en postgreSQL en la tabla `instruments` hasta 10 activos que coincidan con el parametro de busqueda, de los cuales hasta 5 corresponden a la busqueda por ticker y hasta 5 a la busqueda por nombre.

### Obtener portfolio
- Mediante `cocos-api` consultamos el portfolio de una persona. Este mismo consulta a `portfolio-ms` el cual responde cruzando marketdata del momento obtenida de `information-ms` con data que tenga almacenada del usuario en la dynamo de `PortfolioCache`.
- El portfolio se actualiza a medida que en `information-ms` se registran ordenes ejecutadas. En ese momento el servicio emite eventos capturados por `portfolio-ms` que contiene las ordenes de compra/venta ejecutadas en una misma operacion, persistiendo para los usuarios involucrados en la operacion el nuevo monto de dinero disponible calculado a partir del cash-in/cash-out e informacion de las ordenes ejecutadas (id de instrumento, monto, precio promedio de ejecucion y cantidad).
- Para el challenge adicionalmente hay que popular la dynamo por primera vez a partir de las ordenes que ya fueron ejecutadas, esto se hace a partir de un proceso que ocurre en `information-ms` la primera vez que inicia el servicio y que genera los eventos necesarios para llenar la tabla ya que a causa de que la dynamo esta dentro de un container de localstack el mismo no persiste data. En un escenario normal se deberia ejecutar el mismo proceso una sola vez por fuera del sistema y que no dependa del inicio del servicio.

### Crear ordenes
- WIP

# FAQ
**Por que el Marketdata no se actualiza a medida que ocurren compras y ventas?**
- Como parte de la solicitud pide no simular el comportamiento del mercado, el actualizar el marketdata quedo pendiente. Asumi que el marketdata provisto es una cache que se actualiza a partir de otro sistema hipotetico que se encarga de escuchar eventos de ordenes completadas, ir actualizando sus valores y generando eventos para que el `information-ms` los escuche y actualice su marketdata.

**Por que el precio actual de cada activo se calcula con el ultimo valor de cierre?**
- Incluido tambien en la solicitud de no simular el comportamiento del mercado y al no disponer de la unidad de tiempo en la cual ocurriran las operaciones, decidi no usar los valores de open/high/low del marketdata y simplemente usar el close. En otra iteracion se puede, usando una unidad de tiempo, detectar si el calculo de precio de activos debe hacerse dentro de horario de mercado (usando open/high/low) o fuera (usando close).
