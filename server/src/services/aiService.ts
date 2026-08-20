const OLLAMA_URL = "http://localhost:11434/api/generate";
const OLLAMA_MODEL = "llama3.2:3b";

interface AIResponse {
    summary: string,
    actionItems: string[];
}

/**
 * Generates a meeting summary and extracts action items from a provided transcript using the local Ollama API.
 * @param transcript - Text content of the meeting transcript to analyze.
 * @returns A promise that resolves to an AIResponse object containing the meeting summary and action items.
 * @throws Will throw an error if the network request fails or response is not ok.
 */
export async function generateMeetingSummary(
    transcript: string,
) : Promise<AIResponse> {
    const prompt = `You are an AI meeting assistant. Analyze the following meeting transcript and return:
    1. A concise summary of the meeting.
    2. A list of clear action items.
    Rules:
    1. Only include action items that are actually mentioned or clearly implied by the transcript.
    2. Do not invent deadlines, names, or tasks.
    3. If there are no action items, return an empty array.
    4. Keep the summary concise.
    5. Return only valid JSON.
    Required JSON format:
    {
        "summary": "string",
        "actionItems": [
            "string"
        ]
    }
    Meeting transcript:
    ${transcript}
    `;
    
    const response = await fetch(OLLAMA_URL, {
        method: "POST",
        headers: {
            'Content-type': 'application-json',
        },
        body: JSON.stringify({
            model: OLLAMA_MODEL,
            prompt: prompt,
            stream: false, // To get single JSON response
            format: "json",
        }),
    });

    if (!response.ok) {
        throw new Error(`Ollama request failed: ${response.status}`);
    }

    const data = await response.json();

    const result = JSON.parse(data.response) as AIResponse;

    return result;
}