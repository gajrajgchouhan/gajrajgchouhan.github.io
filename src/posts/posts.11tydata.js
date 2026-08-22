export default {
  layout: "layouts/post.njk",
  permalink: (data) => `/${data.slug || data.page.fileSlug}/`,
  tags: ["post"],
};
