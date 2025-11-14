<script lang="ts">
  import { onMount } from "svelte";

  let temperatura = 0;
  let ciudad = "Puno";
  let pais = "";
  let zonaHoraria = 0;
  let temperatura_min = 0;
  let temperatura_max = 0;
  let humedad = 0;
  let sensacion = 0;
  let descripcion = "";
  let icono = "";
  let velocidad = 0;
  let nameCity = "";

  let Resumen = "";
  let Vestimenta = "";
  let Actividades = "";
  let Salud = "";
  let Prediccion = "";

  onMount(async () => {
    const res = await searchCountryForm(ciudad);
    const ai= await sumaryInformation(temperatura, nameCity, pais, zonaHoraria, temperatura_min, temperatura_max, humedad, sensacion, descripcion, velocidad);
    // console.log(ai);
  });

  async function sumaryInformation( temperatura: number, nameCity: string, pais: string, zonaHoraria: number, temperatura_min: number, temperatura_max: number, humedad: number, sensacion: number, descripcion: string, velocidad: number) {
    const req = await fetch(`/api/weather?temperatura=${temperatura}&ciudad=${nameCity}&pais=${pais}&zonahoraria=${zonaHoraria}&temp_min=${temperatura_min}&temp_max=${temperatura_max}&humedad=${humedad}&sensacion=${sensacion}&descripcion=${descripcion}&velocidad=${velocidad}`,
        {
            method: "POST"
        }
    );
    const data = await req.json();

    const { resumen,  prediccion } = data;
    const { vestimenta, actividades, salud } = data.recomendaciones;

    Resumen = resumen;
    Vestimenta = vestimenta;
    Actividades = actividades;
    Salud = salud;
    Prediccion = prediccion;
    return data;

  }

  async function searchCountryForm(city: string) {
    if (!city) {
      throw new Error("No se proporcionó el nombre de la ciudad");
    }

    const res = await fetch(`/api/country?city=${city}`);
    const data = await res.json();
    // console.log(data);

    const {
      latitude,
      longitude,
      name,
      country,
      timezone,
      temp,
      temp_min,
      temp_max,
      humidity,
      feels_like,
      description,
      icon,
      speed,
    } = data;

    temperatura = Number((temp - 273.15).toPrecision(4)) || 0; //convertir de kelvin a celsius

    zonaHoraria = (timezone / 3600) || 0; //convertir de segundos a horas
    temperatura_min = Number((temp_min - 273.15).toPrecision(4)) || 0; //temp_min - 273.15;
    temperatura_max = Number((temp_max - 273.15).toPrecision(4)) || 0;
    humedad = humidity;
    sensacion = Number((feels_like - 273.15).toPrecision(4)) || 0;
    descripcion = description;
    icono = icon;
    velocidad = speed;
    pais = country;

    ciudad = name;
    nameCity = name;
    return {
      latitude,
      longitude,
      nameCity,
      pais,
      zonaHoraria,
      temperatura,
      temperatura_min,
      temperatura_max,
      humedad,
      sensacion,
      descripcion,
      velocidad
    };
    // console.log(ciudad);
  }
</script>

