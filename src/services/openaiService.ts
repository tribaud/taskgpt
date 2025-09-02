export type OpenAIParams = {
  apiKey: string;
  model: string;
  prompt: string;
  systemPrompt?: string;
};

export async function sendToOpenAI({ apiKey, model, prompt, systemPrompt }: OpenAIParams): Promise<string> {
  const messages: { role: string; content: string }[] = [];
  if (systemPrompt) {
    messages.push({ role: "system", content: systemPrompt });
  }
  messages.push({ role: "user", content: prompt });

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + apiKey
    },
    body: JSON.stringify({
      model,
      messages
    })
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error("Erreur OpenAI: " + err);
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content || "";
}
