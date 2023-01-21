console.log("book app");

// const inputFields = document.querySelector('#inputFields');
// const confirmPassword = document.createElement('div');
// const emailAddress = document.createElement('div');
// const btnLogIn = document.querySelector('#btnLogIn');
// const btnSignUp = document.querySelector('#btnSignUp');
let role = '', token = '', username = '';

btnSignUp.addEventListener('click', async (err)=>{
    UI.signUpForm();
    const btnRegister = document.querySelector('#btnRegister');
    btnRegister.addEventListener('click', async (e) =>{

        e.preventDefault();
        console.log("register");
        registerStatus = await API.register().then(result => result);
        console.log(registerStatus.success);
        if(registerStatus.success){
            UI.showAlert(registerStatus.success,'success');
        }else{
            UI.showAlert('user has not been created','danger');
        }
        UI.logInForm();
    })
})
//book class: represents a book -> everytime we create a book it will instantiate a book object

//ui class: Handles the UI Tasks

//store class: handles Storage - localSotrage withing the browser

//Events: Display Books, Add a Book, Remove a Book
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

let loggedIn = false;

const booksContainer = document.querySelector('#booksListContainer');
const authorisationContainer = document.querySelector('#authorisationContainer');
const infoContainer = document.querySelector('#infoContainer');
const usernamePlaceholder = document.querySelector('#usernamePlaceholder');
const rolePlaceholder = document.querySelector('#rolePlaceholder');
// booksContainer.parentNode.removeChild(booksContainer);
const btnLogOut = document.querySelector('#btnLogOut');



btnLogOut.addEventListener('click', async (e)=>{
    e.preventDefault();
    console.log('logOut');
    await apiConnection.logOut();
})

let loggedInInfos = '';
let apiConnection = new API('');
let myCookie = new Cookie();
console.log(myCookie);
UI.loggedIn(myCookie.getCookie());
if(document.cookie){
    //https://stackoverflow.com/questions/62323246/how-to-stay-logged-in-after-the-browser-is-closed-using-javascript
    //folosim metoda split pentru a taia string-ul continut in document.cookie
    //https://linuxhint.com/cut-string-after-specific-character-in-javascript/#:~:text=There%20is%20another%20JavaScript%20method%20for%20cutting%20a,the%20character%20and%20the%20other%20after%20the%20character.
    username = document.cookie.split(';')[0].split('=')[1];
    console.log('#username:',username);
    token = document.cookie.split(';')[1].split('=')[1];
    console.log('#token:',token);
    role = document.cookie.split(';')[2].split('=')[1];
    apiConnection.setBearer(token);    
    usernamePlaceholder.innerHTML = username;
    rolePlaceholder.innerHTML = `[${role.toUpperCase()}]`;
}



btnLogIn.addEventListener('click', async (e) =>{
    e.preventDefault();
    const username = document.querySelector('#user').value;
    if(!username || !document.querySelector('#pass').value){
        UI.showAlert('Insert Username and Password', 'warning');
        console.log('insert correct value');
    }else{
        console.log("log in");
        loggedInInfos = await API.logIn().then(result => {
            myCookie.setCookie('username',username,1);
        myCookie.setCookie('token',result.accessToken,1);
        myCookie.setCookie('role',result.role,1);
        // usernamePlaceholder.innerHTML = username;
    rolePlaceholder.innerHTML = `[${result.role.toUpperCase()}]`;
            return result});
            console.log(loggedInInfos)
        console.log(loggedInInfos.accessToken)
        UI.loggedIn(loggedInInfos.accessToken, myCookie.getCookie());
        apiConnection.setBearer(loggedInInfos.accessToken);
        console.log('bearer',apiConnection.getBearer());
        
        usernamePlaceholder.innerHTML = username;
        console.log(username);
        myCookie.setCookie('username',username,1);
        myCookie.setCookie('token',loggedInInfos.accessToken,1);
        myCookie.setCookie('role',loggedInInfos.role,1);
        UI.showAlert(`Welcome, ${username}`,'info');
    }

    // authorisationContainer.remove();
})

console.log('cookie',document.cookie);




let books;

const btnBookList = document.querySelector('#btnBookList');
btnBookList.addEventListener('click', async (e) =>{

    e.preventDefault();
    console.log("book list");
    books = await apiConnection.books('','GET').then(result => result);
    console.log(books);
    UI.importBooks(JSON.stringify(books));
})


const btnExport = document.querySelector('#btnExport');

let testJson = [
    {   
        author:'James Rollins',
        title:'eye of god',
        year: '2009'
    },
    {
        author:'Michael Ondaantje',
        title:'the English Patient',
        year: 1995
    }
]

btnExport.addEventListener( 'click' , (e) =>{
    e.preventDefault();
    var retVal = prompt("Name of the exported list: ");
    if(!(retVal === null)){
        Storage.download(`${retVal}.json`, Storage.getBooks());
    }
})


document.addEventListener('DOMContentLoaded',
UI.displayBooks());

const btnAddBook = document.querySelector('#btnAddBook');

async function refreshToken(){
    console.log('refresh token');
    await apiConnection.refreshToken().then(res => {if(res.newAccessToken){
        apiConnection.setBearer(res.newAccessToken)
    }else{
        return new Error("couldn't refresh the token");
    }
    });
}

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


document.querySelector('#book-list').addEventListener('click', e =>{
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