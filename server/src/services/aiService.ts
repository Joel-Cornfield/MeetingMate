

import { GoogleGenAI, Type } from '@google/genai';
import { env } from '../config/env.js';

const ai = new GoogleGenAI({
    apiKey: env.GEMINI_API_KEY,
});

const GEMINI_MODEL = "gemini-3.6-flash";

interface AIResponse {
    summary: string,
    actionItems: string[];
}

/**
 * Generates a meeting summary and extracts action items
 * from a provided transcript using the Gemini API.
 *
 * @param transcript - Text content of the meeting transcript to analyze.
 * @returns A promise containing the meeting summary and action items.
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
    
    const response = await ai.models.generateContent({
        model: GEMINI_MODEL,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    summary: {
                        type: Type.STRING,
                        description: "A concise summary of the meeting."
                    },
                    actionItems: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.STRING,
                        },
                        description: "Action items explicitly mentioned or clearly implied by the meeting.",
                    },
                },
                required: ["summary", "actionItems"],
            },
        },
    });

    if (!response.text) {
        throw new Error("Gemini returned an empty response");
    }

    const result = JSON.parse(response.text) as AIResponse;

    return result;
}