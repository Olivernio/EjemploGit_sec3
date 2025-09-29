/**
 * URL de tu archivo JSON alojado en GitHub Raw.
 * ¡REEMPLAZA ESTA URL con la tuya!
 */
const JSON_URL = 'https://raw.githubusercontent.com/Olivernio/EjemploGit_sec3/refs/heads/main/api-anime-test.json';

/**
 * Función principal que maneja la solicitud GET de Nightbot.
 */
function doGet(e) {
  // 1. Obtener la cadena de la canción enviada por Nightbot (Ejemplo: [Spotify]: "青春コンプレックス" - 結束バンド)
  const rawText = e.parameter.q;

  // Manejo básico de errores si Nightbot no envía el parámetro 'q'
  if (!rawText) {
    // Nightbot mostrará esto si la llamada falla, por lo que devolvemos un texto simple
    return ContentService.createTextOutput("Error: No se proporcionaron datos de la canción.").setMimeType(ContentService.MimeType.TEXT);
  }

  try {
    // 2. Obtener el JSON de GitHub
    const jsonResponse = UrlFetchApp.fetch(JSON_URL);
    const data = JSON.parse(jsonResponse.getContentText());

    // 3. Extraer solo el Título (lo que está entre las primeras comillas dobles)
    // El patrón ("([^"]+)") captura el texto dentro de las comillas dobles.
    const match = rawText.match(/"([^"]+)"/);

    if (match && match.length >= 2) {
      const titulo = match[1]; // match[1] es el título (Ej: "青春コンプレックス")
      
      // 4. Buscar la coincidencia en el JSON usando el título como clave
      if (data[titulo]) { 
        
        // Coincidencia exitosa
        const infoExtra = data[titulo].info_extra;
        const finalResponse = rawText + infoExtra;
        
        // Devolver la respuesta completa a Nightbot
        return ContentService.createTextOutput(finalResponse).setMimeType(ContentService.MimeType.TEXT);
      }
    }
    
    // 5. No hay coincidencia o el formato de la canción es inesperado: devolver la entrada original
    return ContentService.createTextOutput(rawText).setMimeType(ContentService.MimeType.TEXT);

  } catch (error) {
    // Si el servidor externo (GitHub) falla, devolvemos la entrada original con una nota de error (opcional)
    Logger.log("Error fetching JSON: " + error);
    return ContentService.createTextOutput(rawText + " (Error en API de búsqueda)").setMimeType(ContentService.MimeType.TEXT);
  }
}
