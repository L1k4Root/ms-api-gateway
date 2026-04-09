# API Gateway

## Qué hace

`api-gateway` es la puerta de entrada HTTP del sistema. Su trabajo es recibir requests REST, validarlas, traducirlas a mensajes NATS y devolver la respuesta al cliente.

No guarda datos. No contiene la lógica principal del dominio. Actúa como adaptador entre HTTP y microservicios.

## Qué expone

- Swagger en `/api/docs`
- Endpoints bajo `/api`

Rutas principales:

- `/api/auth/*`
- `/api/products/*`
- `/api/order/*`

## Dependencias

- NATS
- `auth-ms`
- `products-ms`
- `order-ms`

## Variables de entorno

```env
PORT=3000
NATS_SERVERS=nats://localhost:4222
```

## Qué mirar primero

1. `src/main.ts`
2. `src/nats/nats.module.ts`
3. `src/auth/auth.controller.ts`
4. `src/products/products.controller.ts`
5. `src/order/order.controller.ts`

## Patrones que usa

- validación global con `ValidationPipe`
- filtro global para traducir errores RPC a HTTP
- `ClientProxy` para hablar con NATS

## Observaciones

- aquí no debería vivir lógica de negocio compleja;
- cuando una feature crezca, el detalle debe quedar en el microservicio dueño del dominio.
