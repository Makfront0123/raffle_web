export function paginate<T>(items: T[], page: number, perPage: number) {
  const totalPages = Math.ceil(items.length / perPage);
  const start = (page - 1) * perPage;

  return {
    totalPages,
    currentItems: items.slice(start, start + perPage),
  };
}
