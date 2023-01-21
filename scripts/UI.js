class UI{
    static confirmPassword = document.createElement('div');
    static emailAddress = document.createElement('div');
    static phoneNumber = document.createElement('div');
    static desiredActivationMethod = document.createElement('div');
    static registerButton = document.createElement('div');
    static inputFields = document.querySelector('#inputFields');
    static btnLogIn = document.querySelector('#btnLogIn');
    static btnSignUp = document.querySelector('#btnSignUp');
    static inputFieldsButtons = document.querySelector('#inputFieldsButtons');
    static flagEdit = false;
    static holdBook = new Book('','','');

    static button(type){
        const button = document.createElement('button');
        button.setAttribute('type','button');
        button.classList.add('btn');
        button.classList.add('btn-primary');
        button.classList.add('btn-sm');
        button.classList.add(`btn-${type.toLowerCase()}`);
        button.innerHTML = `${type}`;
        return button;
    }

    static displayBooks(){
        let books = Storage.getBooks();

        books.forEach(book => 
            UI.addBookToList(book)
        );
    }

    static importBooks(importedBooks){
        let books = JSON.parse(importedBooks);
        let isbns = Storage.getBooks().map(book => book.isbn);
        console.log('existing books',isbns);
        books.forEach(book => {
            if(!(isbns.indexOf(book.isbn) !== -1)){
                UI.addBookToList(book);
                Storage.addBook(book);
            }
        }
        );
    }

    static addBookToList(book){
        const tbodyElemenet = document.querySelector('#book-list');
        const trowElement = document.createElement('tr');
        trowElement.innerHTML = 
        `
            <tr>
                <td>${book.title}</td>
                <td>${book.author}</td>
                <td>${book.status}</td>
                <td>${book.isbn}</td>
                <td class="text-center">
                    <button type="button" class="btn btn-primary btn-sm btn-delete">Delete
                    </button><button class="btn btn-primary btn-sm btn-edit">Edit</button>
                </td>
            </tr>
        `;

        tbodyElemenet.appendChild(trowElement);
    }

    static clearFields(){
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#isbn').value = '';
    }

    static deleteBook(element){
        if(element.classList.contains('btn-delete')){
            let children = element.parentNode.parentNode.children;
            UI.holdBook.title = children[0].textContent;
            UI.holdBook.isbn = children[3].textContent;
            UI.holdBook.status = children[2].textContent;
            UI.holdBook.author = children[1].textContent;
            children[children.length - 1].textContent = 'Delete entry?';
            children[children.length - 1].appendChild(UI.button('Yes'));
            children[children.length - 1].appendChild(UI.button('No'));
        }
    }

    static deleteUser(element){
        
    }

    static confirmDelete(element){
            element.parentNode.parentNode.remove();
    }


    static cancelEdit(element, book){
        console.log('call cancel');

        let children = element.parentNode.parentNode.children;
        console.log(children);
        for(let i = 0; i <= children.length - 2; i++){
            children[i].setAttribute('contenteditable','false');
            children[i].classList.remove('td-edit');
            children[children.length - 1].textContent = '';
            children[children.length - 1].appendChild(UI.button('Delete'));
            children[children.length - 1].appendChild(UI.button('Edit'));
            console.log('works',children[children.length - 1]);

            children[0].textContent = UI.holdBook.title;
            children[2].textContent = UI.holdBook.status;
            children[3].textContent = UI.holdBook.isbn;
            children[1].textContent = UI.holdBook.author;
        }

        UI.flagEdit = false;
    }

    static saveEdit(element){
        console.log("save edit");
        console.log(element.parentNode.parentNode);

        let children = element.parentNode.parentNode.children;

        UI.holdBook.title = children[0].textContent;
        UI.holdBook.isbn = children[3].textContent;
                UI.holdBook.status = children[2].textContent;
                UI.holdBook.author = children[1].textContent;

        console.log('save edit', UI.holdBook);

        Storage.editBook(UI.holdBook);

        UI.cancelEdit(element);
    }
    
    static editBook(element){
        UI.flagEdit = true;
        if(element.classList.contains('btn-edit')){
            let children = element.parentNode.parentNode.children;
            let values = [];
            for(let i = 0; i <= children.length - 3; i++){
                children[i].setAttribute('contenteditable','true');
                children[i].classList.add('td-edit');
                children[children.length - 1].textContent = '';
                children[children.length - 1].appendChild(UI.button('Save'));
                children[children.length - 1].appendChild(UI.button('Cancel'));
                console.log(children[children.length - 1]);
                UI.holdBook.title = children[0].textContent;
                UI.holdBook.isbn = children[3].textContent;
                UI.holdBook.status = children[2].textContent;
                UI.holdBook.author = children[1].textContent;
                console.log(UI.holdBook);
            }

            console.log(values);
            // element.parentNode.previousElementSibling.previousElementSibling.setAttribute('contenteditable','true');
            // element.parentNode.previousElementSibling.previousElementSibling.previousElementSibling.setAttribute('contenteditable','true');
        }
    }

    static showAlert(message, type, duration){
        //creem un div, dinamic
        const divElement = document.createElement('div');
        //adaugam clasele la acel div, dinamic
        divElement.className = `alert alert-${type}`;
        //creem un node de tip text
        const textMessage = document.createTextNode(message);
        //append-uim acel node la elementul div creat
        divElement.appendChild(textMessage);

        //selectam unde vom pune div-ul
        const header = document.querySelector('#header');
        const form = document.querySelector('#book-form');
        //in container inseram div-ul inainte de form 
        
        header.append(divElement);

        setTimeout(() => {
            header.removeChild(divElement);
        }, duration ? duration : 2000)
    }

    static loggedIn(cookie){
        if(!cookie){
            // btnRegister.classList.add('hideContainer');
            infoContainer.classList.add('hideContainer');
            books_section.classList.add('hideContainer');
            authorisationContainer.classList.remove('hideContainer');
        }else{
            infoContainer.classList.remove('hideContainer');
            books_section.classList.remove('hideContainer');
            authorisationContainer.classList.add('hideContainer');

        }
    }

    

    static signUpForm(){
        this.btnLogIn.classList.add('hideContainer');
        this.btnSignUp.classList.add('hideContainer');

        this.confirmPassword.setAttribute('class','form-group');
        this.confirmPassword.innerHTML = `<input type="password" id="confirmPass" class="form-control-sm" placeholder="Confirm Password*">`;
        this.inputFields.append(this.confirmPassword);
        

        this.emailAddress.setAttribute('class','form-group');
        this.emailAddress.innerHTML = `<input type="text" name="emailAddress" id="emailAddress" class="form-control-sm" placeholder="Email Address*">`;
        this.inputFields.append(this.emailAddress);

        this.phoneNumber.setAttribute('class','form-group');
        this.phoneNumber.innerHTML = `<input type="text" id="phoneNumber" class="form-control-sm" placeholder="Phone Number" onkeypress="return isNumberKey(event)">`;
        this.inputFields.append(this.phoneNumber);

        this.desiredActivationMethod.setAttribute('class','form-group');
        this.desiredActivationMethod.innerHTML = `<fieldset id="desiredActivationMethod">
        <legend style="text-align:center;">Send activation link to:</legend>
    
        <div>
          <input type="radio" id="radioButtonEmail" name="desiredActivationMethod" value="email" checked>
          <label for="dewey">Email</label>
        </div>
        <div>
          <input type="radio" id="radioButtonPhone" name="desiredActivationMethod" value="phone" >
          <label for="huey">Phone</label>
        </div>
    
    </fieldset>`;
        this.inputFields.append(this.desiredActivationMethod);

        

        
        this.registerButton.setAttribute('style','display:block;margin-left: auto;');
        this.registerButton.setAttribute('class','mt-4');
        this.registerButton.innerHTML = `<button class="btn btn-primary btn-add-book" id="btnRegister" 
        onclick="
        ValidateEmail(document.querySelector('#emailAddress').value);
        validatePassword(document.querySelector('#pass').value);
        validatePhoneNumber(document.querySelector('#phoneNumber').value);
        ">Register</button><br>
        <button  id="btnBackToLogIn" onclick="UI.logInForm();" type="button" class="btn btn-link">Back to Logi in</button>`;
        this.inputFieldsButtons.append(this.registerButton);

        
        
    }

    static logInForm(){
        btnLogIn.classList.remove('hideContainer');
        btnSignUp.classList.remove('hideContainer');
        btnRegister.classList.add('hideContainer');
        this.confirmPassword.classList.add('hideContainer');
        this.emailAddress.classList.add('hideContainer');
        this.phoneNumber.classList.add('hideContainer');
        document.querySelector('#desiredActivationMethod').classList.add('hideContainer');
        document.querySelector('#btnBackToLogIn').classList.add('hideContainer');
    }

    static setRole(role){
        if(role !== 'user' ){
            btnRolePlaceholder.classList.remove('hideContainer');
            console.log('admin sau editor');
            btnRolePlaceholder.setAttribute('style','text-decoration:none;');
            btnRolePlaceholder.classList.add('btn-edit-users');
        }else{
            btnRolePlaceholder.classList.add('hideContainer');
        }
    }

    static hideSection(id){
        id.classList.add('hideContainer');
    }
    static showSection(id){
        id.classList.remove('hideContainer');
    }

    static showUsers(result){
        console.log(result);
        const res = result;
        const usersList = document.querySelector('#users-list');

        const html = result.map(res => `
        <tr>
            <td>${res.username}</td>
            <td>
            ${res.roles[res.roles.length - 1]}
            </td>
            <td class="text-center">
            <button type="button" class="btn btn-primary btn-sm btn-delete">Delete
            
            </td>
        </tr>
        ` ).join('');
        console.log(html);
        //to be added
        // </button><button class="btn btn-primary btn-sm btn-edit">Edit</button>

        usersList.innerHTML = html;
        
        console.log(res);
    }

    static arrowPointing(){
        const arrow = document.querySelector('#arrow');
        const header = document.querySelector('#header-title');
        this.hideSection(arrow);

        setTimeout(() =>{header.classList.add('header-right');}, 450);
        setTimeout(() =>{this.showSection(arrow)}, 750);
        
        setTimeout(() =>{arrow.classList.add('arrow-right');}, 750);
        
        setTimeout(() =>{this.hideSection(arrow)}, 4700);
        setTimeout(() =>{header.classList.remove('header-right');}, 5100);
        
    }

    static animationHeader(text, animationPlayed, allowedPlayableAnimations){
        // 'Go back to the book list, by clicking the book icon!'
        if(animationPlayed < allowedPlayableAnimations && animations){
            console.log('animation played:',animationPlayed);
            setTimeout(() =>{UI.arrowPointing()},2000);
            setTimeout(() =>{UI.showAlert(text,'info', 4000)},1000);
        }
    }
}