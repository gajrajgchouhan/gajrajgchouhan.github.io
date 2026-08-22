export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "src/style.css": "style.css" });
  eleventyConfig.addPassthroughCopy({ "src/images": "images" });
  eleventyConfig.addPassthroughCopy({ "src/CNAME": "CNAME" });

  const parseCollections = (raw) =>
    (raw || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .map((name) => ({ name, slug: slugify(name) }));

  const slugify = (s) =>
    s
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

  eleventyConfig.addFilter("slug", slugify);
  eleventyConfig.addFilter("limit", (arr, n) => (arr || []).slice(0, n));
  eleventyConfig.addFilter("dateISO", (d) => new Date(d).toISOString());
  eleventyConfig.addFilter("dateReadable", (d) =>
    new Date(d).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  );

  const published = (p) => (p.data.status || "published") === "published";
  const unlisted = (p) => p.data.status === "unlisted";
  const listed = (p) => published(p);
  const buildable = (p) => published(p) || unlisted(p);

  eleventyConfig.addCollection("posts", (api) =>
    api
      .getFilteredByGlob("src/posts/*.md")
      .filter(buildable)
      .sort((a, b) => b.date - a.date)
  );

  eleventyConfig.addCollection("listedPosts", (api) =>
    api
      .getFilteredByGlob("src/posts/*.md")
      .filter(listed)
      .sort((a, b) => b.date - a.date)
  );

  eleventyConfig.addCollection("postsByYear", (api) => {
    const posts = api
      .getFilteredByGlob("src/posts/*.md")
      .filter(listed)
      .sort((a, b) => b.date - a.date);
    const byYear = new Map();
    for (const p of posts) {
      const year = new Date(p.date).getFullYear();
      if (!byYear.has(year)) byYear.set(year, []);
      byYear.get(year).push(p);
    }
    return [...byYear.entries()]
      .sort((a, b) => b[0] - a[0])
      .map(([year, posts]) => ({ year, posts }));
  });

  eleventyConfig.addCollection("siteCollections", (api) => {
    const posts = api
      .getFilteredByGlob("src/posts/*.md")
      .filter(listed);
    const map = new Map();
    for (const p of posts) {
      for (const c of parseCollections(p.data.series)) {
        if (!map.has(c.slug))
          map.set(c.slug, { name: c.name, slug: c.slug, posts: [] });
        map.get(c.slug).posts.push(p);
      }
    }
    for (const c of map.values())
      c.posts.sort((a, b) => b.date - a.date);
    return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
  });

  eleventyConfig.addFilter("postCollections", (raw) => parseCollections(raw));

  return {
    dir: {
      input: "src",
      includes: "_includes",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    htmlTemplateEngine: "njk",
  };
}
