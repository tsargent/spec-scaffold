import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { ScaffoldResult } from "@/types/scaffold";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge"; // or "nodejs" if you prefer

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { spec, techStack, style } = body as {
      spec: string;
      techStack?: string;
      style?: string;
    };

    if (!spec || typeof spec !== "string") {
      return NextResponse.json(
        { error: "Missing 'spec' in request body" },
        { status: 400 }
      );
    }

    const systemPrompt = buildSystemPrompt({ techStack, style });
    const userPrompt = buildUserPrompt(spec);

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // or similar small, fast model
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "scaffold_result",
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              summary: { type: "string" },
              architectureNotes: { type: "string" },
              files: {
                type: "array",
                items: {
                  type: "object",
                  additionalProperties: false,
                  properties: {
                    path: { type: "string" },
                    description: { type: "string" },
                    content: { type: "string" },
                  },
                  required: ["path", "description", "content"],
                },
              },
            },
            required: ["summary", "architectureNotes", "files"],
          },
          strict: true,
        },
      },
    });

    const parsed = JSON.parse(
      completion.choices[0].message.content || "{}"
    ) as ScaffoldResult;

    return NextResponse.json(parsed);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to generate scaffold" },
      { status: 500 }
    );
  }
}

function buildSystemPrompt(opts: { techStack?: string; style?: string }) {
  const {
    techStack = "TypeScript, React, Jest",
    style = "clean and idiomatic",
  } = opts;

  return [
    `You are a senior staff-level software engineer and code generator.`,
    `Your job: given a short feature spec, generate a small code scaffold for a project.`,
    `Focus on:`,
    `- ${techStack}`,
    `- ${style} code`,
    `- Good directory structure and naming`,
    ``,
    `Rules:`,
    `- ALWAYS respond as JSON matching the provided schema.`,
    `- Do NOT include explanations outside JSON.`,
    `- Prefer minimal but realistic files: some components, a test file, maybe a config.`,
  ].join("\n");
}

function buildUserPrompt(spec: string) {
  return [
    `Create a project scaffold for this feature:`,
    `---`,
    spec,
    `---`,
    ``,
    `Include:`,
    `- A brief summary of the project.`,
    `- High-level architecture notes.`,
    `- A list of files with path, description, and full content.`,
  ].join("\n");
}
