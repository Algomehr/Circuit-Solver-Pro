
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { Message, Role } from "../types.ts";

const SYSTEM_INSTRUCTION = `شما یک استاد متخصص در مهندسی برق و مدارهای الکتریکی هستید.
وظیفه شما حل دقیق و گام‌به‌گام مسائل مدار (KCL, KVL، تحلیل مش، گره، قضایای تونن و نورتن، فازورها و تحلیل گذرا) است.

قوانین پاسخ‌دهی (بسیار مهم):
1. همیشه از زبان فارسی صمیمی و علمی استفاده کنید.
2. تمام فرمول‌های ریاضی و متغیرهای فیزیکی (مانند V, I, R, C, L) را حتماً در LaTeX محصور کنید ($V=IR$).
3. برای معادلات چندخطی یا مهم حتماً از ساختار $$ ... $$ استفاده کنید.
4. برای جلوگیری از به هم ریختگی متون ترکیبی، هرگاه معادله‌ای طولانی است، آن را در یک خط جداگانه (Display mode) قرار دهید.
5. اعداد داخل فرمول‌ها باید انگلیسی باشند.
6. راه‌حل را به مراحل منطقی (مرحله ۱، ۲ و ...) تقسیم کنید.
7. اگر تصویر مدار فرستاده شد، ابتدا تحلیل خود را از ساختار مدار بنویسید.
8. در انتهای پاسخ، یک "نکته کنکوری" یا "نکته اجرایی" درباره همان مبحث ذکر کنید.`;

export async function* sendMessageStream(messages: Message[]) {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  const contents = messages.map(msg => ({
    role: msg.role === Role.USER ? 'user' : 'model',
    parts: msg.parts.map(part => {
      if (part.text) return { text: part.text };
      if (part.inlineData) return { inlineData: part.inlineData };
      return { text: "" };
    })
  }));

  const streamResponse = await ai.models.generateContentStream({
    model: 'gemini-3-pro-preview',
    contents: contents,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
      topP: 0.95,
      topK: 40,
    }
  });

  for await (const chunk of streamResponse) {
    const c = chunk as GenerateContentResponse;
    yield c.text || "";
  }
}
