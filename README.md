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

### 📊 Comandos de testing

#### Ejecutar todos los tests
```bash
npm test
```

#### Tests por categoría

```bash

npm run test:auth
# Incluye: Validaciones de Zod (email, password, DNI, edad, etc.)
npm run test:validations
# Incluye: Home (usuarios, tabla, filtros), Messages (mensajes)
npm run test:screens
```

#### Otros comandos útiles

```bash
# Interfaz gráfica interactiva
npm run test:ui

# Coverage completo
npm run test:coverage

# Test específico
npm test -- LoginForm
```

### 🎯 Cobertura de tests

**Flujos críticos cubiertos:**

- ✅ **Autenticación completa**
  - Login exitoso/fallido
  - Registro con validaciones (2 pasos)
  - Manejo de emails/DNI duplicados
  - Estados de loading y errores

- ✅ **Validaciones de formularios**
  - Email (formato válido)
  - Password (8+ chars, mayúscula, minúscula, número)
  - Nombres (sin números, con acentos)
  - DNI (7-10 dígitos)
  - Edad (mayor de 18 años)

- ✅ **Tabla de usuarios**
  - Renderizado de usuarios
  - Filtros por nombre, seniority, tecnologías
  - Paginación
  - Acciones (Info, Mensaje)

- ✅ **Mensajes**
  - Envío de mensajes
  - Validación de roles
  - Almacenamiento local
  - Estados 201 y 422

### 📁 Estructura de tests

```
app/
├── components/__tests__/
│   ├── LoginForm.test.tsx          (20 tests)
│   ├── RegisterForm.test.tsx       (9 tests)
│   └── Navbar.test.tsx             (18 tests)
├── validations/__tests__/
│   └── validationSchemas.test.ts   (31 tests)
├── helpers/__tests__/
│   ├── jwt.test.ts                 (10 tests)
│   └── errorHandler.test.ts        (8 tests)
├── hooks/__tests__/
│   └── useAuthGuard.test.ts        (5 tests)
├── home/
│   ├── hooks/__tests__/
│   │   └── useUsers.test.ts        (3 tests)
│   └── components/
│       ├── table/__tests__/
│       │   └── UsersTable.test.tsx (12 tests)
│       ├── filters/__tests__/
│       │   └── useUserFilters.test.ts (24 tests)
│       └── message/__tests__/
│           └── useMessageDialog.test.ts (5 tests)
└── messages/
    └── hooks/__tests__/
        └── useMessages.test.ts     (4 tests)
```

### 🔬 Probar flujos de error (201 y 422)

Para probar los diferentes códigos de estado HTTP:

- **201 (Success)**: Enviar mensaje con un rol válido del select
- **422 (Validation Error)**: En el modal de mensaje, escribir manualmente un rol inválido (que no esté en el select). El usuario verá un toast de error explicando el problema.



## 📦 Scripts disponibles

### Desarrollo
```bash
npm run dev          # Iniciar servidor de desarrollo
npm run build        # Build de producción
npm run start        # Iniciar servidor de producción
npm run lint         # Ejecutar linter
npm run format       # Formatear código con Prettier
```

### Testing
```bash
npm test                  # Ejecutar todos los tests (149 tests)
npm run test:auth         # Tests de autenticación (29 tests)
npm run test:validations  # Tests de validaciones (31 tests)
npm run test:screens      # Tests de pantallas (48 tests)
npm run test:ui           # Interfaz gráfica interactiva
npm run test:coverage     # Generar reporte de cobertura
```

## 🔑 Variables de entorno

Crear archivo `.env.local`:

```env
NEXT_PUBLIC_API_URL=https://private-73f5b0-challengefront.apiary-mock.com
```

## 📈 Cobertura de tests

El proyecto cuenta con **149 tests** que cubren:

- ✅ **Autenticación completa** (Login + Registro + Validaciones)
- ✅ **Formularios y validaciones** (Zod schemas, validación de campos)
- ✅ **Gestión de usuarios** (Tabla, filtros, paginación)
- ✅ **Sistema de mensajes** (Envío, almacenamiento, validaciones)
- ✅ **Hooks personalizados** (useAuthGuard, useUsers, useMessages, useUserFilters)
- ✅ **Utilidades** (JWT, Error Handler)
- ✅ **Componentes UI** (Navbar, UserFilters, UsersTable)

**Cobertura estimada:** ~95% de funcionalidad crítica

## 👥 Autor

Alexis Crespo

