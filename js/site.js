const books = [{
        id: 1,
        title: "The Hobbit",
        author: "J.R.R. Tolkien",
        copiesSold: 104000000,
        country: "United Kingdom",
        publishingDate: "09/21/1937"
    },
    {
        id: 2,
        title: "The Fellowship of the Ring",
        author: "J.R.R. Tolkien",
        copiesSold: 161000000,
        country: "United Kingdom",
        publishingDate: "07/29/1954"
    },
    {
        id: 3,
        title: "The Silmarillion",
        author: "J.R.R. Tolkien",
        copiesSold: 1200000,
        country: "United Kingdom",
        publishingDate: "09/15/1977"
    },
    {
        id: 4,
        title: "The Cat in the Hat",
        author: "Dr. Seuss",
        copiesSold: 16500000,
        country: "United States of America",
        publishingDate: "03/12/1957"
    },
    {
        id: 5,
        title: "Green Eggs and Ham",
        author: "Dr. Seuss",
        copiesSold: 18000000,
        country: "United States of America",
        publishingDate: "08/12/1960"
    },
    {
        id: 6,
        title: "One Fish, Two Fish, Red Fish, Blue Fish",
        author: "Dr. Seuss",
        copiesSold: 13700000,
        country: "United States of America",
        publishingDate: "05/14/1960"
    },
    {
        id: 7,
        title: "David Copperfield",
        author: "Charles Dickens",
        copiesSold: 85000000,
        country: "United Kingdom",
        publishingDate: "11/07/1849"
    },
    {
        id: 8,
        title: "A Tale of Two Cities",
        author: "Charles Dickens",
        copiesSold: 223000000,
        country: "United Kingdom",
        publishingDate: "11/25/1859"
    },
    {
        id: 9,
        title: "Great Expectations",
        author: "Charles Dickens",
        copiesSold: 165000000,
        country: "United Kingdom",
        publishingDate: "06/01/1861"
    }
];

//Build the drop down list from either preloaded data or data saved to local storage
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

    displayStats(currentBooks);
}

//Expected input: An array of book objects
//Expected return: none
//Display the book sales stats
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
//Show the book sales by author
function filterBooks(element){

    let author = element.getAttribute("data-author");
    let currentBooks = JSON.parse(localStorage.getItem("booksArray")) || books;

    //filter books based on the selected author
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
//Display the content of the data
function displayData(){
    let template = document.getElementById("bookData-template");
    let bookDataBody = document.getElementById("bookDataBody");
    bookDataBody.innerHTML="";

    let delButton = `<button type="button" class="btn btn-danger" onclick="deleteData(this)">Delete</button>`;

    let currentBooks = JSON.parse(localStorage.getItem("booksArray")) || [];

    if (currentBooks.length == 0){
        currentBooks = books;
        localStorage.setItem("booksArray", JSON.stringify(currentBooks));
    }

    for (let i = 0; i < currentBooks.length; i++){
        let bookRow = document.importNode(template.content, true);
        let bookCols = bookRow.querySelectorAll("td");
        let bookTr = bookRow.querySelector("tr");

        bookCols[0].textContent = currentBooks[i].title;
        bookCols[1].textContent = currentBooks[i].author;
        bookCols[2].textContent = currentBooks[i].copiesSold;
        bookCols[3].textContent = currentBooks[i].country;
        bookCols[4].textContent = new Date(currentBooks[i].publishingDate).toLocaleDateString();
        bookCols[5].innerHTML = delButton;

        bookTr.setAttribute("data-id", currentBooks[i].id);
        bookDataBody.appendChild(bookRow);
    }
}

//expected input: none
//expected reutrn: none
//save data
function saveData(){
    let currentBooks = JSON.parse(localStorage.getItem("booksArray")) || books;
    let obj = {};

    let bookid = 1;
    //generate next id for book
    if (currentBooks == 0) {
        bookid = 1;
    } else {
        let bookIDArray = currentBooks.map(
            function (obj) {
                return obj.id;
            });

        //find the maximum in the array
        let maxid = Math.max.apply(null, bookIDArray);
        bookid = maxid + 1;
    }

    obj["id"] = bookid;
    obj["title"] = document.getElementById("newTitle").value;
    obj["author"] = document.getElementById("newAuthor").value;
    obj["copiesSold"] = parseInt(document.getElementById("newCopiesSold").value, 10);
    let countrySelect = document.getElementById("newCountry");
    obj["country"] = countrySelect.options[countrySelect.selectedIndex].text;
    let publishingDate = document.getElementById("newPublishingDate").value;
    let publishingDate2 = `${publishingDate} 00:00`;
    obj["publishingDate"] = new Date(publishingDate2).toLocaleDateString();

    currentBooks.push(obj);
    localStorage.setItem("booksArray", JSON.stringify(currentBooks));

    buildDropDown();
    displayData();
}

//expected input: button
//expected reutrn: none
//delete data from the webpage and the database
function deleteData(delBtn){
    let currentBooks = JSON.parse(localStorage.getItem("booksArray")) || books;

    let row = delBtn.parentElement.parentElement;
    let bookid = row.getAttribute("data-id");

    row.remove();

    //find index of item in array
    let bookIndex = currentBooks.findIndex(obj => obj.id == bookid);
    currentBooks.splice(bookIndex, 1);

    //push the new values back to local storage
    localStorage.setItem("booksArray", JSON.stringify(currentBooks));

    buildDropDown();
    displayData();
}