# Gastos Bot - Frontend PWA

Aplicación React PWA para gestión de gastos que consume la API de `new-gastos`.

## Stack Tecnológico

- **React 19** - Framework UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool
- **Tailwind CSS** - Estilos
- **React Router** - Routing
- **PWA** - Progressive Web App con service workers

## Configuración

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno:
Crear archivo `.env` con:
```
VITE_API_URL=http://localhost:3000
```

3. Ejecutar en desarrollo:
```bash
npm run dev
```

4. Build para producción:
```bash
npm run build
```

## Estructura del Proyecto

```
src/
├── components/     # Componentes React
│   ├── expenses/  # Componentes de gastos
│   └── layout/    # Componentes de layout
├── context/        # Context API (AuthContext)
├── hooks/          # Custom hooks
├── pages/          # Páginas principales
├── services/       # Servicios de API
├── types/          # Tipos TypeScript
└── utils/          # Utilidades
```

## Funcionalidades

- ✅ Autenticación con cookies HttpOnly
- ✅ Cambio de contraseña obligatorio para usuarios nuevos
- ✅ Dashboard con lista de gastos
- ✅ Ver detalles de gastos
- ✅ Editar gastos
- ✅ Eliminar gastos
- ✅ Visualización de imágenes de gastos
- ✅ Diseño responsive (mobile-first)
- ✅ PWA con service workers

## Rutas

- `/login` - Página de inicio de sesión
- `/change-password` - Cambio de contraseña (protegida)
- `/dashboard` - Dashboard principal (protegida)
- `/` - Redirige a dashboard o login

## Notas

- El backend debe estar corriendo en `http://localhost:3000` (o la URL configurada en `.env`)
- Las cookies de sesión se manejan automáticamente
- La aplicación redirige automáticamente a login si la sesión expira
