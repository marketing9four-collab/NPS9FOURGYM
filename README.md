# Encuesta NPS — 9FOURGYM México

Encuesta pública de satisfacción por unidad (ARBOLEDAS, METEPEC, INTERLOMAS, LOMAS)
con panel administrativo protegido en `/admin/nps-9fourgym`.

**Stack:** Next.js 15 (App Router, TypeScript) + Supabase (Postgres/RLS) + Tailwind CSS,
pensado para desplegarse en Vercel.

## 1. Configuración inicial

### 1.1. Instalar dependencias

```powershell
npm install
```

### 1.2. Base de datos (Supabase)

Ver `supabase/README.md` para el paso a paso completo. En resumen:

1. Ejecuta `supabase/migrations/0001_create_survey_responses.sql`,
   `0002_rls_policies.sql` y `0003_add_comments.sql` (en ese orden) en el SQL
   Editor del proyecto Supabase.
2. Copia la URL del proyecto y las claves (anon/publishable y service_role/secret)
   desde Project Settings → API.

### 1.3. Variables de entorno

Copia `.env.example` a `.env.local` y completa los valores:

```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY
NPS_ADMIN_USER
NPS_ADMIN_PASSWORD_HASH
SESSION_SECRET
NEXT_PUBLIC_SITE_URL   (opcional)
```

**Importante:** Next.js expande variables `$algo` dentro de archivos `.env*`. El
hash bcrypt de `NPS_ADMIN_PASSWORD_HASH` contiene `$` — cada uno debe escaparse
como `\$` o el valor queda truncado y el login del admin falla silenciosamente
(devuelve "usuario o contraseña incorrectos" aunque la contraseña sea correcta).
Ejemplo correcto:

```
NPS_ADMIN_PASSWORD_HASH=\$2a\$12\$bYz0L/ZQb5D6Xak6bbLI5OY4oCNHil5Ho2btgJ8PytZs052Zj/KwO
```

Genera el hash y el secreto de sesión con:

```powershell
npm run hash-password -- "tu-contraseña"
npm run gen-secret
```

### 1.4. Correr en local

```powershell
npm run dev
```

Abre `http://localhost:3000` (encuesta pública) y
`http://localhost:3000/admin/nps-9fourgym` (panel admin, pide login primero).

## 2. Despliegue en Vercel

1. Sube el repositorio a GitHub (o el remoto que uses).
2. Importa el proyecto en Vercel.
3. Configura las mismas variables de entorno de `.env.local` en
   Vercel → Project Settings → Environment Variables (recuerda escapar los `$`
   del hash bcrypt igual que en local).
4. Despliega. El middleware y las Route Handlers corren en runtime Node.js —
   no se requiere configuración adicional.

## 3. Estructura del proyecto

```
app/                     Páginas y rutas de API (App Router)
  page.tsx                 Encuesta pública ("/")
  api/survey/               POST público (inserta con clave anon)
  admin/nps-9fourgym/       Login + dashboard (protegidos por middleware)
  api/admin/                 Rutas de datos del admin (usan service role key)
components/
  survey/                  Componentes de la encuesta pública
  admin/                   Componentes del panel admin (incl. charts/)
  ui/                      Primitivas compartidas (Button, Card, Dialog, ...)
lib/
  questions.ts             Configuración de preguntas (fuente única de verdad)
  constants.ts              Unidades, colores por nota
  nps.ts                    Cálculo de promedios y clasificación NPS futura
  admin/                    Agregación de métricas, sanitización de búsqueda
  supabase/                 Clientes anon (público) y service-role (admin)
  auth/                     Sesión (jose/JWT) y verificación de contraseña (bcrypt)
  validation/                Esquemas Zod (encuesta y admin)
supabase/
  migrations/               SQL de la tabla y políticas RLS
  README.md                 Instrucciones de configuración de Supabase
scripts/                   Generación de hash de contraseña y secreto de sesión
```

## 4. Variables de entorno — referencia completa

Ver `.env.example`.

## 5. Checklist de pruebas manuales

**Encuesta pública**
- [ ] Carga la página: banner a todo el ancho, sin deformarse.
- [ ] Pantalla de bienvenida se muestra ~2.5s y avanza sola (o al hacer clic en "Continuar").
- [ ] "Continuar" sin unidad seleccionada → error, foco va al selector de unidad.
- [ ] Deja una pregunta sin responder → error solo en esa pregunta, con scroll/foco.
- [ ] Responde con mezcla de notas 0–10 y N/A; N/A nunca se guarda como 0.
- [ ] Colores de las notas: 0-3 rojo, 4-6 amarillo, 7-8 verde claro, 9-10 verde, N/A gris.
- [ ] "Quiero comentar esto" abre un campo de texto opcional por pregunta.
- [ ] Envío con nombre y correo completos.
- [ ] Envío solo con nombre (correo queda null).
- [ ] Envío solo con correo (nombre queda "Usuario Anónimo").
- [ ] Envío completamente anónimo (ambos campos vacíos o botón "Enviar de forma anónima").
- [ ] Correo con formato inválido → error, bloquea el envío.
- [ ] Doble clic en "Enviar encuesta" → una sola fila insertada.
- [ ] Pantalla de confirmación final con el copy esperado.
- [ ] Vista móvil (375px): banner, botones de unidad y notas no se cortan; área de toque ≥44px.
- [ ] Navegación por teclado completa, foco visible en todo momento.

**Base de datos / seguridad**
- [ ] Con la clave anon, un `select` a `survey_responses` es rechazado por RLS.
- [ ] `overall_average` en la fila insertada coincide con el promedio manual, ignorando N/A.

**Panel admin**
- [ ] Acceso directo a `/admin/nps-9fourgym` sin sesión → redirige a login.
- [ ] Login incorrecto → mensaje de error genérico, sin cookie.
- [ ] Login correcto → cookie `httpOnly` presente, dashboard visible.
- [ ] Logout limpia la cookie y vuelve a pedir login.
- [ ] Filtros por unidad y por rango de fecha (hoy/7d/30d/personalizado) afectan tarjetas, gráficos y tabla.
- [ ] Búsqueda por nombre/correo funciona.
- [ ] Orden por fecha (asc/desc) en la tabla.
- [ ] Paginación funciona con más de una página de resultados.
- [ ] "Ver detalles" muestra todas las respuestas (incluye comentarios si existen).
- [ ] Exportar CSV descarga un archivo correcto (acentos legibles en Excel).
- [ ] Botón "Actualizar" refresca los datos sin recargar la página.
- [ ] "Borrar todos los datos" exige escribir la frase de confirmación y borra todo.
- [ ] Etiquetas del dashboard dicen "Promedio general/por pregunta" e "Índice de satisfacción", nunca "NPS".

## 6. Notas de diseño

- Las preguntas viven únicamente en `lib/questions.ts`; agregar una nueva pregunta
  no requiere tocar componentes.
- Ninguna pregunta actual es de tipo `"nps"` — cuando se agregue la pregunta de
  recomendación, `lib/nps.ts` ya tiene `classifyNps`/`calculateNpsScore` listos
  para calcular el NPS tradicional (promotores − detractores) sin refactor.
