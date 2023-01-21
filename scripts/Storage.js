//lucram cu localStorage


class Storage{

    static testStorage(){
        console.log('storage');
    
    }

    static getBooks(){
        let books;
        if(localStorage.getItem('books') === null){//daca nu exista in local storage item-ul cu numele books
            books = [];//il creem
        }else{
            books = JSON.parse(localStorage.getItem('books'));
        }
        return books;
    }

    static addBook(book){
        let books = Storage.getBooks();
        books.push(book);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static deleteBook(isbn){
        let books = Storage.getBooks();
        books.forEach((book, index) => {
            if(book.isbn == isbn){
                books.splice(index,1);
            }
        });

        console.log(books);
        localStorage.setItem('books', JSON.stringify(books));
    }

    static editBook(bookEdited){
        console.log('edit Book storage');
        let books = Storage.getBooks();
        books.forEach((book, index) => {
            if(book.isbn == bookEdited.isbn){
                books.splice(index, 1, bookEdited);
                console.log(book);
            }
        });

        console.log(books);
        localStorage.setItem('books', JSON.stringify(books));
    }

    

    static exportBooksJson(books){
        let dataStr = JSON.stringify(books);
        let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

        return dataUri;
    }

    static download(fileName, books){
        let anchor = document.createElement('a');
        anchor.setAttribute('href', Storage.exportBooksJson(books));
        anchor.setAttribute('download', fileName);
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);

    }
}