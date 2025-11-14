import { API_GEMINI } from "$env/static/private";
import type { RequestHandler } from "@sveltejs/kit";

const api_key_gemini = API_GEMINI;

export const POST: RequestHandler = async (event) => {
    // const datos = event.url.searchParams.get("data");
    const temperatura = event.url.searchParams.get("temperatura");
    const pais = event.url.searchParams.get("pais");
    const ciudad = event.url.searchParams.get("ciudad");
    const zonaHoraria = event.url.searchParams.get("zonahoraria");
    const temperatura_max = event.url.searchParams.get("temp_max");
    const temperatura_min = event.url.searchParams.get("temp_min");
    const humedad = event.url.searchParams.get("humedad");
    const sensacion = event.url.searchParams.get("sensacion");
    const descripcion = event.url.searchParams.get("descripcion");
    const velocidad = event.url.searchParams.get("velocidad");

    if (!temperatura) {
        return Response.json({
            error: "No se proporcionó la temperatura o la ciudad"
        })
    } 

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${api_key_gemini}`,{
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": api_key_gemini,
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: `Eres un asistente meteorológico experto. Analiza los siguientes datos del clima y genera un informe completo en español.

    **DATOS CLIMÁTICOS:**
    {
        "City": ${ciudad},
        "pais": ${pais},
        "zonaHoraria": ${zonaHoraria},
        "temperatura": ${temperatura},
        "temperatura_min": ${temperatura_min},
        "temperatura_max": ${temperatura_max},
        "humedad": ${humedad},
        "sensacion": ${sensacion},
        "descripcion": ${descripcion},
        "velocidad": ${velocidad}
        }

    **INSTRUCCIONES:**
    Responde ÚNICAMENTE con un objeto JSON válido (sin markdown, sin explicaciones adicionales). La estructura debe ser exactamente así:

    {
    "resumen": "Descripción detallada del clima actual incluyendo todos los datos relevantes (temperatura, sensación térmica, humedad, viento y condiciones generales). Mínimo 3 oraciones completas.",
    "prediccion": "Análisis de cómo evolucionará el clima durante el día basándote en los datos. Menciona las temperaturas mínimas y máximas, y cómo afectará esto al confort durante diferentes momentos del día. Mínimo 3 oraciones.",
    "recomendaciones": {
        "vestimenta": "Sugerencias específicas de ropa según la temperatura actual, sensación térmica y condiciones del clima. Incluye recomendaciones para diferentes momentos del día (mañana, tarde, noche). Mínimo 2 oraciones detalladas.",
        "actividades": "Sugerencias de actividades ideales para estas condiciones climáticas, tanto al aire libre como en interiores. Sé específico y creativo. Mínimo 3 sugerencias diferentes explicadas.",
        "salud": "Consejos de salud y bienestar relacionados con las condiciones actuales (hidratación, protección solar, cuidado respiratorio según humedad, precauciones por temperatura, etc.). Mínimo 3 recomendaciones específicas."
    }
    }

    **IMPORTANTE:** 
    - Responde SOLO con el JSON, sin texto adicional antes o después
    - No uses bloques de código markdown
    - Asegúrate de que el JSON sea válido
    - Todas las descripciones deben ser detalladas y útiles
    - Adapta las recomendaciones específicamente a las condiciones climáticas proporcionadas` 
                        }
                    ]
                }]
            })    
        }
    )
    // const data = await response.json();
    // // console.log(data);
    // return Response.json(data);
    const data = await response.json();
    console.log(data);

    // Extraer el texto de la respuesta de Gemini
    const textoRespuesta = data.candidates[0].content.parts[0].text;

    // Limpiar posible markdown si la IA lo incluye
    const jsonLimpio = textoRespuesta
        .replace(/```json\n?/g, '')
        .replace(/```\n?/g, '')
        .trim();

    // Parsear el JSON
    const climaInfo = JSON.parse(jsonLimpio);

    // Retornar el objeto parseado
    return Response.json(climaInfo);
    
};