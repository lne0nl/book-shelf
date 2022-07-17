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
