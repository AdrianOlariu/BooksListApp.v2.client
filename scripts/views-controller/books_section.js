//book class: represents a book -> everytime we create a book it will instantiate a book object

//ui class: Handles the UI Tasks

//store class: handles Storage - localSotrage withing the browser

//Events: Display Books, Add a Book, Remove a Book
let books;

const btnImport = document.querySelector('#btnImport');
btnImport.addEventListener('click', (event) =>{
    event.preventDefault();

    var reader = new FileReader();
    var fileToRead = document.querySelector('#fileChosen').files[0];

    if(!fileToRead){
        UI.showAlert('Please chose a compatible JSON File to populate the list or call the book list from DB', 'warning');
    }else if(fileToRead){
        // attach event, that will be fired, when read is end
        reader.addEventListener("loadend", function() {
        // reader.result contains the contents of blob as a typed array
        // we insert content of file in DOM here
        
            UI.importBooks(reader.result);
            console.log(reader.result);
        });
        // start reading a loaded file
        reader.readAsText(fileToRead);
    }
});

const btnBookList = document.querySelector('#btnBookList');
btnBookList.addEventListener('click', async (e) =>{

    e.preventDefault();
    console.log("book list");
    books = await apiConnection.books('','GET').then(result => result);
    console.log(books);
    UI.importBooks(JSON.stringify(books));
})


const btnExport = document.querySelector('#btnExport');
btnExport.addEventListener( 'click' , (e) =>{
    e.preventDefault();
    var retVal = prompt("Name of the exported list: ");
    if(!(retVal === null)){
        Storage.download(`${retVal}.json`, Storage.getBooks());
    }
})

const btnAddBook = document.querySelector('#btnAddBook');
btnAddBook.addEventListener('click', async (e)=>{
    e.preventDefault();
    
    const title = document.querySelector('#title').value;
    const author = document.querySelector('#author').value;
    const isbn = document.querySelector('#isbn').value;
    console.log(Storage.testJson);
    if(title === '' || author === '' || isbn === ''){
        UI.showAlert('Please fill in all the details', 'warning');
    }else{
        let book = new Book(title, author, '', isbn);
        Storage.addBook(book);
        UI.showAlert('Book added', 'success');
        console.log(book);
        UI.addBookToList(book);
        UI.clearFields();
    }
});


document.querySelector('#book-list').addEventListener('click', (e) =>{
    console.log(e.target);

    if(e.target.classList.contains('btn-delete')){
        // console.log('delete');
        UI.deleteBook(e.target);
    }
    
    if(e.target.classList.contains('btn-yes')){
        Storage.deleteBook(e.target.parentElement.previousElementSibling.textContent);
        UI.confirmDelete(e.target);
    }

    if(e.target.classList.contains('btn-edit')){
        // console.log('edit');
        if(!UI.flagEdit){
            UI.editBook(e.target);
        }
    }

    if(e.target.classList.contains('btn-cancel') || e.target.classList.contains('btn-no')){
        // console.log('cancel');
        UI.cancelEdit(e.target);
    }

    if(e.target.classList.contains('btn-save')){
        // console.log('cancel');
        UI.saveEdit(e.target);
    }
    
    // console.log('target',e.target.parentElement.previousElementSibling.textContent);
});

Storage.testStorage();

//Initial as fi adaugat la buton-ul de delete un id care sa contina ISBN-ul cartii. Dar in acelasi timp acele butoane sunt dependente de acel id. E mai
//blana metoda aceasta de mai jos.

//am adaugat un event listener pe fiecare celula a tabelului. oriunde dam click, ne intoarce ceea ce e acolo.
//foarte important este acel e - event si prin urmare e.target - ce ne returneaza ceea ce a fost apasat.

//targetam un element din lista practic si returnam ce a fost targetat cu e -> e.target.
// document.querySelector('#book-list').addEventListener('click', (e) => {
//     console.log(e.target);
//     if(e.target.classList.contains('btn-delete')){
//         e.target.parentNode.parentNode.remove();
//     }
// })