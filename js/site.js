const books = [{
        id: 1,
        title: "ComicCon",
        author: "New York",
        copiesSold: 240000,
        state: "New York",
        publishingDate: "06/01/2017",
    },
    {
        id: 2,
        title: "ComicCon",
        author: "New York",
        copiesSold: 250000,
        state: "New York",
        publishingDate: "06/01/2018",
    },
    {
        id: 3,
        title: "ComicCon",
        author: "New York",
        copiesSold: 257000,
        state: "New York",
        publishingDate: "06/01/2019",
    },
    {
        id: 4,
        title: "ComicCon",
        author: "San Diego",
        copiesSold: 130000,
        state: "California",
        publishingDate: "06/01/2017",
    },
    {
        id: 5,
        title: "ComicCon",
        author: "San Diego",
        copiesSold: 140000,
        state: "California",
        publishingDate: "06/01/2018",
    },
    {
        id: 6,
        title: "ComicCon",
        author: "San Diego",
        copiesSold: 150000,
        state: "California",
        publishingDate: "06/01/2019",
    },
    {
        id: 7,
        title: "HeroesCon",
        author: "Charlotte",
        copiesSold: 40000,
        state: "North Carolina",
        publishingDate: "06/01/2017",
    },
    {
        id: 8,
        title: "HeroesCon",
        author: "Charlotte",
        copiesSold: 45000,
        state: "North Carolina",
        publishingDate: "06/01/2018",
    },
    {
        id: 9,
        title: "HeroesCon",
        author: "Charlotte",
        copiesSold: 50000,
        state: "North Carolina",
        publishingDate: "06/01/2019",
    },
];

function buildDropDown(){
    //get dropdown and clear it from html
    let bookDropDown = document.getElementById("bookDropDown");
    bookDropDown.innerHTML = "";

    //get local storage or default data
    let currentBooks = JSON.parse(localStorage.getItem("booksArray")) || books;

    //get a distinct list of authors by filtering the array
    let authors = currentBooks.map((book) => book.author);
    let distinctAuthors = [...new Set(authors)];

    //load templates
    let dropDownTemplate = document.getElementById("bookDropDown-template");

    //use templates to create a dropdown
    let dropDownItemTemplate = document.importNode(dropDownTemplate.content, true);
    let li = dropDownItemTemplate.querySelector("li")
    let dropDownItem = li.querySelector("a");
    dropDownItem.setAttribute("data-author", "All");
    dropDownItem.textContent = "All";
    bookDropDown.appendChild(li);

    for (let i = 0; i < distinctAuthors.length; i++){
        dropDownItemTemplate = document.importNode(dropDownTemplate.content, true);
        li = dropDownItemTemplate.querySelector("li")
        dropDownItem = li.querySelector("a");
        dropDownItem.setAttribute("data-author", distinctAuthors[i]);
        dropDownItem.textContent = distinctAuthors[i];
        bookDropDown.appendChild(li);
    }

    //display stats
    displayStats(currentBooks);
}

//Expected input: An array of book objects
//Expected return: none
//Display the book stats on the webpage
function displayStats(filteredBooks){
    let total = 0;
    let average = 0;
    let most = 0;
    let least = -1;

    let currentSold = 0;
    for (i = 0; i < filteredBooks.length ;i++){
        currentSold = filteredBooks[i].copiesSold;
        total += currentSold;

        if (most < currentSold){
            most = currentSold;
        }

        if (least > currentSold || least == -1){
            least = currentSold;
        }
    }
    average = total / filteredBooks.length;

    document.getElementById("total").innerHTML = total.toLocaleString();
    document.getElementById("average").innerHTML = average.toLocaleString(
        "en-US",{
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }
    );
    document.getElementById("most").innerHTML = most.toLocaleString();
    document.getElementById("least").innerHTML = least.toLocaleString();
}


//Expected input: A template element
//Expected return: none
//Show the book sales for a specific author when an author is selected from the dropdown
function getBooks(element){

    let author = element.getAttribute("data-author");
    let currentBooks = JSON.parse(localStorage.getItem("booksArray")) || books;

    //filter events based on the selected author
    let filteredBooks = currentBooks;
    if (author != "All"){
        filteredBooks = currentBooks.filter(function(book){
            if(book.author == author){
                return book;
            }
        })
    }

    if (author == "All"){
        document.getElementById("statsHeader").innerHTML = `Stats for All Books`;
    }
    else{
        document.getElementById("statsHeader").innerHTML = `Stats for ${author}'s Books`;
    }

    displayStats(filteredBooks);
}

//Expected input: none
//Expected return: none
//Display the content of the data on load
function displayData(){
    let template = document.getElementById("bookData-template");
    let bookDataBody = document.getElementById("bookDataBody");
    bookDataBody.innerHTML="";

    let currentBooks = JSON.parse(localStorage.getItem("booksArray")) || [];

    if (currentBooks.length == 0){
        currentBooks = books;
        localStorage.setItem("booksArray", JSON.stringify(currentBooks));
    }

    for (let i = 0; i < currentBooks.length; i++){
        let bookRow = document.importNode(template.content, true);
        let bookCols = bookRow.querySelectorAll("td");

        bookCols[0].textContent = currentBooks[i].title;
        bookCols[1].textContent = currentBooks[i].author;
        bookCols[2].textContent = currentBooks[i].copiesSold;
        bookCols[3].textContent = currentBooks[i].state;
        bookCols[4].textContent = new Date(currentBooks[i].publishingDate).toLocaleDateString();

        bookDataBody.appendChild(bookRow);
    }

}