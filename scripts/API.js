class API{

    constructor(bearer){
        this.bearer = bearer;
    }

    getBearer(){
        return this.bearer;
    }

    setBearer(bearer){
        this.bearer = bearer;
    }

    static async logIn(user, pass){
        if(user !== '' && pass !== ''){
            return await fetch(
                'http://localhost:3500/users/login',{
                    method: 'POST',
                    headers: {'Content-Type':'application/json'},
                    credentials: 'include',
                    body: JSON.stringify({username:user, password:pass})
                }
            );
        }else{
            console.log('User and Password required');
            UI.showAlert(`User and Password required`,'danger');
        }
    }

    static async register(user, pass, confirmPass, emailAddress, phoneNumber, desiredActivationMethod){
        console.log({
            username:user,
            password:pass,
            emailAddress:emailAddress,
            phoneNumber:phoneNumber,
            desiredActivationMethod:desiredActivationMethod
        });
        if(user !== '' && pass !== '' && (pass === confirmPass) && (emailAddress != '' || phoneNumber != '')){
                return fetch('http://localhost:3500/users/register',{
                    method: 'POST',
                    headers: {'Content-Type':'application/json'},
                    credentials: 'include',
                    body: JSON.stringify({
                        username:user,
                        password:pass,
                        emailAddress:emailAddress,
                        phoneNumber:phoneNumber,
                        desiredActivationMethod:desiredActivationMethod })
                    }).then(response => response);
                    // return await response.json();
        }else{
            console.log('User and Password required');
            UI.showAlert(`User and Password required`,'danger');
        }
    }

    async books(url, method, accessToken){
                //https://internationaltradeadministration.github.io/DevPortalMessages/IntroToNewAuthType.html
                let finalUrl = 'http://api2.adrianolariu.ro/books';
                const token = 'Bearer ' + this.bearer;
                console.log('async function');
                console.log(`${finalUrl}`);
                    console.log(token);
                try{
                    
                    const response = await fetch(
                        finalUrl,{
                            method: method,
                            headers: {
                                'Authorization': token
                            }
                        }
                    )
    
                    if(response.ok){
                        return await response.json();
                    }else{
                        throw new Error(`${response.status} ${response.statusText}`);
                    }
                }catch (err){
                    console.log('caught error',err);
                }
    }

    async refreshToken(){
                try{
                    const response = await fetch('http://api2.adrianolariu.ro/refreshtoken',
                    {
                            method: 'GET',
                            credentials: 'include'
                            // headers: {
                            //     'Authorization': token
                            // }
                            //cookie-ul este pus automat in header. La server luam cookie.jwt
                        }
                    )
    
                    if(response.ok){
                        return await response.json();
                    }else{
                        throw new Error(`${response.status} ${response.statusText}`);
                    }
                }catch (err){
                    console.log('caught error',err);
                }
    }

    async logOut(){
        try{
            const response = await fetch('http://api2.adrianolariu.ro/users/logout',
            {
                    method: 'GET',
                    credentials: 'include'
                    // headers: {
                    //     'Authorization': token
                    // }
                    //cookie-ul este pus automat in header. La server luam cookie.jwt
                }
            )

            if(response.ok){
                UI.loggedIn(false);
                return await response.json();
            }else{
                throw new Error(`${response.status} ${response.statusText}`);
            }
        }catch (err){
            console.log('caught error',err);
        }
    }

    async getUsers(){
        
        try{
            const response = await fetch('http://api2.adrianolariu.ro/users',{
                method:'GET',
                headers: {
                    Authorization: 'Bearer ' + this.bearer
                }
            });
            return await response.json();
        }catch(err){
            console.log(err);
        }
    }

    async deleteUser(userName){
        console.log(userName);
        try{
            const response = await fetch(
                'http://api2.adrianolariu.ro/users/',
                {
                    method:'DELETE',
                    headers: {
                        'Content-Type':'application/json',
                        Authorization: 'Bearer ' + this.bearer
                        },
                    body: JSON.stringify({username:userName})
                }
            )
            return await response.json();
        }catch (err){
            console.log(err);
        }
    }

    async verifyAccessToken(){
        try{
            const response = await fetch('http://api2.adrianolariu.ro/verifyaccesstoken',{method: 'GET'});
        }catch (err){

        }
    }
}
