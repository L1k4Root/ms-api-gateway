# API Gateway Overview

`api-gateway` es la cara pública del sistema. Su trabajo no es "resolver" el negocio, sino convertir tráfico HTTP en llamadas internas consistentes hacia los servicios que sí son dueños del dominio.

## Cómo pensar este servicio

Si el resto del sistema está organizado por responsabilidades de negocio, el gateway está organizado por experiencia de consumo:

- recibe requests desde clientes;
- valida payloads y parámetros;
- mantiene una superficie HTTP estable;
- traduce errores internos a respuestas entendibles;
- delega la operación real al microservicio correcto.

En otras palabras: aquí vive el contrato externo, no la lógica central.

## Qué aporta al sistema

Este servicio concentra tres cosas importantes:

- una entrada única para clientes o herramientas como Swagger;
- una forma homogénea de exponer productos, órdenes y autenticación;
- una capa de adaptación para que los microservicios no queden acoplados a HTTP.

Eso permite que los servicios internos se mantengan enfocados en mensajería, persistencia y reglas de negocio.

## Qué no debería vivir aquí

Cuando una feature empieza a crecer, este README sirve como regla de diseño: si una decisión depende del catálogo, del ciclo de vida de una orden o del estado de un pago, probablemente no pertenece al gateway.

Este servicio sí puede:

- validar entrada;
- enriquecer headers o contexto técnico;
- traducir errores;
- orquestar de forma superficial la entrada HTTP.

Este servicio no debería:

- persistir estado;
- duplicar reglas de negocio;
- recalcular datos que ya pertenecen a otro dominio.

## Mapa rápido del código

- `src/main.ts`: configuración global de la app HTTP, prefijo `/api`, Swagger y filtros.
- `src/nats`: conexión compartida con NATS para hablar con servicios internos.
- `src/auth`: borde HTTP del módulo de autenticación.
- `src/products`: borde HTTP del catálogo.
- `src/order`: borde HTTP del flujo de órdenes.
- `src/common`: utilidades transversales, especialmente traducción de errores RPC.

## Cuándo tocar este servicio

Normalmente entras aquí cuando:

- vas a publicar una capacidad nueva hacia clientes externos;
- necesitas cambiar validaciones de entrada o forma de respuesta;
- quieres centralizar comportamiento HTTP común;
- necesitas conectar una ruta nueva con un pattern ya existente en NATS.

Si el cambio que estás pensando solo afecta reglas del dominio, conviene ir primero al microservicio dueño.
