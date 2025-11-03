# 🔧 Configuración de Supabase para SEO Compass

## ❌ Problema Actual
No puedes registrarte ni hacer login porque **las tablas de la base de datos no existen** en tu proyecto remoto de Supabase.

## ✅ Solución: Ejecutar el Script de Setup

### Paso 1: Abrir Supabase Dashboard
1. Ve a [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto **SEO Compass** (usewvkylcfoivkthsetr)

### Paso 2: Abrir el SQL Editor
1. En el menú lateral, haz clic en **"SQL Editor"**
2. Haz clic en **"+ New query"**

### Paso 3: Ejecutar el Script
1. Abre el archivo `supabase/SETUP_DATABASE.sql`
2. **Copia TODO el contenido** del archivo
3. **Pega** en el editor SQL de Supabase
4. Haz clic en **"Run"** (o presiona Ctrl+Enter / Cmd+Enter)

### Paso 4: Verificar que Funcionó
Deberías ver un mensaje de éxito. Luego verifica que las tablas se crearon:

1. Ve a **"Table Editor"** en el menú lateral
2. Deberías ver estas tablas:
   - ✅ `profiles`
   - ✅ `teams`
   - ✅ `team_members`
   - ✅ `invitations`
   - ✅ `projects`

## 🧪 Probar el Registro

Ahora intenta registrarte nuevamente en tu app:

1. Ve a http://localhost:5175/auth/register
2. Completa el formulario:
   - Email: tu-email@ejemplo.com
   - Role: Elige cualquier rol
   - Password: mínimo 6 caracteres
   - Confirmar password
3. Haz clic en **"Create Account"**

### ¿Qué debería pasar?
1. Se crea el usuario en `auth.users`
2. El trigger `handle_new_user()` crea automáticamente un perfil en `profiles`
3. Eres redirigido a `/dashboard`

## 🔍 Si Aún No Funciona

### Verificar en la consola del navegador:
1. Abre las DevTools (F12)
2. Ve a la pestaña **Console**
3. Busca errores en rojo

### Errores Comunes:

#### 1. "Email not confirmed"
**Solución:** Ve a Supabase Dashboard > Authentication > Settings > Email Auth
- Desactiva "Confirm email" temporalmente para desarrollo

#### 2. "Invalid API key"
**Solución:** Verifica que tu `.env.local` tenga las credenciales correctas:
```bash
VITE_SUPABASE_URL=https://usewvkylcfoivkthsetr.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### 3. "relation 'profiles' does not exist"
**Solución:** El script no se ejecutó correctamente. Repite el Paso 3.

## 📧 Configuración de Email (Opcional)

Por defecto, Supabase requiere confirmación de email. Para desarrollo:

1. Ve a **Authentication > Email Templates**
2. Puedes personalizar los emails
3. O desactiva la confirmación en **Settings > Email Auth**

## 🎉 Listo!

Una vez completados estos pasos, tu sistema de autenticación debería funcionar perfectamente.

## 🆘 ¿Necesitas Ayuda?

Si sigues teniendo problemas, comparte:
1. El error exacto de la consola del navegador
2. Captura de pantalla del Table Editor de Supabase mostrando las tablas
