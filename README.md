# Reto: Gestión de Envíos y Rutas Logísticas

## Descripción del Proyecto
Este proyecto es una API para gestionar el envío de paquetes, optimizar rutas de entrega y permitir a los clientes rastrear sus pedidos en tiempo real. La API maneja usuarios, pedidos, rutas y estados de envío, asegurando seguridad, eficiencia y escalabilidad.

## Tecnologías Utilizadas
- **Framework:** Express
- **Lenguaje:** TypeScript
- **Base de Datos:** PostgreSQL (Desplegada en Render)
- **Caching:** Redis (utilizando Docker) con 2 min de tiempo
- **Autenticación y Seguridad:** JWT
- **Arquitectura:** Clean Architecture
- **Documentación:** Swagger

## Instalación y Configuración
### Prerrequisitos
- Node.js y npm instalados
- Docker instalado y ejecutándose
- PgAdmin4 o algun otro gestor de bases de datos configurado

### Instalación
1. Clona este repositorio:
   ```sh
   git clone https://github.com/CamiloFG04/shipping-managgement.git
   cd shipping-managgement
   ```
2. Instala las dependencias:
   ```sh
   npm install
   ```
3. Crea un archivo `.env` con las siguientes variables:
   ```env
    PORT=3000
    POSTGRESQL_DATABASE_HOST=
    POSTGRESQL_DATABASE_PORT=
    POSTGRESQL_DATABASE_NAME=
    POSTGRESQL_DATABASE_USER_NAME=
    POSTGRESQL_DATABASE_PASSWORD=
    JWT_SECRET=
    GOOGLE_MAPS_KEY=
   ```
4. Levanta Redis con Docker:
   ```sh
   docker-compose up -d
   ```
5. Inicia el servidor:
   ```sh
   npm run dev
   ```

## Endpoints Principales

### 1. Registro y Autenticación de Usuarios
- `POST /api/auth/register` - Registra un nuevo usuario.
- `POST /api/auth/login` - Autentica un usuario y devuelve un token JWT.

### 2. Creación de Órdenes de Envío
- `POST /api/orders` - Crea una nueva orden de envío.

### 3. Asignación de Rutas
- `PUT /api/orders/:id/assign-transporter` - Asigna una orden a un transportista.

### 4. Seguimiento del Estado del Envío
- `GET /api/orders/code-tracking/code-tracking-detail?tracking_code="XLAJAHQHAHA"` - Consulta el estado de un envío.

### 5. Cerrar la orden
- `PUT /api/orders/:tracking_code/close-order` - Cierra la orden pansando su estado a delivered.

- ### 6. Listar ordenes
- `GET /api/orders` - Listar ordenes con metricas

## Documentación API
Para ver la documentación Swagger, inicia el servidor y visita:
```
http://localhost:3000/api/docs/
```

## Pruebas
Ejecuta las pruebas unitarias y de integración:
```sh
npm test
```

