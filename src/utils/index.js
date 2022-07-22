export const getBooksList = (allBooks) => {
  const authors = [];
  const bookList = [];

  allBooks.forEach((book) => {
    if (!authors.includes(book.author)) {
      authors.push(book.author);
    }
  });

  authors.forEach((author) => {
    bookList.push({
      author,
      books: allBooks.filter((book) => book.author === author),
    });
  });

  return bookList;
};

export const getCollections = (books) => {
  const collections = [];
  const bookList = [];

  books.forEach((book) => {
    if (book.set && !collections.includes(book.set)) {
      collections.push(book.set);
    }
  });

  collections.forEach((collection) => {
    bookList.push({
      collection,
      books: books.filter((book) => book.set === collection),
    });
  });

  return bookList;
};
