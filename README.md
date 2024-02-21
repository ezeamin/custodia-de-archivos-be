# Backend de ejemplo

Descripción corta del proyecto.

## Requisitos

> [!NOTE]
> Es necesario tener Node.js 20.6+ instalado en la PC, y ya creada una instancia en la nube de una base de datos en PostgreSQL. La conexión se hace por medio de Prisma y un URI ubicado en el archivo `.env`.

- [Node.js](https://nodejs.org/en/) -> Importante: Debe ser 20.6+ para que funcione el archivo `.env`
- [pnpm](https://pnpm.io/es/) -> Para el manejo de dependencias
  - Para instalarlo, correr el comando `npm i -g pnpm`

## Instalación

1. Clonar este repositorio.
2. Ejecutar `pnpm i` para instalar las dependencias.
3. Ejecutar `prisma generate` para generar el cliente de prisma.

## Configuración

1. Crear un archivo `.env.production` y `.env.production` en la raíz del proyecto y configurar las variables de entorno necesarias, que están definidas en el archivo `.env_sample`.
2. Si se quisiera regenerar la base de datos (`prisma db pull`), será necesario crear un archivo `.env` en la raíz del proyecto y configurar las variables de entorno de la base de datos (`DATABASE_URL` y `DIRECT_URL`), que están definidas en el archivo `.env_sample`. Esto servirá para prisma que no diferencia entre los distintos `.env`s del proyecto.

## Uso

- Opcion 1: Hacer el build

  Para iniciar el servidor, ejecutar:

  ```bash
  pnpm build
  ```

  y con la build ya realizada, ejecutar:

  ```bash
  pnpm start
  ```

- Opcion 2: Modo desarrollo

  Sino, puede correrse en modo desarrollo utilizando:

  ```bash
  pnpm dev
  ```

## Equipo

- [Valentina Ormaechea](***)
- [Ezequiel Amin](https://github.com/ezeamin)
