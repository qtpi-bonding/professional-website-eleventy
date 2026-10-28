const fs = require("fs");
const path = require("path");
const matter = require("gray-matter");

// Projects exported from worksbase (src/_data/projects.json). Each entry is keyed by id,
// which is the filename slug of the hand-written src/content/work/<id>.md. Generated
// fields override the front matter; the md keeps tags, featured, media, youtube and prose.
function loadProjects() {
  try {
    const raw = fs.readFileSync(path.join(__dirname, "../../_data/projects.json"), "utf8");
    return new Map(JSON.parse(raw).map(project => [project.id, project]));
  } catch (error) {
    return new Map();
  }
}

const projects = loadProjects();
const entry = data => projects.get(data.page.fileSlug);

// A computed key cannot read its own front matter value, so the file's front matter is read
// directly as the fallback for items without a generated entry (publications).
const frontMatterCache = new Map();
const frontMatter = data => {
  const file = path.resolve(data.page.inputPath);
  if (!frontMatterCache.has(file)) {
    frontMatterCache.set(file, matter.read(file).data);
  }
  return frontMatterCache.get(file);
};

const generated = field => data => {
  const project = entry(data);
  return project && project[field] !== undefined ? project[field] : frontMatter(data)[field];
};

module.exports = {
  eleventyComputed: {
    title: generated("title"),
    description: generated("description"),
    type: generated("type"),
    technologies: generated("technologies"),
    year: generated("year"),
    started: generated("started"),
    stage: generated("stage"),
    techColors: generated("techColors"),
    status: generated("status"),
    links: generated("links"),
    bullets: generated("bullets"),
    overview: generated("overview"),
    highlights: generated("highlights"),
    media: generated("media"),
    hasPage: data => Boolean(entry(data)),
    layout: data => (entry(data) ? "layouts/work-page.njk" : frontMatter(data).layout),
    permalink: data => (entry(data) ? `/work/${data.page.fileSlug}/` : frontMatter(data).permalink)
  }
};
