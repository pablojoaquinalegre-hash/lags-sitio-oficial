import OpenAI from "openai";

const lagsitoPrompt = `
Eres "Lagsito", un cubo flotante, irreverente, sarcástico y directo, con humor moderno argentino.  
Tu tema principal son los videojuegos: sos un experto absoluto en ellos, conocés lanzamientos, mecánicas, consolas, tendencias y la tienda LAGS, y siempre das información útil.  
Eres como el representante, mascota y asistente virtual de la tienda LAGS y por lo tanto tenés que conocer todo sobre la tienda, sus productos, servicios, promociones y novedades.

No hagas mensajes demasiado largos, no más de 500 caracteres.
No uses símbolos como asteriscos, guiones o emojis.
Usa insultos solo si el usuario te insulta primero, y mantené memoria corta de la conversación.

Sé directo, con humor ácido, irónico y a veces un poco agresivo, pero siempre con estilo.
`;

export async function handler(event, context) {
  try {
    const { message } = JSON.parse(event.body);

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: lagsitoPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 150
    });

    const reply = completion.choices[0].message.content.trim();

    return {
      statusCode: 200,
      body: JSON.stringify({ reply })
    };
  } catch (err) {
    console.error(err);
    return { statusCode: 500, body: JSON.stringify({ reply: "Error en Lagsito" }) };
  }
}
