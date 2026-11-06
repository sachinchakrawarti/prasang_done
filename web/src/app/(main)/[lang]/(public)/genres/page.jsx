// src/app/(main)/[lang]/(public)/genres/page.jsx
// English only. No lang param in URLs.
"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  FaSearch,
  FaTheaterMasks,
  FaFeatherAlt,
  FaBookOpen,
  FaScroll,
  FaMusic,
  FaPenNib,
  FaHeart,
  FaLeaf,
  FaAward,
  FaPrayingHands,
  FaFeather,
  FaLandmark,
  FaStar,
  FaPenFancy,
  FaSun,
  FaTree,
  FaQuestionCircle,
  FaNewspaper,
  FaBook,
  FaBookmark,
  FaMicrophone,
  FaComments,
  FaQuoteLeft,
  FaBookReader,
  FaRegNewspaper,
  FaGlobe,
  FaUsers,
} from "react-icons/fa";

/* ══════════════════════════════════════════════════════════════════
 *  CATEGORIES
 *  Each has a slug, name, icon, and a list of genres.
 * ══════════════════════════════════════════════════════════════════ */

const CATEGORIES = [
  /* ── 1. POETRY ──────────────────────────────────────────────── */
  {
    slug: "poetry",
    name: "Poetry",
    icon: FaFeatherAlt,
    desc: "Verse in all its forms — from ancient epics to contemporary free verse.",
    genres: [
      { slug: "epic",        name: "Epic",         desc: "Long narrative poems about heroic deeds and the fate of nations.",  examples: ["Iliad", "Mahabharata", "Shahnameh"], color: "from-amber-500 to-orange-500" },
      { slug: "lyric",       name: "Lyric",        desc: "Short poems of personal emotion — sung, chanted, or read.",          examples: ["Sappho's Odes", "Meghaduta"], color: "from-rose-500 to-pink-500" },
      { slug: "sonnet",      name: "Sonnet",       desc: "14-line poems in strict meter — Shakespeare, Petrarch, and beyond.",  examples: ["Sonnet 18", "Astrophil and Stella"], color: "from-indigo-500 to-purple-500" },
      { slug: "ode",         name: "Ode",          desc: "Lyric poems of praise — to a person, an object, or a moment.",      examples: ["Ode to a Nightingale", "Ode to the West Wind"], color: "from-yellow-500 to-amber-500" },
      { slug: "elegy",       name: "Elegy",        desc: "Poems of mourning and remembrance.",                                 examples: ["Lycidas", "In Memoriam"], color: "from-slate-500 to-gray-600" },
      { slug: "ballad",      name: "Ballad",       desc: "Story-poems with a strong rhythm — told, sung, remembered.",         examples: ["Ancient Mariner", "Barbara Allen"], color: "from-cyan-500 to-blue-500" },
      { slug: "ghazal",      name: "Ghazal",       desc: "Couplets of longing and loss — the heart of Urdu and Persian poetry.", examples: ["Divan-e-Ghalib", "Rumi's Ghazals"], color: "from-red-500 to-rose-500" },
      { slug: "qasida",      name: "Qasida",       desc: "Panegyric ode in 20–170 couplets — praise for rulers and the divine.", examples: ["Mutannabi", "Urdu court poetry"], color: "from-orange-500 to-red-500" },
      { slug: "marsiya",     name: "Marsiya",      desc: "Elegy for the departed, most famously for the martyrs of Karbala.",  examples: ["Anis", "Dabir"], color: "from-gray-600 to-slate-700" },
      { slug: "nazm",        name: "Nazm",         desc: "A thematically unified poem — rhymed or free.",                      examples: ["Faiz Ahmed Faiz", "Sahir Ludhianvi"], color: "from-emerald-500 to-teal-500" },
      { slug: "masnavi",     name: "Masnavi",      desc: "Long narrative poem in rhyming couplets — Rumi's spiritual epic.",   examples: ["Masnavi-e-Manavi", "Gulistan"], color: "from-amber-600 to-orange-600" },
      { slug: "rubai",       name: "Rubai",        desc: "Four-line quatrain — Omar Khayyam's form of philosophical brevity.", examples: ["Omar Khayyam", "Ruba'iyat"], color: "from-blue-500 to-cyan-500" },
      { slug: "qita",        name: "Qit'a",        desc: "Short fragment of two or more couplets, often epigrammatic.",        examples: ["Urdu court verse"], color: "from-indigo-500 to-blue-600" },
      { slug: "doha",        name: "Doha",         desc: "Two-line rhyming couplet — the form of Kabir and Tulsidas.",         examples: ["Kabir's Dohas", "Ramcharitmanas"], color: "from-amber-500 to-yellow-500" },
      { slug: "chaupai",     name: "Chaupai",      desc: "Four-line rhymed verse in the Hindu epic tradition.",                examples: ["Tulsidas", "Kabir"], color: "from-lime-500 to-green-500" },
      { slug: "kavya",       name: "Kavya",        desc: "Sanskrit court poetry — ornate, learned, and deeply structured.",    examples: ["Kalidasa", "Magha"], color: "from-yellow-600 to-amber-600" },
      { slug: "haiku",       name: "Haiku",        desc: "Three lines, seventeen syllables — a moment captured in stillness.", examples: ["Bashō's Frog", "Issa's Sparrow"], color: "from-green-500 to-emerald-500" },
      { slug: "tanka",       name: "Tanka",        desc: "Five lines in 5-7-5-7-7 syllables — Japanese court poetry.",         examples: ["Ki no Tsurayuki", "Ono no Komachi"], color: "from-emerald-500 to-green-600" },
      { slug: "sijo",        name: "Sijo",         desc: "Three-line Korean poem, 14–16 syllables per line.",                  examples: ["Yun Seon-do", "Hwang Jin-i"], color: "from-teal-500 to-cyan-500" },
      { slug: "landay",      name: "Landay",       desc: "Two-line Pashto couplet — mostly by women, on love and war.",        examples: ["Pashto oral tradition"], color: "from-amber-500 to-orange-500" },
      { slug: "free-verse",  name: "Free Verse",   desc: "Poetry without strict meter or rhyme — the rhythm is in the breath.", examples: ["Song of Myself", "The Waste Land"], color: "from-teal-500 to-green-500" },
      { slug: "blank-verse", name: "Blank Verse",  desc: "Unrhymed iambic pentameter — the voice of Shakespeare's plays.",     examples: ["Paradise Lost", "Hamlet"], color: "from-violet-500 to-purple-600" },
      { slug: "prose-poem",  name: "Prose Poem",   desc: "Poetry in paragraph form — image and rhythm without line breaks.",   examples: ["Le Spleen de Paris", "Tender Buttons"], color: "from-fuchsia-500 to-pink-500" },
      { slug: "aubade",      name: "Aubade",       desc: "Dawn song — lovers parting at sunrise.",                             examples: ["Larkin's 'Aubade'", "Donne's 'The Sun Rising'"], color: "from-orange-400 to-amber-500" },
      { slug: "pastoral",    name: "Pastoral",     desc: "Poetry of idealized rural life — shepherds, fields, and simplicity.", examples: ["Virgil's Eclogues"], color: "from-green-500 to-lime-500" },
      { slug: "epithalamion",name: "Epithalamion", desc: "Wedding song — celebrating a marriage in verse.",                    examples: ["Spenser's Epithalamion"], color: "from-pink-500 to-rose-500" },
      { slug: "dirge",       name: "Dirge",        desc: "Funeral song — a lament sung at burial.",                            examples: ["Shakespeare's dirges"], color: "from-gray-500 to-slate-600" },
      { slug: "panegyric",   name: "Panegyric",    desc: "Poem of elaborate praise for a person or event.",                    examples: ["Pindar's Odes"], color: "from-yellow-500 to-amber-600" },
      { slug: "verse-satire",name: "Verse Satire", desc: "Poetry that ridicules folly or vice.",                               examples: ["Horace", "Pope's Dunciad"], color: "from-red-500 to-rose-600" },
      { slug: "epigram",     name: "Epigram",      desc: "Brief, pithy poem — often witty or satirical.",                      examples: ["Martial", "Pope"], color: "from-purple-500 to-indigo-500" },
      { slug: "hymn",        name: "Hymn",         desc: "Sacred song of praise — Vedic, biblical, and beyond.",                examples: ["Vedic hymns", "Psalms"], color: "from-amber-500 to-orange-600" },
      { slug: "riddle",      name: "Riddle",       desc: "Puzzle in verse — the answer is hidden in the poem.",                examples: ["Exeter Book riddles"], color: "from-cyan-500 to-teal-500" },
      { slug: "ekphrasis",   name: "Ekphrasis",    desc: "Poetic description of a work of visual art.",                        examples: ["Ode on a Grecian Urn"], color: "from-fuchsia-500 to-purple-500" },
    ],
  },

  /* ── 2. PROSE ───────────────────────────────────────────────── */
  {
    slug: "prose",
    name: "Prose",
    icon: FaBook,
    desc: "Narrative writing — novels, stories, fables, and everything between.",
    genres: [
      { slug: "novel",        name: "Novel",         desc: "Long-form fiction — character, plot, and world across hundreds of pages.", examples: ["Pride and Prejudice", "Godaan"], color: "from-blue-500 to-indigo-500" },
      { slug: "novella",      name: "Novella",       desc: "Between a short story and a novel — focused, intense, complete.",          examples: ["The Metamorphosis", "Of Mice and Men"], color: "from-indigo-500 to-blue-600" },
      { slug: "short-story",  name: "Short Story",   desc: "Fiction under ~7,500 words — a single effect, a single moment.",           examples: ["The Lottery", "The Gift of the Magi"], color: "from-teal-500 to-cyan-500" },
      { slug: "flash-fiction",name: "Flash Fiction", desc: "Fiction under 1,000 words — a whole world in a page.",                     examples: ["Hemingway's six-word story"], color: "from-cyan-500 to-teal-600" },
      { slug: "fable",        name: "Fable",         desc: "Short story with animals and a moral.",                                    examples: ["Aesop's Fables", "Panchatantra"], color: "from-green-500 to-emerald-500" },
      { slug: "fairy-tale",   name: "Fairy Tale",    desc: "Magical folk narrative — kings, witches, and happily ever after.",         examples: ["Grimm's Tales", "Arabian Nights"], color: "from-pink-500 to-rose-500" },
      { slug: "myth",         name: "Myth",          desc: "Sacred narrative explaining the world — gods, heroes, origins.",           examples: ["Greek myths", "Puranas"], color: "from-amber-500 to-orange-500" },
      { slug: "legend",       name: "Legend",        desc: "Story with a grain of history — larger than life, but rooted.",            examples: ["King Arthur", "Robin Hood"], color: "from-yellow-500 to-amber-600" },
      { slug: "tall-tale",    name: "Tall Tale",     desc: "Exaggerated folk story — Paul Bunyan, Pecos Bill.",                        examples: ["Paul Bunyan", "Pecos Bill"], color: "from-orange-500 to-red-500" },
      { slug: "parable",      name: "Parable",       desc: "Short story teaching a moral lesson.",                                     examples: ["The Good Samaritan", "The Blind Men and the Elephant"], color: "from-lime-500 to-green-500" },
      { slug: "allegory",     name: "Allegory",      desc: "Narrative with two meanings — surface story, deeper truth.",               examples: ["Animal Farm", "The Pilgrim's Progress"], color: "from-purple-500 to-indigo-500" },
    ],
  },

  /* ── 3. ESSAY ───────────────────────────────────────────────── */
  {
    slug: "essay",
    name: "Essay",
    icon: FaPenNib,
    desc: "Short prose that argues, reflects, or observes — the foundation of literary criticism.",
    genres: [
      { slug: "personal-essay",   name: "Personal Essay",   desc: "First-person reflection — the writer's own life as subject.",       examples: ["Montaigne's Essays", "Orwell's 'Shooting an Elephant'"], color: "from-amber-500 to-yellow-500" },
      { slug: "critical-essay",   name: "Critical Essay",   desc: "Analysis and evaluation of a work of literature or art.",            examples: ["Eliot's 'Tradition and the Individual Talent'"], color: "from-rose-500 to-pink-500" },
      { slug: "argumentative",    name: "Argumentative Essay", desc: "Persuasive prose — claim, evidence, reasoning.",                   examples: ["Swift's 'A Modest Proposal'"], color: "from-red-500 to-rose-600" },
      { slug: "narrative-essay",  name: "Narrative Essay",  desc: "Essay that tells a story from the writer's life.",                  examples: ["Angelou's 'Graduation'"], color: "from-indigo-500 to-purple-500" },
      { slug: "expository-essay", name: "Expository Essay", desc: "Essay that explains or informs.",                                   examples: ["Encyclopedia entries", "Literary introductions"], color: "from-teal-500 to-cyan-500" },
      { slug: "compare-contrast", name: "Compare & Contrast", desc: "Essay that compares two subjects to illuminate both.",            examples: ["Comparative literature essays"], color: "from-blue-500 to-indigo-500" },
    ],
  },

  /* ── 4. NON-FICTION ─────────────────────────────────────────── */
  {
    slug: "non-fiction",
    name: "Non-Fiction",
    icon: FaBookReader,
    desc: "True stories, real lives, and the writing of memory.",
    genres: [
      { slug: "biography",    name: "Biography",       desc: "The life story of another person.",                                    examples: ["Boswell's Life of Johnson"], color: "from-amber-600 to-yellow-600" },
      { slug: "autobiography",name: "Autobiography",   desc: "The writer's own life, told by the writer.",                            examples: ["Gandhi's My Experiments with Truth"], color: "from-orange-500 to-amber-600" },
      { slug: "memoir",       name: "Memoir",          desc: "A slice of memory — a period, a theme, a relationship.",                examples: ["Elie Wiesel's Night", "Obama's Dreams from My Father"], color: "from-teal-500 to-emerald-500" },
      { slug: "diary",        name: "Diary / Journal", desc: "Day-by-day record of a life.",                                          examples: ["Anne Frank's Diary", "Pepys' Diary"], color: "from-slate-500 to-gray-600" },
      { slug: "travel",       name: "Travel Writing",  desc: "The journey as subject — places, people, encounters.",                  examples: ["Naipaul's An Area of Darkness", "Steinbeck's Travels with Charley"], color: "from-cyan-500 to-blue-500" },
      { slug: "criticism",    name: "Literary Criticism", desc: "Analysis and interpretation of literature.",                        examples: ["Coleridge's Biographia Literaria"], color: "from-purple-500 to-violet-500" },
      { slug: "philosophy",   name: "Philosophy",      desc: "Reasoned enquiry into existence, ethics, and knowledge.",               examples: ["Plato's Dialogues", "Seneca's Letters"], color: "from-indigo-500 to-blue-500" },
      { slug: "history",      name: "History",         desc: "Narrative of past events — the world as it was.",                       examples: ["Herodotus", "Gibbon's Decline and Fall"], color: "from-amber-700 to-orange-700" },
      { slug: "letters",      name: "Letters",         desc: "Correspondence as literature.",                                         examples: ["Rilke's Letters to a Young Poet"], color: "from-rose-500 to-pink-600" },
      { slug: "aphorism",     name: "Aphorism",        desc: "Short, pithy statements — wisdom condensed.",                           examples: ["Nietzsche's aphorisms", "La Rochefoucauld"], color: "from-fuchsia-500 to-purple-500" },
      { slug: "maxims",       name: "Maxims",          desc: "Rules of conduct — moral wisdom in brief.",                             examples: ["La Rochefoucauld's Maxims"], color: "from-violet-500 to-purple-600" },
      { slug: "sermon",       name: "Sermon",          desc: "Religious discourse — moral instruction from the pulpit.",              examples: ["Donne's Sermons", "Buddha's first sermon"], color: "from-amber-500 to-orange-500" },
    ],
  },

  /* ── 5. DRAMA ───────────────────────────────────────────────── */
  {
    slug: "drama",
    name: "Drama",
    icon: FaTheaterMasks,
    desc: "Literature meant for the stage — plays, opera, and the spoken word.",
    genres: [
      { slug: "tragedy",      name: "Tragedy",      desc: "Serious drama ending in catastrophe — the fall of a hero.",              examples: ["Hamlet", "Oedipus Rex"], color: "from-slate-600 to-gray-700" },
      { slug: "comedy",       name: "Comedy",       desc: "Drama that amuses — confusion, wit, and happy endings.",                  examples: ["A Midsummer Night's Dream", "The Importance of Being Earnest"], color: "from-yellow-500 to-amber-500" },
      { slug: "tragicomedy",  name: "Tragicomedy",  desc: "Serious and comic in one — the full range of human experience.",         examples: ["The Tempest", "Waiting for Godot"], color: "from-teal-500 to-cyan-500" },
      { slug: "farce",        name: "Farce",        desc: "Comedy of absurd situations and physical humour.",                       examples: ["Feydeau's farces"], color: "from-orange-500 to-red-500" },
      { slug: "melodrama",    name: "Melodrama",    desc: "Exaggerated emotion and clear heroes and villains.",                      examples: ["Victorian melodramas"], color: "from-pink-500 to-rose-500" },
      { slug: "masque",       name: "Masque",       desc: "Courtly drama with music, dance, and spectacle.",                        examples: ["Milton's Comus", "Jonson's masques"], color: "from-fuchsia-500 to-pink-600" },
      { slug: "opera",        name: "Opera",        desc: "Drama set to music.",                                                    examples: ["La Bohème", "The Magic Flute"], color: "from-purple-500 to-fuchsia-500" },
      { slug: "monologue",    name: "Monologue",    desc: "One voice speaking — the stage is the interior life.",                   examples: ["Hamlet's soliloquies"], color: "from-indigo-500 to-blue-500" },
      { slug: "dialogue",     name: "Dialogue",     desc: "Two voices in conversation — philosophy, drama, or both.",                examples: ["Plato's Dialogues", "Beckett's Endgame"], color: "from-cyan-500 to-teal-500" },
    ],
  },

  /* ── 6. FOLKLORE ────────────────────────────────────────────── */
  {
    slug: "folklore",
    name: "Folklore",
    icon: FaUsers,
    desc: "The poetry and prose of the people — songs, sayings, and stories passed down by voice.",
    genres: [
      { slug: "folk-song",     name: "Folk Song",      desc: "Traditional song passed down orally — work, love, harvest, lullaby.",  examples: ["Kajri", "Baul songs", "Alha"], color: "from-amber-500 to-orange-500" },
      { slug: "proverb",       name: "Proverb",        desc: "Short, traditional saying carrying wisdom or advice.",                examples: ["'A stitch in time…'", "Sanskrit subhashitas"], color: "from-teal-500 to-emerald-500" },
      { slug: "nursery-rhyme", name: "Nursery Rhyme",  desc: "Short rhyme for children — simple, musical, often cryptic.",           examples: ["'Humpty Dumpty'", "'Twinkle, Twinkle'"], color: "from-pink-500 to-rose-500" },
      { slug: "folk-riddle",   name: "Folk Riddle",    desc: "Traditional puzzle in verse — the answer is hidden.",                  examples: ["Exeter Book riddles"], color: "from-cyan-500 to-teal-600" },
      { slug: "folk-ballad",   name: "Folk Ballad",    desc: "Narrative song passed down by ear — love, betrayal, murder.",          examples: ["Barbara Allen", "Lord Randall"], color: "from-blue-500 to-indigo-600" },
    ],
  },

  /* ── 7. ORATORY ─────────────────────────────────────────────── */
  {
    slug: "oratory",
    name: "Oratory",
    icon: FaMicrophone,
    desc: "Literature meant to be spoken aloud — speeches, eulogies, and public language.",
    genres: [
      { slug: "speech",        name: "Speech",        desc: "Public address — argument, inspiration, or ceremony.",                 examples: ["'I Have a Dream'", "Lincoln's Gettysburg Address"], color: "from-amber-600 to-orange-600" },
      { slug: "eulogy",        name: "Eulogy",        desc: "A speech of praise — most often for the dead.",                        examples: ["Pericles' Funeral Oration"], color: "from-slate-600 to-gray-700" },
      { slug: "debate",        name: "Debate",        desc: "Structured argument — two or more voices in formal opposition.",       examples: ["Lincoln–Douglas debates"], color: "from-indigo-500 to-blue-500" },
    ],
  },
];

