# Supabase — configuración del proyecto NPS 9FOURGYM

## 1. Ejecutar las migraciones

En el dashboard de Supabase (proyecto ya creado: `vewjjcgevcxicooxbllb`):

1. Ve a **SQL Editor**.
2. Pega y ejecuta el contenido de `supabase/migrations/0001_create_survey_responses.sql`.
3. Pega y ejecuta el contenido de `supabase/migrations/0002_rls_policies.sql`.

Esto crea la tabla `survey_responses`, sus índices, y las políticas de seguridad (RLS).

## 2. Verificar las políticas de seguridad

Con **Row Level Security** habilitado y solo la policy `anon_insert_only`:

- El rol `anon` (usado por la página pública) **solo puede insertar** filas.
- Nadie con la clave `anon` puede leer (`select`), actualizar o borrar filas.
- El panel administrativo usa la **service role key**, que ignora RLS — por eso nunca debe exponerse al navegador, solo se usa en código de servidor (Route Handlers de Next.js).

Puedes confirmarlo ejecutando en el SQL Editor (como superusuario) o probando con el cliente anon desde fuera de la app: un `select * from survey_responses` con la clave anon debe devolver 0 filas o un error de permisos.

## 3. Obtener las claves de API

En **Project Settings → API**:

- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon / publishable key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **service_role / secret key** → `SUPABASE_SERVICE_ROLE_KEY` (¡nunca la compartas en texto plano ni la subas a git!)

## 4. Generar credenciales de administrador

Después de `npm install`, desde la raíz del proyecto:

```powershell
npm run hash-password -- "tu-contraseña-aqui"
```

Copia el hash resultante (empieza con `$2a$` o `$2b$`) a `NPS_ADMIN_PASSWORD_HASH` en `.env.local`.

**Importante:** Next.js expande variables `$algo` dentro de archivos `.env*`, así
que cada `$` del hash bcrypt debe escaparse como `\$` o el valor quedará truncado.
Ejemplo: `$2a$12$bYz0L...` se guarda como `NPS_ADMIN_PASSWORD_HASH=\$2a\$12\$bYz0L...`.

Para generar un `SESSION_SECRET` nuevo:

```powershell
npm run gen-secret
```

## 5. Variables de entorno finales

Ver `.env.example` para la lista completa. `.env.local` (ya creado, ignorado por git) debe tener los 7 valores completos antes de correr `npm run dev`.
