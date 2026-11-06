// src/app/(main)/[lang]/(public)/genres/[slug]/page.jsx
// Dynamic route: /genres/[slug]
// Handles ALL genres — novel, ghazal, haiku, essay, epic, etc.
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaArrowLeft, FaBookOpen } from "react-icons/fa";
import { fetchPoems } from "@/services/poemService";
import PoemsCard from "@/components/poems/poemscard";

/* ══════════════════════════════════════════════════════════════════
 *  GENRE CATALOG — must match what's in genres/page.jsx
 *  Only the metadata needed for the detail page is duplicated here.
 *  (Ideally this lives in a shared module — see note at the bottom.)
 * ══════════════════════════════════════════════════════════════════ */

const GENRE_CATALOG = {
  // ── Poetry ────────────────────────────────────────────────
  "epic":         { name: "Epic",         category: "Poetry",      color: "from-amber-500 to-orange-500", desc: "Long narrative poems about heroic deeds, journeys, and the fate of nations.", examples: ["Iliad", "Mahabharata", "Shahnameh", "Ramayana"] },
  "lyric":        { name: "Lyric",        category: "Poetry",      color: "from-rose-500 to-pink-500",    desc: "Short poems expressing personal emotion — sung, chanted, or read.", examples: ["Sappho's Odes", "Meghaduta", "Divan-e-Hafez"] },
  "sonnet":       { name: "Sonnet",       category: "Poetry",      color: "from-indigo-500 to-purple-500",desc: "14-line poems in strict meter — Shakespeare, Petrarch, and beyond.", examples: ["Sonnet 18", "Astrophil and Stella"] },
  "ode":          { name: "Ode",          category: "Poetry",      color: "from-yellow-500 to-amber-500", desc: "Lyric poems of praise — to a person, an object, or a moment.", examples: ["Ode to a Nightingale", "Ode to the West Wind"] },
  "elegy":        { name: "Elegy",        category: "Poetry",      color: "from-slate-500 to-gray-600",   desc: "Poems of mourning and remembrance.", examples: ["Lycidas", "In Memoriam"] },
  "ballad":       { name: "Ballad",       category: "Poetry",      color: "from-cyan-500 to-blue-500",    desc: "Story-poems with a strong rhythm — told, sung, remembered.", examples: ["The Rime of the Ancient Mariner", "Barbara Allen"] },
  "ghazal":       { name: "Ghazal",       category: "Poetry",      color: "from-red-500 to-rose-500",     desc: "Couplets of longing and loss — the heart of Urdu and Persian poetry.", examples: ["Divan-e-Ghalib", "Rumi's Ghazals"] },
  "qasida":       { name: "Qasida",       category: "Poetry",      color: "from-orange-500 to-red-500",   desc: "Panegyric ode in 20–170 couplets — praise for rulers and the divine.", examples: ["Mutannabi", "Urdu court poetry"] },
  "marsiya":      { name: "Marsiya",      category: "Poetry",      color: "from-gray-600 to-slate-700",   desc: "Elegy for the departed, most famously for the martyrs of Karbala.", examples: ["Anis", "Dabir", "Mir Anis"] },
  "nazm":         { name: "Nazm",         category: "Poetry",      color: "from-emerald-500 to-teal-500", desc: "A thematically unified poem — rhymed or free — distinct from the ghazal.", examples: ["Sahir Ludhianvi", "Faiz Ahmed Faiz"] },
  "masnavi":      { name: "Masnavi",      category: "Poetry",      color: "from-amber-600 to-orange-600", desc: "Long narrative poem in rhyming couplets — Rumi's spiritual epic.", examples: ["Masnavi-e-Manavi", "Gulistan"] },
  "rubai":        { name: "Rubai",        category: "Poetry",      color: "from-blue-500 to-cyan-500",    desc: "Four-line quatrain — Omar Khayyam's form of philosophical brevity.", examples: ["Omar Khayyam", "Ruba'iyat"] },
  "qita":         { name: "Qit'a",        category: "Poetry",      color: "from-indigo-500 to-blue-600",  desc: "Short fragment of two or more couplets, often epigrammatic.", examples: ["Urdu court verse", "Persian fragments"] },
  "doha":         { name: "Doha",         category: "Poetry",      color: "from-amber-500 to-yellow-500", desc: "Two-line rhyming couplet — the form of Kabir and Tulsidas.", examples: ["Kabir's Dohas", "Ramcharitmanas"] },
  "chaupai":      { name: "Chaupai",      category: "Poetry",      color: "from-lime-500 to-green-500",   desc: "Four-line rhymed verse in the Hindu epic tradition.", examples: ["Tulsidas", "Kabir"] },
  "kavya":        { name: "Kavya",        category: "Poetry",      color: "from-yellow-600 to-amber-600", desc: "Sanskrit court poetry — ornate, learned, and deeply structured.", examples: ["Kalidasa", "Bharavi", "Magha"] },
  "haiku":        { name: "Haiku",        category: "Poetry",      color: "from-green-500 to-emerald-500",desc: "Three lines, seventeen syllables — a moment captured in stillness.", examples: ["Bashō's Frog", "Issa's Sparrow"] },
  "tanka":        { name: "Tanka",        category: "Poetry",      color: "from-emerald-500 to-green-600",desc: "Five lines in 5-7-5-7-7 syllables — Japanese court poetry.", examples: ["Ki no Tsurayuki", "Ono no Komachi"] },
  "sijo":         { name: "Sijo",         category: "Poetry",      color: "from-teal-500 to-cyan-500",    desc: "Three-line Korean poem, 14–16 syllables per line.", examples: ["Yun Seon-do", "Hwang Jin-i"] },
  "landay":       { name: "Landay",       category: "Poetry",      color: "from-amber-500 to-orange-500", desc: "Two-line Pashto couplet — mostly by women, on love and war.", examples: ["Pashto oral tradition"] },
  "free-verse":   { name: "Free Verse",   category: "Poetry",      color: "from-teal-500 to-green-500",   desc: "Poetry without strict meter or rhyme — the rhythm is in the breath.", examples: ["Song of Myself", "The Waste Land"] },
  "blank-verse":  { name: "Blank Verse",  category: "Poetry",      color: "from-violet-500 to-purple-600",desc: "Unrhymed iambic pentameter — the voice of Shakespeare's plays.", examples: ["Paradise Lost", "Hamlet"] },
  "prose-poem":   { name: "Prose Poem",   category: "Poetry",      color: "from-fuchsia-500 to-pink-500", desc: "Poetry in paragraph form — image and rhythm without line breaks.", examples: ["Le Spleen de Paris", "Tender Buttons"] },
  "aubade":       { name: "Aubade",       category: "Poetry",      color: "from-orange-400 to-amber-500", desc: "Dawn song — lovers parting at sunrise.", examples: ["Larkin's 'Aubade'", "Donne's 'The Sun Rising'"] },
  "pastoral":     { name: "Pastoral",     category: "Poetry",      color: "from-green-500 to-lime-500",   desc: "Poetry of idealized rural life — shepherds, fields, and simplicity.", examples: ["Virgil's Eclogues"] },
  "epithalamion": { name: "Epithalamion", category: "Poetry",      color: "from-pink-500 to-rose-500",    desc: "Wedding song — celebrating a marriage in verse.", examples: ["Spenser's Epithalamion"] },
  "dirge":        { name: "Dirge",        category: "Poetry",      color: "from-gray-500 to-slate-600",   desc: "Funeral song — a lament sung at burial.", examples: ["Shakespeare's dirges"] },
  "panegyric":    { name: "Panegyric",    category: "Poetry",      color: "from-yellow-500 to-amber-600", desc: "Poem of elaborate praise for a person or event.", examples: ["Pindar's Odes"] },
  "verse-satire": { name: "Verse Satire", category: "Poetry",      color: "from-red-500 to-rose-600",     desc: "Poetry that ridicules folly or vice.", examples: ["Horace", "Pope's Dunciad"] },
  "epigram":      { name: "Epigram",      category: "Poetry",      color: "from-purple-500 to-indigo-500",desc: "Brief, pithy poem — often witty or satirical.", examples: ["Martial", "Pope"] },
  "hymn":         { name: "Hymn",         category: "Poetry",      color: "from-amber-500 to-orange-600", desc: "Sacred song of praise — Vedic, biblical, and beyond.", examples: ["Vedic hymns", "Psalms"] },
  "riddle":       { name: "Riddle",       category: "Poetry",      color: "from-cyan-500 to-teal-500",    desc: "Puzzle in verse — the answer is hidden in the poem.", examples: ["Exeter Book riddles"] },
  "ekphrasis":    { name: "Ekphrasis",    category: "Poetry",      color: "from-fuchsia-500 to-purple-500",desc: "Poetic description of a work of visual art.", examples: ["Ode on a Grecian Urn"] },

  // ── Prose ─────────────────────────────────────────────────
  "novel":         { name: "Novel",         category: "Prose",    color: "from-blue-500 to-indigo-500",   desc: "Long-form fiction — character, plot, and world across hundreds of pages.", examples: ["Pride and Prejudice", "Godaan"] },
  "novella":       { name: "Novella",       category: "Prose",    color: "from-indigo-500 to-blue-600",   desc: "Between a short story and a novel — focused, intense, complete.", examples: ["The Metamorphosis", "Of Mice and Men"] },
  "short-story":   { name: "Short Story",   category: "Prose",    color: "from-teal-500 to-cyan-500",     desc: "Fiction under ~7,500 words — a single effect, a single moment.", examples: ["The Lottery", "The Gift of the Magi"] },
  "flash-fiction": { name: "Flash Fiction", category: "Prose",    color: "from-cyan-500 to-teal-600",     desc: "Fiction under 1,000 words — a whole world in a page.", examples: ["Hemingway's six-word story"] },
  "fable":         { name: "Fable",         category: "Prose",    color: "from-green-500 to-emerald-500", desc: "Short story with animals and a moral.", examples: ["Aesop's Fables", "Panchatantra"] },
  "fairy-tale":    { name: "Fairy Tale",    category: "Prose",    color: "from-pink-500 to-rose-500",     desc: "Magical folk narrative — kings, witches, and happily ever after.", examples: ["Grimm's Tales", "Arabian Nights"] },
  "myth":          { name: "Myth",          category: "Prose",    color: "from-amber-500 to-orange-500",  desc: "Sacred narrative explaining the world — gods, heroes, origins.", examples: ["Greek myths", "Puranas"] },
  "legend":        { name: "Legend",        category: "Prose",    color: "from-yellow-500 to-amber-600",  desc: "Story with a grain of history — larger than life, but rooted.", examples: ["King Arthur", "Robin Hood"] },
  "tall-tale":     { name: "Tall Tale",     category: "Prose",    color: "from-orange-500 to-red-500",    desc: "Exaggerated folk story — Paul Bunyan, Pecos Bill.", examples: ["Paul Bunyan"] },
  "parable":       { name: "Parable",       category: "Prose",    color: "from-lime-500 to-green-500",    desc: "Short story teaching a moral lesson.", examples: ["The Good Samaritan"] },
  "allegory":      { name: "Allegory",      category: "Prose",    color: "from-purple-500 to-indigo-500", desc: "Narrative with two meanings — surface story, deeper truth.", examples: ["Animal Farm", "The Pilgrim's Progress"] },

  // ── Essay ─────────────────────────────────────────────────
  "personal-essay":   { name: "Personal Essay",      category: "Essay", color: "from-amber-500 to-yellow-500", desc: "First-person reflection — the writer's own life as subject.", examples: ["Montaigne's Essays", "Orwell's 'Shooting an Elephant'"] },
  "critical-essay":   { name: "Critical Essay",      category: "Essay", color: "from-rose-500 to-pink-500",    desc: "Analysis and evaluation of a work of literature or art.", examples: ["Eliot's 'Tradition and the Individual Talent'"] },
  "argumentative":    { name: "Argumentative Essay", category: "Essay", color: "from-red-500 to-rose-600",     desc: "Persuasive prose — claim, evidence, reasoning.", examples: ["Swift's 'A Modest Proposal'"] },
  "narrative-essay":  { name: "Narrative Essay",     category: "Essay", color: "from-indigo-500 to-purple-500",desc: "Essay that tells a story from the writer's life.", examples: ["Angelou's 'Graduation'"] },
  "expository-essay": { name: "Expository Essay",    category: "Essay", color: "from-teal-500 to-cyan-500",    desc: "Essay that explains or informs.", examples: ["Encyclopedia entries"] },
  "compare-contrast": { name: "Compare & Contrast",  category: "Essay", color: "from-blue-500 to-indigo-500",  desc: "Essay that compares two subjects to illuminate both.", examples: ["Comparative literature essays"] },

  // ── Non-Fiction ───────────────────────────────────────────
  "biography":     { name: "Biography",         category: "Non-Fiction", color: "from-amber-600 to-yellow-600",  desc: "The life story of another person.", examples: ["Boswell's Life of Johnson"] },
  "autobiography": { name: "Autobiography",     category: "Non-Fiction", color: "from-orange-500 to-amber-600",  desc: "The writer's own life, told by the writer.", examples: ["Gandhi's My Experiments with Truth"] },
  "memoir":        { name: "Memoir",            category: "Non-Fiction", color: "from-teal-500 to-emerald-500",  desc: "A slice of memory — a period, a theme, a relationship.", examples: ["Elie Wiesel's Night"] },
  "diary":         { name: "Diary / Journal",   category: "Non-Fiction", color: "from-slate-500 to-gray-600",    desc: "Day-by-day record of a life.", examples: ["Anne Frank's Diary"] },
  "travel":        { name: "Travel Writing",    category: "Non-Fiction", color: "from-cyan-500 to-blue-500",     desc: "The journey as subject — places, people, encounters.", examples: ["Naipaul's An Area of Darkness"] },
  "criticism":     { name: "Literary Criticism",category: "Non-Fiction", color: "from-purple-500 to-violet-500", desc: "Analysis and interpretation of literature.", examples: ["Coleridge's Biographia Literaria"] },
  "philosophy":    { name: "Philosophy",        category: "Non-Fiction", color: "from-indigo-500 to-blue-500",   desc: "Reasoned enquiry into existence, ethics, and knowledge.", examples: ["Plato's Dialogues"] },
  "history":       { name: "History",           category: "Non-Fiction", color: "from-amber-700 to-orange-700",  desc: "Narrative of past events — the world as it was.", examples: ["Herodotus"] },
  "letters":       { name: "Letters",           category: "Non-Fiction", color: "from-rose-500 to-pink-600",     desc: "Correspondence as literature.", examples: ["Rilke's Letters to a Young Poet"] },
  "aphorism":      { name: "Aphorism",          category: "Non-Fiction", color: "from-fuchsia-500 to-purple-500",desc: "Short, pithy statements — wisdom condensed.", examples: ["Nietzsche's aphorisms"] },
  "maxims":        { name: "Maxims",            category: "Non-Fiction", color: "from-violet-500 to-purple-600", desc: "Rules of conduct — moral wisdom in brief.", examples: ["La Rochefoucauld's Maxims"] },
  "sermon":        { name: "Sermon",            category: "Non-Fiction", color: "from-amber-500 to-orange-500",  desc: "Religious discourse — moral instruction from the pulpit.", examples: ["Donne's Sermons"] },

  // ── Drama ─────────────────────────────────────────────────
  "tragedy":     { name: "Tragedy",     category: "Drama", color: "from-slate-600 to-gray-700",  desc: "Serious drama ending in catastrophe — the fall of a hero.", examples: ["Hamlet", "Oedipus Rex"] },
  "comedy":      { name: "Comedy",      category: "Drama", color: "from-yellow-500 to-amber-500",desc: "Drama that amuses — confusion, wit, and happy endings.", examples: ["A Midsummer Night's Dream"] },
  "tragicomedy": { name: "Tragicomedy", category: "Drama", color: "from-teal-500 to-cyan-500",   desc: "Serious and comic in one — the full range of human experience.", examples: ["The Tempest", "Waiting for Godot"] },
  "farce":       { name: "Farce",       category: "Drama", color: "from-orange-500 to-red-500",  desc: "Comedy of absurd situations and physical humour.", examples: ["Feydeau's farces"] },
  "melodrama":   { name: "Melodrama",   category: "Drama", color: "from-pink-500 to-rose-500",   desc: "Exaggerated emotion and clear heroes and villains.", examples: ["Victorian melodramas"] },
  "masque":      { name: "Masque",      category: "Drama", color: "from-fuchsia-500 to-pink-600",desc: "Courtly drama with music, dance, and spectacle.", examples: ["Milton's Comus"] },
  "opera":       { name: "Opera",       category: "Drama", color: "from-purple-500 to-fuchsia-500", desc: "Drama set to music.", examples: ["La Bohème"] },
  "monologue":   { name: "Monologue",   category: "Drama", color: "from-indigo-500 to-blue-500", desc: "One voice speaking — the stage is the interior life.", examples: ["Hamlet's soliloquies"] },
  "dialogue":    { name: "Dialogue",    category: "Drama", color: "from-cyan-500 to-teal-500",   desc: "Two voices in conversation — philosophy, drama, or both.", examples: ["Plato's Dialogues"] },

  // ── Folklore ──────────────────────────────────────────────
  "folk-song":     { name: "Folk Song",     category: "Folklore", color: "from-amber-500 to-orange-500",  desc: "Traditional song passed down orally.", examples: ["Kajri", "Baul songs", "Alha"] },
  "proverb":       { name: "Proverb",       category: "Folklore", color: "from-teal-500 to-emerald-500",  desc: "Short, traditional saying carrying wisdom or advice.", examples: ["'A stitch in time…'"] },
  "nursery-rhyme": { name: "Nursery Rhyme", category: "Folklore", color: "from-pink-500 to-rose-500",     desc: "Short rhyme for children.", examples: ["'Humpty Dumpty'"] },
  "folk-riddle":   { name: "Folk Riddle",   category: "Folklore", color: "from-cyan-500 to-teal-600",     desc: "Traditional puzzle in verse.", examples: ["Exeter Book riddles"] },
  "folk-ballad":   { name: "Folk Ballad",   category: "Folklore", color: "from-blue-500 to-indigo-600",   desc: "Narrative song passed down by ear.", examples: ["Barbara Allen"] },

  // ── Oratory ───────────────────────────────────────────────
  "speech": { name: "Speech", category: "Oratory", color: "from-amber-600 to-orange-600", desc: "Public address — argument, inspiration, or ceremony.", examples: ["'I Have a Dream'"] },
  "eulogy": { name: "Eulogy", category: "Oratory", color: "from-slate-600 to-gray-700",   desc: "A speech of praise — most often for the dead.", examples: ["Pericles' Funeral Oration"] },
  "debate": { name: "Debate", category: "Oratory", color: "from-indigo-500 to-blue-500",  desc: "Structured argument — two or more voices in formal opposition.", examples: ["Lincoln–Douglas debates"] },
};