<main class="flex-1 px-4 sm:px-6 lg:px-10 py-8">
  <div class="max-w-screen-2xl mx-auto flex flex-col gap-8">
    <div class="w-full max-w-2xl mx-auto">
      <label class="flex flex-col w-full">
        <div
          class="flex w-full flex-1 items-stretch rounded-xl h-14 shadow-sm border border-slate-200 dark:border-[#233648]"
        >
          <div
            class="text-slate-500 dark:text-[#92adc9] flex bg-white dark:bg-[#111a22] items-center justify-center pl-4 rounded-l-xl"
          >
            <span class="material-symbols-outlined"> search </span>
          </div>
          <input
            class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-slate-800 dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border-0 bg-white dark:bg-[#111a22] h-full placeholder:text-slate-500 dark:placeholder:text-[#92adc9] px-4 rounded-l-none text-base font-normal leading-normal"
            placeholder="Buscar por ciudad o lugar..."
            bind:value={ciudad}
            on:keydown={async (e) => {
              if (e.key === "Enter") {
                await  searchCountryForm(ciudad);
                await sumaryInformation(temperatura, nameCity, pais, zonaHoraria, temperatura_min, temperatura_max, humedad, sensacion, descripcion, velocidad);
              }
            }}
          />
        </div>
      </label>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <section class="flex flex-col gap-8">
        <div class="flex flex-col gap-3">
          <h1
            class="text-slate-800 dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]"
          >
            {nameCity ?? "Madrid"}, {pais ?? "España"}
          </h1>
          <p
            class="text-slate-500 dark:text-[#92adc9] text-base font-normal leading-normal"
          >
            Zona Horaria: GMT {zonaHoraria ?? "+2"}
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div
            class="flex flex-col gap-4 rounded-xl p-6 bg-white dark:bg-[#111a22] border border-slate-200 dark:border-[#233648]"
          >
            <div class="flex items-center gap-3 text-slate-600 dark:text-white">
              <span class="material-symbols-outlined">device_thermostat</span>
              <h3 class="text-base font-medium leading-normal">Temperatura</h3>
            </div>
            <p
              class="text-slate-800 dark:text-white text-5xl font-bold leading-tight"
            >
              {temperatura ?? 25}°C
            </p>
            <div
              class="flex items-center gap-4 text-slate-500 dark:text-[#92adc9]"
            >
              <div class="flex items-center gap-1">
                <span class="material-symbols-outlined text-sm"
                  >arrow_upward</span
                >
                <p>Máx: {temperatura_max ?? 28}°</p>
              </div>
              <div class="flex items-center gap-1">
                <span class="material-symbols-outlined text-sm"
                  >arrow_downward</span
                >
                <p>Mín: {temperatura_min ?? 15}°</p>
              </div>
            </div>
          </div>
          <div
            class="flex flex-col gap-4 rounded-xl p-6 bg-white dark:bg-[#111a22] border border-slate-200 dark:border-[#233648]"
          >
            <div class="flex items-center gap-3 text-slate-600 dark:text-white">
              <span class="material-symbols-outlined">thermostat</span>
              <h3 class="text-base font-medium leading-normal">
                Sensación Térmica
              </h3>
            </div>
            <p
              class="text-slate-800 dark:text-white text-5xl font-bold leading-tight"
            >
              {sensacion ?? 26}°C
            </p>
            <p class="text-slate-500 dark:text-[#92adc9]">Se siente como...</p>
          </div>
        </div>
        <div
          class="flex flex-col gap-4 rounded-xl p-6 bg-white dark:bg-[#111a22] border border-slate-200 dark:border-[#233648]"
        >
          <div class="flex items-center gap-3 text-slate-600 dark:text-white">
            <span class="material-symbols-outlined">cloud</span>
            <h3 class="text-base font-medium leading-normal">
              Descripción del Clima
            </h3>
          </div>
          <p
            class="text-slate-800 dark:text-white text-2xl font-bold leading-tight"
          >
            {descripcion ?? "Parcialmente Nublado"}
          </p>
        </div>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div
            class="flex flex-col gap-4 rounded-xl p-6 bg-white dark:bg-[#111a22] border border-slate-200 dark:border-[#233648]"
          >
            <div class="flex items-center gap-3 text-slate-600 dark:text-white">
              <span class="material-symbols-outlined">humidity_percentage</span>
              <h3 class="text-base font-medium leading-normal">Humedad</h3>
            </div>
            <p
              class="text-slate-800 dark:text-white text-4xl font-bold leading-tight"
            >
              {humedad ?? "60"}%
            </p>
          </div>
          <div
            class="flex flex-col gap-4 rounded-xl p-6 bg-white dark:bg-[#111a22] border border-slate-200 dark:border-[#233648]"
          >
            <div class="flex items-center gap-3 text-slate-600 dark:text-white">
              <span class="material-symbols-outlined">air</span>
              <h3 class="text-base font-medium leading-normal">
                Velocidad del Viento
              </h3>
            </div>
            <p
              class="text-slate-800 dark:text-white text-4xl font-bold leading-tight"
            >
              {velocidad ?? "15"} km/h
            </p>
          </div>
        </div>
      </section>
      <aside class="flex flex-col gap-8 sticky top-28 h-fit">
        <div
          class="flex flex-col gap-4 p-6 bg-primary/10 dark:bg-[#6F42C1]/10 rounded-xl border border-primary/20 dark:border-[#6F42C1]/20"
        >
          <div class="flex items-center gap-3">
            <span
              class="material-symbols-outlined text-primary dark:text-[#a37eff]"
            >
              auto_awesome
            </span>
            <h3 class="text-slate-800 dark:text-white text-xl font-bold">
              Interpretación de IA
            </h3>
          </div>
          <div>
            <h4 class="font-semibold text-slate-700 dark:text-slate-200 mb-1">
              Resumen del Clima
            </h4>
            <p
              class="text-slate-600 dark:text-slate-400 text-sm font-normal leading-relaxed"
            >
              {Resumen ?? "Hoy en Madrid, el clima está parcialmente nublado con una temperatura actual de 25°C. La temperatura máxima alcanzará los 28°C y la mínima será de 15°C. La humedad es del 60%, con vientos a 15 km/h, lo que resulta en una sensación térmica de 26°C."}
            </p>
          </div>
          <div>
            <h4 class="font-semibold text-slate-700 dark:text-slate-200 mb-1">
              Análisis Predictivo
            </h4>
            <p
              class="text-slate-600 dark:text-slate-400 text-sm font-normal leading-relaxed"
            >
              {Prediccion ?? "Las condiciones se mantendrán agradables durante todo el día. El\nviento ligero y la temperatura confortable hacen que sea un día\nideal para estar al aire libre, aunque las nubes podrían aumentar\npor la tarde."}
            </p>
          </div>
        </div>
        <div class="flex flex-col gap-4">
          <h3 class="text-slate-800 dark:text-white text-xl font-bold px-2">
            Recomendaciones Personalizadas
          </h3>
          <div
            class="flex flex-col gap-3 rounded-xl p-4 bg-white dark:bg-[#111a22] border border-slate-200 dark:border-[#233648]"
          >
            <div class="flex items-center gap-4">
              <div
                class="flex items-center justify-center size-10 rounded-lg bg-slate-100 dark:bg-[#233648]"
              >
                <span class="material-symbols-outlined text-primary"
                  >apparel</span
                >
              </div>
              <div class="flex flex-col">
                <p
                  class="text-slate-700 dark:text-slate-200 text-base font-bold leading-tight"
                >
                  Vestimenta
                </p>
                <p
                  class="text-slate-500 dark:text-[#92adc9] text-sm font-normal leading-normal"
                >
                  {Vestimenta ?? "Ropa ligera será suficiente. Considera una chaqueta fina para la noche."}
                </p>
              </div>
            </div>
          </div>
          <div
            class="flex flex-col gap-3 rounded-xl p-4 bg-white dark:bg-[#111a22] border border-slate-200 dark:border-[#233648]"
          >
            <div class="flex items-center gap-4">
              <div
                class="flex items-center justify-center size-10 rounded-lg bg-slate-100 dark:bg-[#233648]"
              >
                <span class="material-symbols-outlined text-primary"
                  >directions_run</span
                >
              </div>
              <div class="flex flex-col">
                <p
                  class="text-slate-700 dark:text-slate-200 text-base font-bold leading-tight"
                >
                  Actividades al Aire Libre
                </p>
                <p
                  class="text-slate-500 dark:text-[#92adc9] text-sm font-normal leading-normal"
                >
                  { Actividades ?? "Perfecto para un paseo por el parque o comer en una terraza."}
                </p>
              </div>
            </div>
          </div>
          <div
            class="flex flex-col gap-3 rounded-xl p-4 bg-white dark:bg-[#111a22] border border-slate-200 dark:border-[#233648]"
          >
            <div class="flex items-center gap-4">
              <div
                class="flex items-center justify-center size-10 rounded-lg bg-slate-100 dark:bg-[#233648]"
              >
                <span class="material-symbols-outlined text-primary"
                  >health_and_safety</span
                >
              </div>
              <div class="flex flex-col">
                <p
                  class="text-slate-700 dark:text-slate-200 text-base font-bold leading-tight"
                >
                  Salud y Bienestar
                </p>
                <p
                  class="text-slate-500 dark:text-[#92adc9] text-sm font-normal leading-normal"
                >
                  { Salud ?? "Mantente hidratado, especialmente si pasas tiempo al sol por la tarde."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  </div>
</main>

<!-- {#await wheatherPromise then wheather}
    
    <h3> Temperatura: {wheather.current_weather.temperature}</h3>
{/await}
 -->

<style>
  p {
    font-family:
      system-ui,
      -apple-system,
      BlinkMacSystemFont,
      "Segoe UI",
      Roboto,
      Oxygen,
      Ubuntu,
      Cantarell,
      "Open Sans",
      "Helvetica Neue",
      sans-serif;
  }
  .material-symbols-outlined {
    font-variation-settings:
      "FILL" 0,
      "wght" 400,
      "GRAD" 0,
      "opsz" 24;
  }
</style>
