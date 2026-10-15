// Scans public/videos/work/ and writes src/data/portfolio.json.
//
//   public/videos/work/short-form/<slug>.mp4      -> "Short-form edits" tab
//   public/videos/work/ads/<slug>.mp4             -> "Ad videos" tab
//   public/videos/work/before-after/pair-N/{raw,edit}.mp4 -> Before/After (hidden until pairs exist)
//
// Each video lives in exactly one folder, so it appears in exactly one category.
// A poster (<= 80 KB JPEG) is generated for every video that doesn't have one yet.
// Import web-optimized MP4s; keep originals outside public/.
import fs from "fs";
import path from "path";
import { execFileSync } from "child_process";
import { fileURLToPath } from "url";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(rootDir, "public");
const workDir = path.join(publicDir, "videos", "work");
const postersDir = path.join(publicDir, "posters", "work");
const outPath = path.join(rootDir, "src", "data", "portfolio.json");
const MAX_POSTER_BYTES = 80 * 1024;
const previous = fs.existsSync(outPath) ? JSON.parse(fs.readFileSync(outPath, "utf8")) : {};

// Keep hand-curated captions, durations and ordering when media is rescanned.
function preserveMetadata(items, type) {
  const existing = previous[type] || [];
  const byId = new Map(existing.map((item) => [item.id, item]));
  const order = new Map(existing.map((item, index) => [item.id, index]));
  return items.map((item) => ({ ...byId.get(item.id), ...item, caption: byId.get(item.id)?.caption || item.caption }))
    .sort((a, b) => (order.get(a.id) ?? Infinity) - (order.get(b.id) ?? Infinity));
}

fs.mkdirSync(postersDir, { recursive: true });

function makePoster(videoPath, posterPath) {
  if (fs.existsSync(posterPath) && fs.statSync(posterPath).size > 0) return;
  // Walk quality down until the poster fits the size budget
  for (const q of [4, 6, 8, 10, 13, 16]) {
    try {
      execFileSync(
        "ffmpeg",
        ["-v", "error", "-y", "-ss", "1", "-i", videoPath, "-frames:v", "1",
          "-vf", "scale='min(540,iw)':-2", "-q:v", String(q), posterPath],
        { stdio: "ignore" }
      );
    } catch {
      return;
    }
    if (fs.statSync(posterPath).size <= MAX_POSTER_BYTES) return;
  }
}

function scanCategory(folder, type) {
  const dir = path.join(workDir, folder);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".mp4"))
    .sort()
    .map((file) => {
      const slug = path.basename(file, ".mp4");
      const poster = path.join(postersDir, `${slug}.jpg`);
      makePoster(path.join(dir, file), poster);
      return {
        id: `${type}-${slug}`,
        type,
        videoUrl: `/videos/work/${folder}/${file}`,
        posterUrl: `/posters/work/${slug}.jpg`,
        caption: "",
      };
    });
}

function scanBeforeAfter() {
  const dir = path.join(workDir, "before-after");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .filter((e) =>
      ["raw.mp4", "edit.mp4"].every((f) => fs.existsSync(path.join(dir, e.name, f)))
    )
    .map((e) => {
      const poster = path.join(postersDir, `${e.name}.jpg`);
      makePoster(path.join(dir, e.name, "edit.mp4"), poster);
      return {
        id: `before-after-${e.name}`,
        type: "beforeAfter",
        rawVideoUrl: `/videos/work/before-after/${e.name}/raw.mp4`,
        videoUrl: `/videos/work/before-after/${e.name}/edit.mp4`,
        posterUrl: `/posters/work/${e.name}.jpg`,
        caption: "",
      };
    });
}

const shortForm = preserveMetadata(scanCategory("short-form", "shortForm"), "shortForm");
const ads = preserveMetadata(scanCategory("ads", "ads"), "ads");
const beforeAfter = preserveMetadata(scanBeforeAfter(), "beforeAfter");
// YouTube entries are editorial links and cannot be rediscovered from local MP4s.
const longForm = previous.longForm || [];

fs.writeFileSync(outPath, JSON.stringify({ shortForm, longForm, ads, beforeAfter }, null, 2) + "\n");

console.log(
  `portfolio.json: ${shortForm.length} short-form, ${ads.length} ads, ${beforeAfter.length} before/after pairs`
);
for (const item of [...shortForm, ...ads, ...beforeAfter]) {
  const size = fs.statSync(path.join(publicDir, item.posterUrl)).size;
  if (size > MAX_POSTER_BYTES) console.warn(`  poster over 80 KB: ${item.posterUrl} (${size} bytes)`);
}
