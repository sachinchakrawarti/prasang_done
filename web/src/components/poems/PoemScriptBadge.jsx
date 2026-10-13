'use client';

const SCRIPT_LABELS = {
  Devanagari: 'देवनागरी',
  Arabic:     'اردو',
  Latin:      'Latin',
  Bengali:    'বাংলা',
  Tamil:      'தமிழ்',
  Telugu:     'తెలుగు',
  Gurmukhi:   'ਗੁਰਮੁਖੀ',
};

const SCRIPT_DIR = {
  Arabic: 'rtl',
  Urdu:   'rtl',
};

export default function PoemScriptBadge({ language, script, className = '' }) {
  if (!script) return null;

  const label = SCRIPT_LABELS[script] ?? script;
  const dir   = SCRIPT_DIR[script] ?? 'ltr';

  return (
    <span
      dir={dir}
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 ${className}`}
      title={`${language?.toUpperCase() ?? ''} · ${script}`}
    >
      {language?.toUpperCase() ?? '?'}
      <span className="opacity-40">·</span>
      {label}
    </span>
  );
}