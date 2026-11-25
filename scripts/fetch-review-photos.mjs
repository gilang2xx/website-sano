// Ambil foto profil penulis ulasan Google (Places API New) SEKALI saat build.
// Hasil: components/landing/reviewPhotos.generated.json (tidak di-commit).
// Tanpa GOOGLE_PLACES_API_KEY atau bila API gagal: file berisi {} dan halaman memakai avatar huruf. Build TIDAK pernah gagal karena ini.
// ponytail: Google hanya mengirim 5 ulasan pilihannya; yang tidak ada di sana tetap avatar huruf.
import fs from 'node:fs';
import path from 'node:path';

const OUT = path.resolve('components/landing/reviewPhotos.generated.json');
const PLACE_ID = 'ChIJ7-mbvxTpaS4RgpfuLhyotyA'; // KLINIK MATRAS by SANO CARE, Depok

function readKey() {
  if (process.env.GOOGLE_PLACES_API_KEY) return process.env.GOOGLE_PLACES_API_KEY.trim();
  try {
    const m = fs.readFileSync('.env.local', 'utf8').match(/^GOOGLE_PLACES_API_KEY=(.+)$/m);
    return m ? m[1].trim().replace(/^["']|["']$/g, '') : '';
  } catch { return ''; }
}

const write = (obj, note) => { fs.writeFileSync(OUT, JSON.stringify(obj, null, 2) + '\n'); console.log(`[review-photos] ${note}`); };

// Hanya penulis yang memang ditampilkan di landing (nama di landingData.ts); foto orang lain tidak ikut ke bundle.
const USED = new Set([...fs.readFileSync('components/landing/landingData.ts', 'utf8').matchAll(/name: "([^"]+)"/g)].map((m) => m[1].trim()));

const key = readKey();
if (!key) write({}, 'tanpa GOOGLE_PLACES_API_KEY: avatar huruf dipakai');
else {
  try {
    const r = await fetch(`https://places.googleapis.com/v1/places/${PLACE_ID}?languageCode=id`, {
      headers: { 'X-Goog-Api-Key': key, 'X-Goog-FieldMask': 'reviews' },
      signal: AbortSignal.timeout(10000),
    });
    const d = await r.json();
    if (d.error) throw new Error(`${d.error.status}`);
    const out = {};
    for (const rv of d.reviews || []) {
      const a = rv.authorAttribution || {};
      if (a.displayName && a.photoUri && USED.has(a.displayName.trim())) out[a.displayName.trim()] = { photo: a.photoUri, uri: a.uri || '' };
    }
    write(out, `${Object.keys(out).length} foto penulis dari Places API`);
  } catch (e) {
    write({}, `Places API gagal (${e.message}): avatar huruf dipakai`);
  }
}
