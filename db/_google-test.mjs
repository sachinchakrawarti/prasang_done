// db/_google-test.mjs
const text = 'रश्मिरथी';
const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=hi&tl=ur&dt=t&q=${encodeURIComponent(text)}`;
console.log('URL:', url);

try {
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    },
  });
  console.log('status:', res.status, res.statusText);
  const body = await res.text();
  console.log('body (first 400):');
  console.log(body.slice(0, 400));
} catch (e) {
  console.error('threw:', e.message);
}