import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generatePracticeLesson = async (mistakeSummary: string): Promise<string> => {
  try {
    const prompt = `You are an expert typing instructor. A user has made some specific mistakes while typing. Your task is to generate a short, focused typing lesson (around 20-30 words) to help them practice and correct these mistakes.

User's mistakes:
${mistakeSummary}

Generate a practice sentence or a series of words that specifically targets these character combinations and movements. Do not add any introductory text like "Here is your lesson:". Just provide the raw text for the lesson.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 100,
        thinkingConfig: { thinkingBudget: 0 }
      }
    });
    
    return response.text.trim();
  } catch (error) {
    console.error("Error generating practice lesson:", error);
    return "Error: Could not generate a lesson. Please try again.";
  }
};

export const generateMasteryLesson = async (topic: 'news' | 'code' | 'quote'): Promise<string> => {
    try {
        let prompt = '';
        switch(topic) {
            case 'news':
                prompt = "Generate a short, interesting, and recent news headline for typing practice. The headline should be a single sentence. Just provide the raw text of the headline.";
                break;
            case 'code':
                prompt = "Generate a single, short line of common JavaScript code (like a function definition or a variable declaration) for typing practice. Include symbols like parentheses, brackets, and semicolons. Just provide the raw code.";
                break;
            case 'quote':
                prompt = "Generate a short, inspiring quote for typing practice. The quote should be a single sentence. Just provide the raw text of the quote.";
                break;
        }

        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            temperature: 0.8,
            maxOutputTokens: 150,
            thinkingConfig: { thinkingBudget: 0 }
          }
        });
        
        return response.text.trim().replace(/["`]/g, "'"); // Sanitize quotes
    } catch (error) {
        console.error(`Error generating mastery lesson for topic ${topic}:`, error);
        return "Error: Could not generate a lesson. Please try again.";
    }
}
