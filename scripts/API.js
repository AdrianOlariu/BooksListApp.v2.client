class API{

    constructor(bearer, username){
        this.bearer = bearer;
        this.username = username;
    }

    getBearer(){
        return this.bearer;
    }

    setBearer(bearer){
        this.bearer = bearer;
    }

    getUsername(){
        return this.username;
    }

    setUsername(username){
        this.username = username;
    }

    static async logIn(user, pass){
        if(user !== '' && pass !== ''){
            const response = await fetch(
                appSettings.url + '/users/login',{
                    method: 'POST',
                    headers: {'Content-Type':'application/json'},
                    credentials: 'include',
                    body: JSON.stringify({username:user, password:pass})
                }
            );
            const data = await response.json();
            if(response.ok){
                return data;
            }else{
                UI.showAlert(data.message,'danger', 8000);
                return 0;
            }
        }else{
            return 0;
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
            const response = await fetch(appSettings.url + '/users/register',{
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                credentials: 'include',
                body: JSON.stringify({
                    username:user,
                    password:pass,
                    emailAddress:emailAddress,
                    phoneNumber:phoneNumber,
                    desiredActivationMethod:desiredActivationMethod })
                });
                const data = await response.json();
            if(response.ok){
                return data;
            }else{
                UI.showAlert(data.message,'danger', 8000);
                return 0;
            }
        }else{
            return 0;
        }
    }

    async getMyBooksList(){
                //https://internationaltradeadministration.github.io/DevPortalMessages/IntroToNewAuthType.html
                //the bearer is set through the setBearer method inside the logIn function in autenthication.
                console.log(token);
                const response = await fetch(appSettings.url + '/books'  ,{
                        method: 'GET',
                        headers: {
                            'Authorization': 'Bearer ' + this.bearer
                        }
                    }
                )
                const data = await response.json();
                if(response.ok){
                    return data;
                }else{
                    UI.showAlert(data.message,'danger', 8000);
                    return 0;
                }
    }

    async refreshToken(){
                const response = await fetch(appSettings.url + '/users/refreshtoken',{
                        method: 'GET',
                        credentials: 'include',
                        // headers: {
                        //     'Authorization': 'Bearer ' + this.bearer
                        // }
                        //folosim jwtRefreshToken, primit in httpOnly cookie
                        //cookie-ul este pus automat in header
                        //La server luam cookie.jwtRefreshToken
                        //aceasta functie da refresh in baza de date la accessToken pe care il folosim in aplicatie
                        //reinitializam accessToken-ul
                    }
                )
                const data = await response.json();
                if(response.ok){
                    console.log(data);
                    return data;
                }else{
                    return 0;
                }
               
    }

    async logOut(){
        try{
            const response = await fetch(url + '/users/logout',
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
    
        const response = await fetch(appSettings.url + '/users',{
            method:'GET',
            headers: {
                Authorization: 'Bearer ' + this.bearer
            }
        });
        const data = await response.json();
        if(response.ok){
            return data;
        }else{
            return 0;
        }
    }

    async deleteUser(username){
        console.log(username);
        try{
            const response = await fetch(
                appSettings.url + `/users/delete?username=${username}`,
                {
                    method:'DELETE',
                    headers: {
                        'Content-Type':'application/json',
                        Authorization: 'Bearer ' + this.bearer
                        }
                }
            )
            const data = await response.json();
            if(response.ok){
                return data;
            }
        }catch (err){
            console.log(err);
        }
    }

    async updateUser(object){
        const {username, email, phone, roles, books} = object;
        console.log(object);
        if(username && (email || phone || roles || books )){
            console.log('try API CALL UPDATE USER!')
            try{
                const url = appSettings.url + `/users/update?username=${username}` 
                + (email ? "&email=" + email  : "")
                + (phone ? "&phone=" + phone  : "") 
                + (roles ? "&roles=" + roles  : "")
                + (books ? "&books=" + books  : "");
                console.log(url);
                const response = await fetch(url,{ 
                        method:"PUT", headers:{
                        'Content-Type':'application/json',
                        Authorization: 'Bearer ' + this.bearer}
                    }
                );
                const data = await response.json();
                console.log(data);
                if(response.ok){
                    return data;
                }else{
                    UI.showAlert(data.message, 'warning',6000);
                    return 0;
                }
            }catch (e){
                console.log(e);
            }
        }else{
            return false;
        }
    }

    async addBookToUserList(username, book){
        console.log(this.bearer);
        const bookJSON = JSON.stringify(book);
        console.log(bookJSON);
        console.log(username);
        const url = appSettings.url + `/users/book?username=${username}&book=${bookJSON}`
        const response = await fetch(url,{
            method:'PUT', headers:{
            'Content-Type':'application/json',
            Authorization: 'Bearer ' + this.bearer}
        }
            )
        const data = await response.json();
        if(response.ok){
            return data;
        }else{
            UI.showAlert(data.message, 'warning', 6000);
            return 0;
        }
    }

    async verifyAccessToken(){
        try{
            const response = await fetch(url + '/verifyaccesstoken',{method: 'GET'});
        }catch (err){

        }
    }
}
