

## 🚀 Tecnologías Usadas

### Frontend & Core
- React 19.1
- TypeScript 5.8
- Vite 7.1
- Tailwind CSS 3.4

### Backend & Servicios
- Supabase 2.75 (auth)
- TMDB API (movie/series data)

### Formularios & Routing
- React Hook Form 7.64
- Zod 4.1
- React Router 7.9

### Testing & Calidad
- Vitest 3.2
- Testing Library
- ESLint 9

---

## 1. Estructura de carpetas y propósito

```
src/
├── App.tsx, main.tsx, index.css, setupTests.ts
├── api/              # Cliente HTTP y utilidades de API
├── auth/             # Contexto y provider de autenticación
├── components/       # Componentes UI (Atomic Design: atoms, molecules, organisms, templates)
├── config/           # Configuración de APIs externas (Supabase, TMDB)
├── hooks/            # Custom hooks reutilizables
├── pages/            # Páginas principales (routing)
├── routes/           # Rutas protegidas y paths
├── schemas/          # Validaciones con Zod
├── services/         # Lógica de negocio y acceso a datos externos
├── types/            # Tipos TypeScript (domain: entidades, common: utilidades)
├── utils/            # Utilidades generales y tests
```

## 2. Convenciones de nomenclatura

- **Carpetas:** minúsculas y separadas por guiones (`use-media-list`, `movie-service`)
- **Archivos:** PascalCase para componentes (`MovieCard.tsx`), camelCase para utilidades (`formatters.ts`)
- **Componentes:** nombre descriptivo y único (`SeriesDetailsPage`, `AuthProvider`)
- **Hooks:** prefijo `use` (`useAuth`, `useGenres`)
- **Tests:** sufijo `.test.ts(x)` y carpeta `__mocks__` para mocks
- **Tipos:** PascalCase (`Movie`, `User`, `AuthContextType`)

## 3. Patrones de diseño utilizados

- **Atomic Design:**
  - `atoms/`: elementos básicos (Button, Input)
  - `molecules/`: combinaciones simples (Card, SearchBar)
  - `organisms/`: secciones completas (Navbar, Footer)
  - `templates/`: páginas genéricas reutilizables (DashboardPage)
- **Provider Pattern:**
  - Contexto de autenticación con `AuthProvider` y `AuthContext`
- **Custom Hooks:**
  - Lógica reutilizable (`useMediaList`, `useInfiniteScroll`, `useAuth`)
- **Service Layer:**
  - Acceso a datos externo centralizado (`movieService`, `seriesService`)
- **Testing Moscow Method:**
  - Tests robustos con mocks y separación de casos Success/Failure

## 4. Ejemplos de componentes bien hechos

### Componente Molecule: Card
```tsx
// src/components/molecules/MovieCard.tsx
import React from 'react';
import type { Movie } from '../../types/domain';

interface MovieCardProps {
  movie: Movie;
  onClick?: () => void;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie, onClick }) => (
  <div className="movie-card" onClick={onClick}>
    <img src={movie.poster_path} alt={movie.title} />
    <h3>{movie.title}</h3>
    <p>{movie.release_date}</p>
  </div>
);
```

### Custom Hook: useMediaList
```ts
// src/hooks/useMediaList.ts
export function useMediaList<T extends Movie | Series>(mediaType: 'movie' | 'tv') {
  // ...lógica de paginación, loading, error, etc.
}
```

### Provider Pattern: AuthProvider
```tsx
// src/auth/AuthProvider.tsx
import { AuthContext } from './AuthContext';
export const AuthProvider = ({ children }) => {
  // ...gestión de usuario y métodos de login/logout
  return <AuthContext.Provider value={...}>{children}</AuthContext.Provider>;
};
```

## 5. Reglas de estilo y organización del código

- **TypeScript estricto:** todos los archivos usan tipado fuerte
- **Imports ordenados:** primero librerías, luego internos, luego estilos
- **Componentes pequeños y reutilizables:** máximo una responsabilidad por componente
- **Hooks para lógica compartida:** no repetir lógica en componentes
- **Service Layer:** nunca llamar APIs directamente desde componentes
- **Validación con Zod:** todos los formularios usan schemas
- **Testing robusto:** mocks centralizados, tests con casos Success/Failure
- **Convención DRY:** no repetir código, usar templates y utilidades
- **Estilos con Tailwind:** clases utilitarias, sin CSS global
- **Sin comentarios innecesarios:** el código debe ser autoexplicativo

-------------------------

