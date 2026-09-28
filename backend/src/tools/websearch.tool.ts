import "dotenv/config";

const TAVILY_API_KEY = process.env.TAVILY_API_KEY;

export async function webSearch(query: string) {
  if (!TAVILY_API_KEY) {
    throw new Error("TAVILY_API_KEY is not configured");
  }

  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key: TAVILY_API_KEY,
      query,
      search_depth: "basic",
      topic: "general",
      max_results: 5,
      include_answer: true,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    console.error("========== TAVILY ERROR ==========");
    console.error("Status:", response.status);
    console.error("Message:", errorText);
    console.error("==================================");

    throw new Error(`Tavily search failed: ${response.status}`);
  }

  const data = await response.json();

  return {
    query,
    answer:
      data.answer ||
      data.results
        ?.map(
          (result: { title: string; content: string }) =>
            `**${result.title}**\n${result.content}`
        )
        .join("\n\n") ||
      "No results found.",
    results: data.results || [],
  };
}