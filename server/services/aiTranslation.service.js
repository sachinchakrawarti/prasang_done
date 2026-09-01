import { eq, and } from "drizzle-orm";

import { db } from "../../db/config/database.js";
import {
  poems,
  aiTranslations,
} from "../../db/schema/index.js";

// --------------------------------------------------
// CONFIG
// --------------------------------------------------

const OLLAMA_URL =
  process.env.OLLAMA_URL ||
  "http://127.0.0.1:11434";

const OLLAMA_MODEL =
  process.env.OLLAMA_MODEL ||
  "madlad400";

// --------------------------------------------------
// SUPPORTED LANGUAGES
// --------------------------------------------------

export const SUPPORTED_LANGUAGES = [
  {
    code: "hi",
    name: "Hindi",
  },
  {
    code: "mr",
    name: "Marathi",
  },
  {
    code: "gu",
    name: "Gujarati",
  },
  {
    code: "bn",
    name: "Bengali",
  },
  {
    code: "ta",
    name: "Tamil",
  },
  {
    code: "te",
    name: "Telugu",
  },
  {
    code: "kn",
    name: "Kannada",
  },
  {
    code: "ml",
    name: "Malayalam",
  },
  {
    code: "pa",
    name: "Punjabi",
  },
  {
    code: "ur",
    name: "Urdu",
  },
  {
    code: "fr",
    name: "French",
  },
  {
    code: "de",
    name: "German",
  },
  {
    code: "es",
    name: "Spanish",
  },
  {
    code: "it",
    name: "Italian",
  },
  {
    code: "pt",
    name: "Portuguese",
  },
  {
    code: "ru",
    name: "Russian",
  },
  {
    code: "ar",
    name: "Arabic",
  },
  {
    code: "fa",
    name: "Persian",
  },
  {
    code: "tr",
    name: "Turkish",
  },
  {
    code: "ja",
    name: "Japanese",
  },
  {
    code: "zh",
    name: "Chinese",
  },
  {
    code: "en",
    name: "English",
  },
];

// --------------------------------------------------
// GET POEM
// --------------------------------------------------

export async function getPoem(poemId) {
  const id = Number(poemId);

  if (!Number.isInteger(id)) {
    throw new Error("Invalid poem ID");
  }

  const [poem] = await db
    .select()
    .from(poems)
    .where(eq(poems.id, id))
    .limit(1);

  if (!poem) {
    throw new Error(
      `Poem ${id} not found`
    );
  }

  return poem;
}

// --------------------------------------------------
// TRANSLATE POEM USING OLLAMA
// --------------------------------------------------

