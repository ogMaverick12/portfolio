import { NextResponse } from "next/server";

const ABOUT_CONTEXT = `You are a terminal assistant embedded in Sreejit Pradhan's portfolio website. 
Sreejit is a 16-year-old self-taught programmer from India learning Python and C++ for competitive programming.
He built SoilSense AI (offline edge soil advisor), PathForge AI (career navigation parser), and PrepPilot (adaptive exam prep tool).
His social: GitHub: ogMaverick12, Twitter: @SreejitX, Email: sreejit.dev12@gmail.com, LinkedIn: sreejit-pradhan-b27b19401, Instagram: mav2.009, Dev.to: sreejit_
Answer questions about Sreejit in a concise, friendly, slightly technical terminal style. 
Use plain text only — no markdown, no asterisks, no bullet symbols (use plain dashes or arrows like → if needed).
Keep answers under 6 lines. If asked something unrelated to Sreejit, redirect politely.`;

export async function POST(request: Request) {
  try {
    const { question } = await request.json();
    if (!question) {
      return NextResponse.json({ error: "No question provided" }, { status: 400 });
    }

    const geminiKey = process.env.GEMINI_API_KEY;
    const anthropicKey = process.env.ANTHROPIC_API_KEY;

    if (geminiKey) {
      // Use Google Gemini API
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: `${ABOUT_CONTEXT}\n\nUser Question: ${question}` }],
              },
            ],
            generationConfig: {
              maxOutputTokens: 200,
              temperature: 0.7,
            },
          }),
        }
      );

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
      return NextResponse.json({ text });
    } else if (anthropicKey) {
      // Use Anthropic Claude API
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": anthropicKey,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 200,
          system: ABOUT_CONTEXT,
          messages: [{ role: "user", content: question }],
        }),
      });

      const data = await response.json();
      const text = data.content?.[0]?.text || "";
      return NextResponse.json({ text });
    } else {
      // Graceful fallback if no keys are set in local environment
      // Provide a smart localized fallback response matching Sreejit's details
      const q = question.toLowerCase();
      let text = "Sreejit is a 16-year-old self-taught programmer from India, learning Python and C++ for competitive programming.";
      
      if (q.includes("project") || q.includes("work") || q.includes("practice")) {
        text = "Sreejit's projects include:\n→ SoilSense AI - offline edge soil analyzer (Gemma 4 on Pi)\n→ PathForge AI - career roadmap parser (IBM Granite)\n→ PrepPilot - adaptive exam prep tool (Gemini API)";
      } else if (q.includes("skill") || q.includes("tech") || q.includes("code")) {
        text = "Sreejit's main languages are Python and C++. He is learning basic logic checks, complexity analysis, arrays, and standard vectors.";
      } else if (q.includes("contact") || q.includes("email") || q.includes("hire") || q.includes("collab")) {
        text = "Get in touch with Sreejit at sreejit.dev12@gmail.com, on Twitter/X @SreejitX, or github.com/ogMaverick12.";
      }
      
      return NextResponse.json({ text });
    }
  } catch (error) {
    console.error("Terminal API route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