/* ══════════════════════════════════════════════════════════════════
 *  PAGE
 * ══════════════════════════════════════════════════════════════════ */

export default function GenreDetailPage() {
  const params = useParams();
  const slug = params?.slug;

  const genre = GENRE_CATALOG[slug];

  const [poems, setPoems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    if (!genre) return;

    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchPoems({ page: 1, limit: 30, category: genre.name });
        if (!cancelled) setPoems(Array.isArray(res?.poems) ? res.poems : []);
      } catch (e) {
        if (!cancelled) setError(e.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [slug, genre]);

  if (!genre) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4">
        <FaBookOpen className="w-16 h-16 text-gray-300 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
          Genre not found
        </h1>
        <p className="text-gray-500 mb-4">"{slug}" isn't a genre we recognise.</p>
        <Link
          href="/genres"
          className="px-4 py-2 rounded-full bg-amber-600 text-white hover:bg-amber-700"
        >
          Browse all genres
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto">
        <Link
          href="/genres"
          className="inline-flex items-center gap-2 text-amber-600 hover:underline mb-6"
        >
          <FaArrowLeft size={12} /> All genres
        </Link>

        {/* Header */}
        <div className={`relative mb-10 p-8 rounded-2xl bg-gradient-to-r ${genre.color} text-white`}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-xs uppercase tracking-widest opacity-80">
              {genre.category}
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold mb-2">
            {genre.name}
          </h1>
          <p className="text-white/90 max-w-3xl">
            {genre.desc}
          </p>

          {genre.examples?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {genre.examples.map((ex) => (
                <span
                  key={ex}
                  className="text-xs px-3 py-1 rounded-full bg-white/20 backdrop-blur"
                >
                  {ex}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Poems in this genre */}
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Poems in {genre.name}
        </h2>

        {loading ? (
          <div className="text-center py-16 text-gray-500">Loading…</div>
        ) : error ? (
          <div className="text-center py-16 text-red-500">⚠ {error}</div>
        ) : poems.length === 0 ? (
          <div className="text-center py-16">
            <FaBookOpen className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              No {genre.name.toLowerCase()} yet. Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {poems.map((poem) => (
              <PoemsCard
                key={poem.id}
                poem={{
                  ...poem,
                  poet: poem.poet?.name || poem.author || "Unknown Poet",
                  poetSlug: poem.poet?.slug,
                  excerpt:
                    poem.description ||
                    poem.excerpt ||
                    (poem.content
                      ? poem.content.substring(0, 150) + "..."
                      : ""),
                  tags: poem.tags || [],
                  type: poem.category?.name || poem.type || "Poem",
                }}
                lang={params?.lang || "en"}
                variant="grid"
                showActions={true}
                showTags={true}
                showExcerpt={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}