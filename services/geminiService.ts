
import { GoogleGenAI } from "@google/genai";

export interface GeocodeResult {
  address: string;
  groundingUrls: string[];
}

export const getReverseGeocode = async (lat: number, lng: number): Promise<GeocodeResult> => {
  // Create a new GoogleGenAI instance right before making an API call to ensure it uses the most up-to-date API key
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const response = await ai.models.generateContent({
      // Maps grounding is only supported in Gemini 2.5 series models.
      model: "gemini-2.5-flash",
      contents: `Provide the nearest street address or specific place name for these coordinates: ${lat}, ${lng}`,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng
            }
          }
        }
      },
    });

    // response.text is a getter property, not a method
    const address = response.text?.trim() || "Address not found";
    const groundingUrls: string[] = [];

    // MANDATORY: Extract website/place URLs from groundingChunks and list them
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.maps?.uri) {
          groundingUrls.push(chunk.maps.uri);
        }
      });
    }

    return { address, groundingUrls };
  } catch (error) {
    console.error("Geocoding failed:", error);
    return { address: "Reverse geocoding error", groundingUrls: [] };
  }
};
