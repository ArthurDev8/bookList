class Book {
  constructor(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;

  }
}
class UI {
  static displayBooks() {
    const books = Store.getBooks();
    if (books) {
      books.forEach((book) => {
        UI.addBookToList(book)
      })
    }
  }
  static addBookToList(book) {
    const list = document.querySelector('#book-list');
    const row = document.createElement('tr');

    row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.isbn}</td>
    <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
    `;
    list.appendChild(row)
  }
  static clearFields() {
    document.querySelector('#title').value = '';
    document.querySelector('#author').value = "";
    document.querySelector('#isbn').value = "";
  }
  static removeBookFromList(book) {
    if (book.classList.contains('delete')) {
      book.parentElement.parentElement.remove()
    }
  }
  static showAlert(message, classname) {
    let form = document.querySelector('#book-form');
    let fieldAlert = document.createElement('div');
    fieldAlert.classList = `alert alert-${classname}`;
    fieldAlert.textContent = `${message}`;
    form.insertAdjacentElement('afterBegin', fieldAlert);

    setTimeout(() => {
      form.firstChild.remove()
    }, 2000)
  }
}
class Store {
  static getBooks() {
    let books;
    if (localStorage.getItem('books') == null) {
      books = []
    } else books = JSON.parse(localStorage.getItem('books'))

    return books;
  }
  static addBook(book) {
    const books = Store.getBooks();
    books.push(book);
    localStorage.setItem('books', JSON.stringify(books))
  }
  static removeBook(isbn) {
    const books = Store.getBooks();
    books.forEach((book, index) => {
      if (book.isbn === isbn.parentNode.parentNode.childNodes[5].textContent) {
        books.splice(index, 1)
      }
    })
    localStorage.setItem('books', JSON.stringify(books))
    return books
  }
}
document.addEventListener('DOMContentLoaded', UI.displayBooks);

document.querySelector('#book-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.querySelector('#title').value;
  const author = document.querySelector('#author').value;
  const isbn = document.querySelector('#isbn').value;
  if (title == '' || author == '' || isbn == "") {
    UI.showAlert('Empty field/s', 'danger')
    return;
  }
  const newBook = new Book(title, author, isbn);
  UI.addBookToList(newBook);
  Store.addBook(newBook)
  UI.showAlert('Book addded', 'success')
  UI.clearFields();
});
document.querySelector('#book-list').addEventListener('click', (e) => {
  e.preventDefault();
  UI.removeBookFromList(e.target);
  Store.removeBook(e.target)
  UI.showAlert('Book removed', 'success')
});