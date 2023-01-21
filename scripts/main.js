document.addEventListener('DOMContentLoaded',
UI.displayBooks());
console.log("book app");
let animations = true;
let btnRolePlaceholder = document.querySelector('#btnRolePlaceholder');
let role = '', token = '', username = '';
let loggedInInfos = '';
let apiConnection = new API('');
let myCookie = new Cookie();
let animationPlayed = 0;
let allowedPlayableAnimations = 2;
let section;
let tokenExpired = false;

let loggedIn = false;
if(myCookie.getCookieByName('token') || myCookie.getCookieByName('username')){
    console.log();
    loggedIn = true;
    UI.animationHeader('When the authentication token expires, refresh it by clicking the book icon!', animationPlayed, allowedPlayableAnimations);
    animationPlayed += 1;
}else{
    tokenExpired = true;
}

const books_section = document.querySelector('#booksListContainer');

const authorisationContainer = document.querySelector('#authorisationContainer');
const infoContainer = document.querySelector('#infoContainer');
const usernamePlaceholder = document.querySelector('#usernamePlaceholder');
const rolePlaceholder = document.querySelector('#rolePlaceholder');
// booksContainer.parentNode.removeChild(booksContainer);
const btnLogOut = document.querySelector('#btnLogOut');
const usersContainer = document.querySelector('#usersContainer')

btnRolePlaceholder.addEventListener('click', async (e)=>{
    e.preventDefault();
    if(myCookie.getCookieByName('token')){
        UI.animationHeader('Go back to the book list, by clicking the book icon!', animationPlayed, allowedPlayableAnimations);
        animationPlayed += 1;
        UI.showSection(usersContainer);
        section = 'users';

        apiConnection.getUsers().then((result) => {
            if(result){
                UI.hideSection(books_section);
                UI.showUsers(result);
            }
        }).catch(err =>{
            console.log(err);
        });
    }else{
        UI.showAlert('Access token has expired! Refresh it!','danger');
        if(section === 'users'){
            UI.animationHeader('Go back to the book list, by clicking the book icon!', 0, 1);
        }else{
            UI.animationHeader('When the access token expires, refresh it by clicking the book icon!', 0, 1);
        }
    }
})

// console.log('my cookie here: ',myCookie.getCookie());

UI.loggedIn(myCookie.getCookie());

if(myCookie.getCookieByName('username') && myCookie.getCookieByName('role')){
    //https://stackoverflow.com/questions/62323246/how-to-stay-logged-in-after-the-browser-is-closed-using-javascript
    //folosim metoda split pentru a taia string-ul continut in document.cookie
    //https://linuxhint.com/cut-string-after-specific-character-in-javascript/#:~:text=There%20is%20another%20JavaScript%20method%20for%20cutting%20a,the%20character%20and%20the%20other%20after%20the%20character.
    username = myCookie.getCookieByName('username');
    console.log('#username:', username);
    token = myCookie.getCookieByName('token');
    console.log('#token:', token);
    role = myCookie.getCookieByName('role');
    apiConnection.setBearer(token);
    usernamePlaceholder.innerHTML = username;
    rolePlaceholder.innerHTML = `[${role.toUpperCase()}]`;
    console.log(role);
    UI.setRole(role, apiConnection.getUsers());
}

btnLogOut.addEventListener('click', async (e)=>{
    e.preventDefault();
    console.log('logOut');
    UI.hideSection(usersContainer);
    Cookie.clearAnyCookie("username");
    Cookie.clearAnyCookie("token");
    Cookie.clearAnyCookie("jwt");
    Cookie.clearAnyCookie("role");
    loggedIn = false;
    animationPlayed = 0;
    location.reload();
    await apiConnection.logOut();
})

console.log('cookie',document.cookie);

let flagPlayed = false;

async function refreshToken(){
    if(section === 'users'){
        UI.animationHeader('When the authentication token expires, refresh it by clicking the book icon!', animationPlayed, allowedPlayableAnimations);
        animationPlayed += 1;
    }
    
    if(loggedIn || tokenExpired){
        console.log('attempting refresh');
        if(!flagPlayed){
            flagPlayed = true;
            if(!(section !== undefined || section !== 'books') || section === 'users'){
                UI.animationHeader('When the authentication token expires, refresh it by clicking the book icon!', animationPlayed, allowedPlayableAnimations);
                animationPlayed += 1;
            }
        }
        // myCookie.getCookieByName('token');
        if(loggedIn){
            UI.showSection(books_section);
            UI.hideSection(usersContainer);
            if(section !== 'users' && !myCookie.getCookieByName('token')){
                // if(loggedIn){
                    await apiConnection.refreshToken().then(res => {if(res.newAccessToken){
                        console.log('called');
                        myCookie.clearCookie('token');
                        myCookie.setCookie('token', res.newAccessToken, 0, 1);
                        apiConnection.setBearer(res.newAccessToken)
                        UI.showAlert(`New access token generated!`,'success');
                    }else{
                        return new Error("couldn't refresh the token");
                    }
                });
            // }
        }else{
            if(section !== 'users'){
                UI.showAlert(`Your ccess token is still valid!`,'info');
            }
        }
        section = 'books';
    }
}
}