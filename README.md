# Recruiter App - Challenge Front

Aplicación web para gestionar candidatos y enviar mensajes.

Usuario ya creado para prueba ( Aunque puede registrar cuantos quiera):
 Usuario: admin@admin.com
 Password: Testeo123.

### IMPORTANTE
El endpoint  https://private-73f5b0-challengefront.apiary-mock.com/messages proporcionado en el pdf del 
challenge devuelve siempre el mismo response:
{
    "id": 42,
    "role": "Frontend",
    "msj": "Estoy interesado en participar del challenge de UI, ¿hay lineamientos?",
    "submitted_at": "2025-10-09T17:00:00.000Z",
    "status": "received"
}

Independientemente de que body se le mande, cambiando role, poniendo uno no valido, un number, o cualquier cosa, siempre responde eso. Por lo que tome la decision de hacer la respuesta desde la propia api de next, para simular el flujo y poder tener el caso 422.


## 🎨 Stack Tecnológico

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19
- **BBDD**: SUPABASE, para logica de login y register
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Componentes UI**: Radix UI + shadcn/ui
- **Formularios**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Testing**: Vitest + React Testing Library


## 🏗️ Arquitectura

### Estructura del proyecto

```
challengefront/
├── app/                        # App Router de Next.js
│   ├── components/            # Componentes compartidos
│   ├── helpers/               # Utilidades
│   ├── hooks/                 # Hooks globales
│   ├── home/                  # Página de usuarios
│   │   ├── components/       # Componentes específicos
│   │   ├── context/          # Context providers
│   │   ├── hooks/            # Hooks específicos
│   │   ├── loading.tsx       # Loading state
│   │   ├── error.tsx         # Error boundary
│   │   └── page.tsx          # Página principal
│   └── messages/              # Página de mensajes
│       └── ...               # Misma estructura que home
├── components/                # Componentes UI (shadcn)
├── utils/                     # Utilidades globales
│   └── api/                  # Clientes de API
├── test/                      # Configuración de tests
└── public/                    # Assets estáticos
```

### Patrones utilizados

- **Context API**: Gestión de estado sin prop drilling
- **Custom Hooks**: Separación de lógica y UI
- **Error Boundaries**: Manejo robusto de errores
- **Special Files**: loading.tsx y error.tsx de Next.js


## 📋 Requisitos previos

- Node.js 18+ 
- npm o yarn

## 🛠️ Instalación

```bash
# Clonar el repositorio
git clone 
# Instalar dependencias
cd challengefront
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus valores
```
##  Ejecutar en desarrollo
npm run dev
```

La aplicación estará disponible en [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

### Probar flujos 201 y 422.
    - Para probar los flujos, en el modal para enviar mensaje, escribir cualquier 
    otro tipo de role que no sean los que trae el select. Eso dara un error en role,
    y el usuario sera notificado mediante un toast porque fue el error.


### Ejecutar todos los tests
```bash
npm  run test
```

### Ejecutar tests en modo watch
```bash
npm run test:watch
```
### Estructura de tests

```
app/
├── hooks/
│   └── __tests__/
│       └── useAuthGuard.test.ts
├── helpers/
│   └── __tests__/
│       ├── jwt.test.ts
│       └── errorHandler.test.ts
├── home/
│   ├── hooks/
│   │   └── __tests__/
│   │       └── useUsers.test.ts
│   └── components/
│       └── filters/
│           └── __tests__/
│               └── UserFilters.test.tsx
├── messages/
│   ├── hooks/
│   │   └── __tests__/
│   │       └── useMessages.test.ts
│   └── components/
│       └── table/
│           └── __tests__/
│               └── MessagesTable.test.tsx
└── components/
    └── __tests__/
        └── Navbar.test.tsx
```



## 📦 Scripts disponibles

```bash
npm run dev          # Desarrollo
npm run build        # Build de producción
npm run start        # Iniciar servidor de producción
npm run lint         # Ejecutar linter
npm run format       # Formatear código
npm test             # Ejecutar tests
npm run test:ui      # Tests con interfaz visual
npm run test:coverage # Generar reporte de coverage
```

## 🔑 Variables de entorno

Crear archivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://private-73f5b0-challengefront.apiary-mock.com
```

## 🧪 Coverage esperado

El proyecto tiene tests para:

- ✅ Hooks personalizados (useAuthGuard, useUsers, useMessages)
- ✅ Utilidades (JWT, Error Handler)
- ✅ Componentes principales (Navbar, UserFilters, MessagesTable)

## 👥 Autor

Alexis Crespo

