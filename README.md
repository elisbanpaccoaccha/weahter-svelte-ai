# 🌤️ weahter-svelte-ai — Clima Inteligente con IA (SvelteKit + Gemini)

weahter-svelte-ai es una **aplicación web de clima inteligente** desarrollada con **SvelteKit**, que permite buscar cualquier ciudad y obtener información meteorológica detallada junto con **recomendaciones personalizadas generadas por IA**.

La aplicación combina datos reales del clima con un modelo de IA (Gemini 2.5 Flash) para sugerir ropa, advertencias y consejos basados en la temperatura y la localidad seleccionada.

---

## ✨ Características

✔ **Búsqueda de ciudades en tiempo real**  
✔ **Debounce en el input** para evitar llamadas innecesarias  
✔ **Recomendaciones generadas por IA (Gemini)** basadas en temperatura y ciudad  
✔ **UI moderna** construida con Tailwind + componentes reutilizables  
✔ Código organizado, escalable y responsive  

---

## 🧠 ¿Cómo funciona?

1. El usuario escribe una ciudad.  
2. Se obtiene información meteorológica (temperatura, humedad, timezone, etc.) usando la API de OpenWeatherMap.  
3. Se envían estos datos a un endpoint interno del proyecto.  
4. El backend consulta a Gemini con un **prompt estructurado**.  
5. La IA responde con:  
   - recomendación general  
   - descripción del clima  
   - sugerencias de ropa  
6. La UI muestra una tarjeta combinando clima + recomendaciones de IA.  

---

## 🏗 Tecnologías utilizadas

- **SvelteKit**
- **TypeScript**
- **TailwindCSS**
- **OpenWeatherMap API**
- **Google Gemini API**

---

## 📦 Instalación + Configuración

```bash
git clone https://github.com/elisbanpaccoaccha/weahter-svelte-ai.git
cd weahter-svelte-ai
pnpm install

```
Crear un archivo .env en la raíz del proyecto con:

```bash
API_KEY="TU_API_DE_OPENWEATHERMAP"
API_GEMINI="TU_API_KEY_DE_GEMINI"
