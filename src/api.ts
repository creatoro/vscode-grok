import axios from "axios";
import { API_URL } from "./const";

export async function sendToGrok(
  apiKey: string,
  model: string,
  content: string
): Promise<any> {
  const response = await axios.post(
    API_URL,
    {
      messages: [{ role: "user", content }],
      model,
      stream: false,
      temperature: 0,
    },
    {
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
}