/* ══════════════════════════════════════════════════════════════════
 *  PAGE
 * ══════════════════════════════════════════════════════════════════ */

export default function GenresPage() {
  const [activeCategory, setActiveCategory] = useState("poetry");
  const [search, setSearch] = useState("");

  const totalGenres = CATEGORIES.reduce((n, c) => n + c.genres.length, 0);

  const activeCat = CATEGORIES.find((c) => c.slug === activeCategory);

  const filteredGenres = useMemo(() => {
    if (!activeCat) return [];
    let list = activeCat.genres;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (g) =>
          g.slug.includes(q) ||
          g.name.toLowerCase().includes(q) ||
          g.desc.toLowerCase().includes(q),
      );
    }
    return list;
  }, [activeCat, search]);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-900/50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-2">
            <FaTheaterMasks className="text-4xl text-amber-600 dark:text-amber-400" />
            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-amber-600 to-yellow-500 bg-clip-text text-transparent">
              Literary Genres
            </h1>
            <span className="text-sm text-gray-400 self-end mb-2">
              ({totalGenres} forms across {CATEGORIES.length} categories)
            </span>
          </div>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl ml-1">
            Poetry, prose, essays, drama, folklore, and oratory — the full landscape of literature.
          </p>
        </div>

        {/* Category tabs */}
        <div className="mb-8 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => {
            const Icon = c.icon;
            const active = activeCategory === c.slug;
            return (
              <button
                key={c.slug}
                onClick={() => { setActiveCategory(c.slug); setSearch(""); }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border transition ${
                  active
                    ? "bg-amber-600 text-white border-amber-600"
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-amber-200 dark:border-amber-900/40 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                }`}
              >
                <Icon size={14} />
                {c.name}
                <span className={`text-xs ${active ? "text-white/70" : "text-gray-400"}`}>
                  {c.genres.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Category description + search */}
        {activeCat && (
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {activeCat.desc}
            </p>
            <div className="relative max-w-md w-full sm:w-auto">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={`Search ${activeCat.name.toLowerCase()}…`}
                className="w-full pl-10 pr-4 py-2 rounded-full border border-amber-200 dark:border-amber-900/40 bg-white dark:bg-gray-800 text-sm text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
        )}

        {/* Genre grid */}
        {filteredGenres.length === 0 ? (
          <div className="text-center py-16">
            <FaBookOpen className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">
              No genres match your search.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredGenres.map((g) => (
              <Link
                key={g.slug}
                href={`/genres/${g.slug}`}
                className="group relative overflow-hidden p-6 rounded-2xl border border-amber-200 dark:border-amber-900/30 bg-white dark:bg-gray-800 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
              >
                <div
                  className={`absolute top-0 left-0 h-1 w-0 group-hover:w-full bg-gradient-to-r ${g.color} transition-all duration-300`}
                />

                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {g.name}
                </h2>

                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                  {g.desc}
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {g.examples.slice(0, 3).map((ex) => (
                    <span
                      key={ex}
                      className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300"
                    >
                      {ex}
                    </span>
                  ))}
                </div>

                <span className="mt-4 inline-block text-xs font-medium text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
                  Explore →
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}