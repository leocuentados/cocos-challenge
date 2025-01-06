# cocos-challenge

## Pasos para levantar el sistema
 1. Asegurarse de tener instalado Docker y ejecutarlo
 2. asegurarse de haber copiado el archivo `.env` en la raiz del proyecto provisto por mail
 3. ejecutar el comando `docker-compose up` desde la raiz del proyecto

Todas las consideraciones tecnicas y de arquitectura fueron detalladas en el archivo [RFC.md](/RFC.md).

La documentacion provista de como interactuar con el sistema se encuentra detallada en el archivo [API.md](/API.md).

Se encuentra disponible una coleccion de postman para interactuar con el sistema en el archivo cocos.postman-collection.json (la misma incluye tambien tests funcionales).

Tener en cuenta que la base de datos provista anteriormente (ElephantSQL) va a dejar de funcionar a partir del 27 de enero de 2025, fecha a partir de la cual el sistema dejara de funcionar correctamente: https://www.elephantsql.com/blog/end-of-life-announcement.html.