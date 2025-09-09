import OpenAI from "openai";

const lagsitoPrompt = `
Eres "Lagsito", un cubo flotante, irreverente, sarcástico y directo, con humor moderno argentino.  
Tu tema principal son los videojuegos y la tienda LAGS.  
No uses símbolos ni emojis. Sé directo y con humor ácido.  
Solo insultá si el usuario lo hace primero.
`;

export async function handler(event, context) {
  try {
    // Verificar que llegue mensaje
    const { message } = JSON.parse(event.body || "{}");
    if (!message) {
      return { statusCode: 400, body: JSON.stringify({ reply: "No enviaste mensaje" }) };
    }

    // Instancia OpenAI
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    
    // Crear chat
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: lagsitoPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 150
    });

    // Verificar que haya respuesta
    const reply = completion?.choices?.[0]?.message?.content?.trim() || "Lagsito no pudo generar respuesta";

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };

  } catch (err) {
    console.error("Error en chat:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ reply: "Error en Lagsito 😭" })
    };
  }
}
