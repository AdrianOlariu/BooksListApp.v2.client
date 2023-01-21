class Cookie {
    constructor(cname, cvalue, hours){
        this.cname = cname;
        this.cvalue = cvalue;
        this.hours = hours;
        if(this.cname){
            const d = new Date();
            d.setTime(d.getTime() + (this.hours*60*60*1000));
            let expires = "expires="+ d.toUTCString();
            document.cookie = this.cname + "=" + this.cvalue + ";" + expires + ";";
        }
    }

    setCookie(cname, cvalue, hours, minsorhours){
        if(cvalue){
            const d = new Date();
            d.setTime(d.getTime() + ((minsorhours ? minsorhours : hours*60) *60*1000));
            let expires = "expires="+ d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";";
        }
    }

    getCookie(){
        return document.cookie;
    }

    getCookieByName(cname){
        const rawCookies = document.cookie.split(';');

        const cookieName = rawCookies.map(cookie => (
            (cookie.split('=')[0].trim())
        ));

        const cookieValue = rawCookies.map(cookie => (
            (cookie.split('=')[1])
        ));

        const found = cookieValue[cookieName.indexOf(cname)];

        return found;
    }

    clearCookie(){
        document.cookie = this.cname + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    }

    static clearAnyCookie(cookieName){
        document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    }

    static clearCookie(cookieName){
        document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    }
}