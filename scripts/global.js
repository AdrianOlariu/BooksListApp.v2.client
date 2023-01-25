
//Best Practices?
//https://dmitripavlutin.com/timeout-fetch-request/ - Way to timeOut a fetch request
//https://www.codemag.com/Article/2107031/How-to-Use-the-Fetch-API-Correctly

const appSettings = {
    url: 'http://brailei201.home.ro:3500'
}


function getHighestRole(object){
    let roles = [];
    let values = [];
    for( let [key, value] of Object.entries(object)){
        roles.push(key);
        values.push(value);
    }
    console.log(values.length);
    let max = 0;

    for(let i = 0; i < values.length; i++){
        if(values[i] > max){
            max = values[i];
        }
    }

    return roles;
}

//Useful Stuff I implemented
//Cookies management system: setCookie(name, value, hours, minutes), getCookie(name)
//Singleton Design Pattern - one instance of API Connection