export async function translateWithOllama({
  title,
  content,
  sourceLanguage,
  targetLanguage,
}) {
  const prompt = `
You are a professional literary poetry translator.

Translate the following poem from ${sourceLanguage}
to ${targetLanguage}.

IMPORTANT RULES:

1. Preserve the meaning of the poem.
2. Preserve the poetic tone and emotion.
3. Preserve line breaks.
4. Do not explain the translation.
5. Do not add commentary.
6. Do not add quotation marks.
7. Translate the title separately.
8. Return ONLY valid JSON.

JSON format:

{
  "title": "translated title",
  "content": "translated poem"
}

POEM TITLE:
${title}

POEM:
${content}
`;

  const response = await fetch(
    `${OLLAMA_URL}/api/generate`,
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        model: OLLAMA_MODEL,

        prompt,

        stream: false,

        format: "json",

        options: {
          temperature: 0.3,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText =
      await response.text();

    throw new Error(
      `Ollama error ${response.status}: ${errorText}`
    );
  }

  const result =
    await response.json();

  if (!result.response) {
    throw new Error(
      "Ollama returned empty response"
    );
  }

  let parsed;

  try {
    parsed = JSON.parse(
      result.response
    );
  } catch {
    throw new Error(
      "Ollama returned invalid JSON"
    );
  }

  if (
    !parsed.title ||
    !parsed.content
  ) {
    throw new Error(
      "Translation response is incomplete"
    );
  }

  return {
    title: parsed.title.trim(),
    content: parsed.content.trim(),
  };
}

// --------------------------------------------------
// CHECK EXISTING TRANSLATION
// --------------------------------------------------

export async function getExistingTranslation({
  poemId,
  language,
}) {
  const result = await db
    .select()
    .from(aiTranslations)
    .where(
      and(
        eq(
          aiTranslations.poemId,
          Number(poemId)
        ),
        eq(
          aiTranslations.language,
          language
        )
      )
    )
    .limit(1);

  return result[0] || null;
}

// --------------------------------------------------
// TRANSLATE ONE POEM
// --------------------------------------------------

export async function translatePoem({
  poemId,
  targetLanguage,
  force = false,
}) {
  const poem =
    await getPoem(poemId);

  // ----------------------------------------------
  // Don't translate source language
  // ----------------------------------------------

  if (
    poem.language ===
    targetLanguage
  ) {
    return {
      skipped: true,
      reason:
        "Target language is the same as source language",
      poemId: poem.id,
      language: targetLanguage,
    };
  }

  // ----------------------------------------------
  // Check existing translation
  // ----------------------------------------------

  const existing =
    await getExistingTranslation({
      poemId: poem.id,
      language: targetLanguage,
    });

  if (existing && !force) {
    return {
      skipped: true,
      reason:
        "Translation already exists",
      data: existing,
    };
  }

  // ----------------------------------------------
  // Mark processing
  // ----------------------------------------------

  let translation =
    await translateWithOllama({
      title: poem.title,
      content: poem.content,
      sourceLanguage:
        poem.language,
      targetLanguage,
    });

  // ----------------------------------------------
  // Save translation
  // ----------------------------------------------

  const values = {
    poemId: poem.id,

    language: targetLanguage,

    title: translation.title,

    content: translation.content,

    poemVersion:
      poem.contentVersion || 1,

    model: OLLAMA_MODEL,

    provider: "ollama",

    status: "completed",

    translatedAt: new Date(),
  };

  let saved;

  if (existing) {
    [saved] = await db
      .update(aiTranslations)
      .set(values)
      .where(
        eq(
          aiTranslations.id,
          existing.id
        )
      )
      .returning();
  } else {
    [saved] = await db
      .insert(aiTranslations)
      .values(values)
      .returning();
  }

  return {
    skipped: false,
    data: saved,
  };
}

// --------------------------------------------------
// TRANSLATE POEM INTO MULTIPLE LANGUAGES
// --------------------------------------------------

export async function translatePoemToLanguages({
  poemId,
  languages = SUPPORTED_LANGUAGES.map(
    (language) => language.code
  ),
  force = false,
}) {
  const poem =
    await getPoem(poemId);

  const results = [];

  for (const language of languages) {
    try {
      console.log(
        `🌍 Translating poem ${poem.id} → ${language}`
      );

      const result =
        await translatePoem({
          poemId: poem.id,
          targetLanguage: language,
          force,
        });

      results.push({
        language,
        success: true,
        ...result,
      });
    } catch (error) {
      console.error(
        `❌ Translation failed: ${language}`,
        error
      );

      results.push({
        language,
        success: false,
        error: error.message,
      });
    }
  }

  return {
    poemId: poem.id,

    sourceLanguage:
      poem.language,

    total: languages.length,

    completed:
      results.filter(
        (item) =>
          item.success &&
          !item.skipped
      ).length,

    skipped:
      results.filter(
        (item) => item.skipped
      ).length,

    failed:
      results.filter(
        (item) => !item.success
      ).length,

    results,
  };
}

// --------------------------------------------------
// TRANSLATE ALL LANGUAGES
// --------------------------------------------------

export async function translatePoemToAllLanguages(
  poemId,
  force = false
) {
  const languages =
    SUPPORTED_LANGUAGES
      .map(
        (language) =>
          language.code
      );

  return translatePoemToLanguages({
    poemId,
    languages,
    force,
  });
}