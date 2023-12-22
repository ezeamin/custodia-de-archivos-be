# Backend de ejemplo

Descripción corta del proyecto.

## Requisitos

Es necesario tener Node.js 20.6+ instalado en la PC, y una cuenta de MongoDB para conectar con una DB propia, hosteada o local.

- [Node.js](https://nodejs.org/en/) -> Importante: Debe ser 20.6+ para que funcione el archivo `.env`
- [MongoDB](https://www.mongodb.com/)

## Instalación

1. Clonar este repositorio.
2. Ejecutar `npm install` para instalar las dependencias.

## Configuración

- Crear un archivo `.env` en la raíz del proyecto y configurar las variables de entorno necesarias, que están definidas en el archivo `.env_sample`.

## Uso

- Opcion 1: Hacer el build

  Para iniciar el servidor, ejecutar:

  ```bash
  npm run build
  ```

  y con la build ya realizada, ejecutar:

  ```bash
  npm start
  ```

- Opcion 2: Modo desarrollo

  Sino, puede correrse en modo desarrollo utilizando:

  ```bash
  npm run dev
  ```

## Documentación de API

La tabla a continuación detalla los endpoints de cada servicio disponible:

#### Usuarios:

Ruta principal: `/api/v1/users`
| Método | Endpoint | Protegido | Debe ser Admin | Descripción | Body |
| ------ | -------- | --------- | -------------- | ----------- | ---- |
| GET | `/` | ✅ | ✅ | Obtiene todos los usuarios | - |
| GET | `/:id` | ✅ | ❌ | Obtiene un usuario por su id | - |
| POST | `/` | ❌ | ❌ | Crea un nuevo usuario | `{ lastname: string, firstname: string, password: string, username: string }` |
| PUT | `/:id` | ✅ | ❌ | Actualiza un usuario por su id | `{ isAdmin?: boolean, lastname?: string, firstname?: string, password?: string, username?: string }` |
| DELETE | `/:id` | ✅ | ❌ | Elimina un usuario por su id (borrado lógico) | - |

#### Autenticación:

Ruta principal: `/api/v1/auth`
| Método | Endpoint | Protegido | Debe ser Admin | Descripción | Body |
| ------ | -------- | --------- | -------------- | ----------- | ---- |
| POST | `/login` | ❌ | ❌ |Inicia sesión con un usuario | `{ password: string, username: string }` |

#### Productos:

Ruta principal: `/api/v1/products`
| Método | Endpoint | Protegido | Debe ser Admin | Descripción | Body |
| ------ | -------- | --------- | -------------- | ----------- | ---- |
| GET | `/` | ❌ | ❌ | Obtiene todos los productos | - |
| GET | `/:id` | ❌ | ❌ | Obtiene un producto por su id | - |
| POST | `/` | ✅ | ✅ | Crea un nuevo producto | `{ description: string, image: string, name: string, price: number  }` |
| PUT | `/:id` | ✅ | ✅ | Actualiza un producto por su id | `{ description?: string, image?: string, name?: string, price?: number  }` |
| DELETE | `/:id` | ✅ | ✅ | Elimina un producto por su id (borrado lógico) | - |

## Equipo

- [Ezequiel Amin](https://github.com/ezeamin)
