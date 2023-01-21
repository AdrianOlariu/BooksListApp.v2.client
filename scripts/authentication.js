btnSignUp.addEventListener('click', async (err)=>{
    UI.signUpForm();
    const btnRegister = document.querySelector('#btnRegister');

    btnRegister.addEventListener('click', async (e) =>{
        const username = document.querySelector('#user').value;
        const password = document.querySelector('#pass').value;
        const confirmPassword = document.querySelector('#confirmPass').value;
        const emailAddress = document.querySelector('#emailAddress').value;
        const phoneNumber = document.querySelector('#phoneNumber').value;
        const desiredActivationMethod = document.querySelector('input[name="desiredActivationMethod"]:checked').value;
        
        console.log(username, password, confirmPassword, emailAddress, phoneNumber, desiredActivationMethod);
    
        e.preventDefault();
        const registerResponse = await API.register(username, password, confirmPassword, emailAddress, phoneNumber, desiredActivationMethod);

        Promise.resolve(registerResponse.json()).then(data=> {
            if(registerResponse.status.toString().includes('20')){
                //     registerResponse.then(response => console.log(response));
                    UI.showAlert(data.message,'success', 8000);
                }else {
                    UI.showAlert(data.message,'danger', 4000);
                }
        });
        
        UI.logInForm();
    })
})

btnLogIn.addEventListener('click', async (e) =>{
    e.preventDefault();
    const user = document.querySelector('#user').value;
    const pass = document.querySelector('#pass').value;
    if(user !== '' && pass !== ''){
        console.log("log in");
        const response = await API.logIn(user, pass);
        if(response.status.toString().includes('20')){
            console.log(response.status);
            response.json().then(result => {
                console.log(result);
                myCookie.setCookie('username', result.username, 24);
                myCookie.setCookie('role', result.role, 24);
                myCookie.setCookie('token', result.accessToken, 0, 1);
                usernamePlaceholder.innerHTML = result.username;
                rolePlaceholder.innerHTML = `[${result.role.toUpperCase()}]`;
                
                UI.setRole(result.role);
                
                console.log(result)
                console.log(result.accessToken);
                UI.loggedIn(result.accessToken, myCookie.getCookie());
                
                apiConnection.setBearer(result.accessToken);
                console.log('bearer',apiConnection.getBearer());
                
                // usernamePlaceholder.innerHTML = username;
                    
                console.log(username);
            
            UI.showAlert(`Welcome, ${result.username}`,'info',4000);
            loggedIn = true;
            });
        }else{
            UI.showAlert("Coudln't log in, might be a problem with the server", 'warning');
        }
        
    }else{
        UI.showAlert('Insert Username / Password', 'warning');
        console.log('insert correct value');
    }
})