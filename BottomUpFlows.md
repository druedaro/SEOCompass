# Flujos Bottom-up en SEOCompass

Este documento describe los principales flujos Bottom-up del proyecto, mostrando cómo los datos y la lógica viajan desde los servicios hasta los hooks, páginas y componentes, siguiendo los patrones Service → Hook → Page → Component y Hook → Page → Component.

---

## 1. Service → Hook → Page → Component

### Ejemplo: Auditoría de URLs
- **Service:** `contentScrapingService.ts`, `projectUrlsService.ts`
- **Hook:** `useContentAnalyzer.ts`, `useProjectUrls.ts`, `useUrlDetails.ts`
- **Page:** `ContentAnalyzerPage.tsx`, `ProjectUrlsManagementPage.tsx`, `UrlDetailsPage.tsx`
- **Component:** `AuditResultsTable.tsx`, `ProjectUrlsList.tsx`, `AuditHistoryChart.tsx`

**Flujo:**
1. Los servicios gestionan la obtención y manipulación de datos (scraping, auditoría, historial).
2. Los hooks encapsulan la lógica de negocio y estado, llamando a los servicios y exponiendo funciones y datos.
3. Las páginas usan los hooks para obtener datos y acciones, y los pasan a componentes.
4. Los componentes presentan los datos y disparan acciones a través de props.

---

## 2. Service → Hook → Page → Component

### Ejemplo: Gestión de Proyectos y Usuarios
- **Service:** `projectService.ts`, `authService.ts`, `teamService.ts`, `taskService.ts`
- **Hook:** `useProject.ts`, `useAuth.ts`, `useProjectStats.ts`, `useProjectUrls.ts`
- **Page:** `ProjectsDashboardPage.tsx`, `LoginPage.tsx`, `RegisterPage.tsx`, `TeamMembersPage.tsx`, `ActionCenterPage.tsx`
- **Component:** `ProjectCard.tsx`, `TeamSelector.tsx`, `TaskList.tsx`, `CreateTaskModal.tsx`

**Flujo:**
1. Los servicios gestionan la autenticación, proyectos, equipos y tareas.
2. Los hooks encapsulan la lógica de negocio y estado, llamando a los servicios y exponiendo funciones y datos.
3. Las páginas usan los hooks para obtener datos y acciones, y los pasan a componentes.
4. Los componentes presentan los datos y disparan acciones a través de props.

---

## 3. Hook → Page → Component

### Ejemplo: Estadísticas y Auditorías
- **Hook:** `useProjectStats.ts`, `useLatestAudit.ts`, `useAuth.ts`, `useGoogleMaps.ts`
- **Page:** `ProjectOverviewPage.tsx`, `ProjectsDashboardPage.tsx`, `CreateTeamPage.tsx`, `TeamMembersPage.tsx`
- **Component:** `DashboardLayout.tsx`, `FeaturesSection.tsx`, `AuditHistoryChart.tsx`, `TeamSelector.tsx`

**Flujo:**
1. Los hooks gestionan el estado y la lógica de negocio, obteniendo datos de servicios o APIs.
2. Las páginas usan los hooks para obtener datos y acciones, y los pasan a componentes.
3. Los componentes presentan los datos y disparan acciones a través de props.

---

## 4. Ejemplo de flujo completo

- **`contentScrapingService.ts`** → **`useContentAnalyzer.ts`** → **`ContentAnalyzerPage.tsx`** → **`AuditResultsTable.tsx`**
- **`projectService.ts`** → **`useProject.ts`** → **`ProjectsDashboardPage.tsx`** → **`ProjectCard.tsx`**
- **`authService.ts`** → **`useAuth.ts`** → **`LoginPage.tsx`** → **`AuthCallbackPage.tsx`**
- **`teamService.ts`** → **`useProjectStats.ts`** → **`ProjectOverviewPage.tsx`** → **`DashboardLayout.tsx`**

---

## 5. Edge Function → Service → Hook → Page → Component

### Auditoría y Scraping de URLs
- **Edge Function:** `/supabase/functions/scrape-serp/index.ts`
  - Recibe petición HTTP, valida datos, instancia `ScrapingBeeService`, llama a `scrape()`, responde con JSON.
- **Service:** `/supabase/functions/scrape-serp/ScrapingBeeService.ts`
  - Clase `ScrapingBeeService` con métodos `buildUrl()` y `scrape()`.
- **Frontend Service:** `/src/services/contentScraping/contentScrapingService.ts`
  - Llama a la edge function desde el frontend.
- **Hook:** `/src/hooks/useContentAnalyzer.ts`
  - Usa el servicio para obtener datos de auditoría. Expone `analyzePageByUrlId`.
- **Page:** `/src/pages/ContentAnalyzerPage.tsx`
  - Usa el hook para disparar auditorías y mostrar resultados.
- **Component:** `/src/components/organisms/AuditResultsTable.tsx`
  - Recibe los resultados por props y los muestra en tabla.

**Código relevante:**
```typescript
// index.ts (Edge Function)
const scrapingService = new ScrapingBeeService({ ... });
const data = await scrapingService.scrape({ ... });

// useContentAnalyzer.ts (Hook)
const scrapedContent = await scrapeByProjectUrlId(projectUrlId);
```

---

## 6. Context → Hook → Page → Component

### Estado global de usuario, proyecto y equipo
- **Context:**
  - `/src/auth/AuthContext.tsx`
  - `/src/contexts/ProjectContext.tsx`
  - `/src/contexts/WorkspaceContext.tsx`
- **Hook:**
  - `/src/hooks/useAuth.ts`
  - `/src/hooks/useProject.ts`
