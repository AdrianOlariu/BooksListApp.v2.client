class Book {
    constructor(title, author, year, genres, readStatus){
        this.title = title;
        this.author = author;
        this.year = year;
        this.genres = genres;
        this.readStatus = readStatus;
    }

    getBook (){
        const bookObj = {
            title: this.title,
            author: this.author,
            year: this.year,
            genres: this.genres,
            readStatus: this.readStatus
        }
        return bookObj;
    }
    
    setBook (title, author, year, genres, readStatus){
        this.title = title;
        this.author = author;
        this.year = year;
        this.genres = genres;
        this.readStatus = readStatus;
    }



}
