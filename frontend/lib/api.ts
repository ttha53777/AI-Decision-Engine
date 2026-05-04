import { DecisionRequest, DecisionResponse } from "@/lib/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

export async function analyzeDecision(
  payload: DecisionRequest
): Promise<DecisionResponse> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}/analyze-decision`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(
        "Could not reach the decision API. Confirm the backend is running, NEXT_PUBLIC_API_BASE_URL is correct, and the server allows this site origin (CORS)."
      );
    }
    throw error;
  }

  if (!response.ok) {
    let message = "Failed to analyze decision. Please try again.";
    try {
      const errorBody = (await response.json()) as { detail?: string };
      if (errorBody.detail) {
        message = errorBody.detail;
      }
    } catch {
      // Keep generic message if error body cannot be parsed.
    }
    throw new Error(message);
  }

  return response.json() as Promise<DecisionResponse>;
}