- **Page:**
  - `/src/pages/TeamMembersPage.tsx`
  - `/src/pages/CreateTeamPage.tsx`
  - `/src/pages/ProjectsDashboardPage.tsx`
- **Component:**
  - `/src/components/organisms/TeamSelector.tsx`
  - `/src/components/organisms/CreateTeamDialog.tsx`

**Código relevante:**
```typescript
// useProject.ts
const context = useContext(ProjectContext);

// TeamMembersPage.tsx
const { currentTeam, teamMembers } = useWorkspace();
<TeamSelector teams={teams} />
```

---

## 7. Diagrama textual de flujo

```
[Edge Function]
   ↓
[Service (Backend)]
   ↓
[Service (Frontend)]
   ↓
[Hook]
   ↓
[Page]
   ↓
[Component]
```

---

## 8. Preguntas tipo examen oral

- ¿Cómo viaja la información desde la edge function hasta el componente presentacional?
- ¿Por qué se usan hooks para encapsular la lógica de negocio?
- ¿Qué ventajas aporta la separación Service → Hook → Page → Component?
- ¿Cómo se gestiona el estado global en el proyecto?
- ¿Qué patrón de diseño se sigue en la arquitectura de componentes?
- ¿Por qué no se usan servicios directamente en los componentes?
- ¿Cómo se conecta el contexto de usuario con los componentes de equipo?
- ¿Qué responsabilidad tiene la edge function en el flujo de scraping?

---

## 9. Recomendaciones de mejora y refactorización

**El proyecto está bien estructurado y sigue buenas prácticas de separación de responsabilidades.**

- **Hooks:** Si tienes lógica compleja en hooks (por ejemplo, en `useContentAnalyzer.ts`), considera mover funciones auxiliares a servicios o utilidades para mantener los hooks limpios.
- **Servicios:** Asegúrate de que los servicios solo gestionen acceso a datos y no lógica de presentación.
- **Componentes:** Mantén los componentes lo más presentacionales posible, recibiendo datos y callbacks por props.
- **Contextos:** Si el estado global crece, puedes dividir los contextos en sub-contextos más específicos.
- **Edge Function:** La separación entre el handler HTTP y la clase de servicio (`ScrapingBeeService`) es correcta y facilita el testing y la mantenibilidad.

**No hay archivos que requieran refactorización urgente, pero podrías mejorar la reutilización moviendo lógica repetida de hooks a servicios/utilidades.**

---

## 10. Respuestas a preguntas tipo examen oral

**¿Cómo viaja la información desde la edge function hasta el componente presentacional?**
- La edge function recibe la petición, valida y llama a `ScrapingBeeService`. El resultado se envía al frontend, donde un servicio lo consume. El hook (`useContentAnalyzer`) orquesta la lógica y expone los datos a la página (`ContentAnalyzerPage`), que los pasa por props al componente presentacional (`AuditResultsTable`).

**¿Por qué se usan hooks para encapsular la lógica de negocio?**
- Los hooks permiten reutilizar lógica, gestionar estado y efectos, y separar la lógica de negocio del renderizado. Facilitan el testing y la composición en React.

**¿Qué ventajas aporta la separación Service → Hook → Page → Component?**
- Claridad, mantenibilidad, testabilidad y reutilización. Cada capa tiene una responsabilidad única: servicios gestionan datos, hooks lógica, páginas orquestan vistas, componentes presentan datos.

**¿Cómo se gestiona el estado global en el proyecto?**
- Mediante React Context (`AuthContext`, `ProjectContext`, `WorkspaceContext`). Los hooks acceden al contexto y exponen datos y funciones a páginas y componentes.

**¿Qué patrón de diseño se sigue en la arquitectura de componentes?**
- Atomic Design: `atoms`, `molecules`, `organisms`. Los componentes son presentacionales y reciben datos por props.

**¿Por qué no se usan servicios directamente en los componentes?**
- Para evitar acoplamiento y duplicación de lógica. Los servicios se consumen en hooks, que gestionan el estado y exponen solo lo necesario.

**¿Cómo se conecta el contexto de usuario con los componentes de equipo?**
- El contexto (`WorkspaceContext`) expone el equipo actual y sus miembros. Los hooks (`useWorkspace`) acceden a estos datos y los pasan a componentes como `TeamSelector`.

**¿Qué responsabilidad tiene la edge function en el flujo de scraping?**
- Validar la petición, orquestar la llamada a ScrapingBee, transformar la respuesta y devolver datos limpios y seguros al frontend.

---

## 11. Observaciones sobre /hooks y /pages

- **/hooks:**
  - Los hooks están bien estructurados y cumplen con la separación de responsabilidades. Ejemplo: `useContentAnalyzer.ts` podría mejorar moviendo funciones auxiliares (`extractH1Texts`, `countLinks`, etc.) a un archivo de utilidades o servicio para mayor limpieza y reutilización.
  - Hooks como `useProjectStats.ts` y `useLatestAudit.ts` son concisos y claros, gestionan solo el estado y la llamada a datos.
  - `useAuth.ts` y `useProject.ts` usan correctamente los contextos.

- **/pages:**
  - Las páginas orquestan la vista y el flujo de datos, usando hooks para obtener información y pasando props a componentes.
  - Ejemplo: `ContentAnalyzerPage.tsx` y `ProjectOverviewPage.tsx` usan hooks para obtener datos y renderizan componentes presentacionales.
  - No se observa lógica de negocio compleja en las páginas, lo cual es correcto.

**Recomendación:**
- Si la lógica de validación, parsing o manipulación de datos crece en los hooks, muévela a servicios o utilidades para mantener los hooks limpios y reutilizables.
- Mantén los componentes y páginas lo más presentacionales posible.

---

**Actualizado:** 18 de noviembre de 2025
