btnSignUp.addEventListener('click', async (err) => {
    UI.signUpForm();
    
    const btnRegister = document.querySelector('#btnRegister');

    btnRegister.addEventListener('click', async (e) => {
        e.preventDefault();
        // UI.showAlert('modal','success', 8000);
        
        const username = document.querySelector('#user').value;
        const password = document.querySelector('#pass').value;
        const confirmPassword = document.querySelector('#confirmPass').value;
        const emailAddress = document.querySelector('#emailAddress').value;
        const phoneNumber = document.querySelector('#phoneNumber').value;
        const desiredActivationMethod = document.querySelector('input[name="desiredActivationMethod"]:checked').value;
        const authorisationContainer = document.querySelector('#authorisationContainer')

        
        // console.log(username, password, confirmPassword, emailAddress, phoneNumber, desiredActivationMethod);
        if(username !== '' && password !== '' && confirmPassword !== '' && emailAddress!== ''){
            if((password === confirmPassword)){
                if(validateEmail(emailAddress) && (desiredActivationMethod === 'phone' ? validatePhoneNumber(phoneNumber) : true)){
                    UI.hideSection(authorisationContainer);
                    UI.showProgressBar(2000,30);
                    setTimeout(()=>{
                        UI.showProgressBar(1500,75);
                        setTimeout(()=>{
                            UI.showProgressBar(10000,90);
                        },1500);
                    },2000);
                    const progressBarId = document.querySelector('#progressBar');
                    const registerData = await API.register(username, password, confirmPassword, emailAddress, phoneNumber, desiredActivationMethod);
                    if(registerData){
                        UI.hideSection(progressBarId);
                        UI.showSection(authorisationContainer);
                        UI.logInForm();
                        UI.showAlert(registerData.message,'success', 8000);
                    }
                }
            }else{
                UI.showAlert(`Password confirmation does not match`,'danger', 4000);
            }
        }else{
            UI.showAlert(`The fields that are marked with * are necessary for registration`,'danger', 4000);
        }
    })
})

btnLogIn.addEventListener('click', async (e) =>{
    e.preventDefault();
    const user = document.querySelector('#user').value;
    const pass = document.querySelector('#pass').value;
    
    if(user !== '' && pass !== ''){
        console.log("log in");
        const logInData = await API.logIn(user, pass);
        if(logInData){
            console.log(logInData);
            console.log(logInData.status);
            myCookie.setCookie('username', logInData.username, 24);
            myCookie.setCookie('role', logInData.role, 24);
            myCookie.setCookie('token', logInData.accessToken, 0, 15);
            
            usernamePlaceholder.innerHTML = logInData.username;
            rolePlaceholder.innerHTML = `[${logInData.role.toUpperCase()}]`;
            
            UI.setRole(logInData.role);
            UI.loggedIn(logInData.accessToken, myCookie.getCookie());
            
            apiConnection.setBearer(logInData.accessToken);
        
            UI.showAlert(`Welcome, ${logInData.username} !`,'success', 4000);
            loggedIn = true;
            const myBooksList = await apiConnection.getMyBooksList();
            apiConnection.setUsername(logInData.username);
            
            if(myBooksList){
                UI.importBooks(JSON.stringify(myBooksList));
            }else{
                UI.showAlert("Coudln't get your books from the db!", 'warning');
            }        
        }else{
            UI.showAlert(`Coudln't log in, there was a problem with the server. Code: ${response.status}`,'danger');
        }
        
    }else{
        UI.showAlert('Insert Username / Password', 'warning');
    }
})