# cocos-challenge

## Pasos para levantar el sistema
 1. Asegurarse de tener instalado Docker y ejecutarlo
 2. Asegurarse de haber copiado el archivo `.env` en la raiz del proyecto provisto por mail
 3. Ejecutar el comando `docker-compose up --build` desde la raiz del proyecto. Asegurarse de correrlo en una terminal bash o zsh.

Todas las consideraciones tecnicas y de arquitectura fueron detalladas en el archivo [RFC.md](/RFC.md).

La documentacion provista de como interactuar con el sistema se encuentra detallada en el archivo [API.md](/API.md).

Se encuentra disponible una coleccion de postman para interactuar con el sistema en el archivo cocos.postman-collection.json (la misma incluye tambien tests funcionales).

Tener en cuenta que la base de datos provista anteriormente (ElephantSQL) va a dejar de funcionar a partir del 27 de enero de 2025, fecha a partir de la cual el sistema dejara de funcionar correctamente: https://www.elephantsql.com/blog/end-of-life-announcement.html.

## Pasos para correr los tests funcionales
1. Asegurarse de tener instalado Postman y ejecutarlo
2. Importar la collection `cocos-challenge.postman_collection.json` disponible en el repositorio.
3. Levantar el sistema.
4. Hacer click derecho en la carpeta de la coleccion `Functional Tests` y elegir la opcion `Run Folder`. En la ventana que se despliega presionar el boton `Run Cocos Challenge`.
Los tests funcionales son idempotentes y pueden correrse sin problemas siempre y cuando no se cree manualmente el usuario `5` ni se afecte manualmente al usuario `666` usando los endpoints provistos en la carpeta `Endpoints`.

## Troubleshooting

### docker-compose levanta un warning de variables en blanco

```bash
time="2025-01-07T18:24:48-03:00" level=warning msg="The \"ORDER_MATCHING_MS_SQS_URL\" variable is not set. Defaulting to a blank string."
time="2025-01-07T18:24:48-03:00" level=warning msg="The \"DYNAMO_ENDPOINT\" variable is not set. Defaulting to a blank string."
time="2025-01-07T18:24:48-03:00" level=warning msg="The \"ORDER_MATCHING_MS_SQS_URL\" variable is not set. Defaulting to a blank string."
time="2025-01-07T18:24:48-03:00" level=warning msg="The \"ORDER_MATCHING_MS_URL\" variable is not set. Defaulting to a blank string."
```

El proyecto fue creado en una PC con Windows, esto puede ocasionar que el formato del .env se vea afectado. Para verificar que este sea el problema ejecutar este comando en la misma carpeta que el .env:

```bash
cat -A .env
```

Si en el texto se observa que cada linea tiene `^M$` al final, correr el siguiente comando estando en la misma carpeta que el .env:

```bash
tr -d '\r' < .env > .env.tmp && mv .env.tmp .env
```
