/*  VARIABLES
-------------------*/
const balanceElement = document.getElementById("balance")
const outstandingLoanElement = document.getElementById("outstanding-loan")
const loanSectionElement = document.getElementById("loan-section");
const payElement = document.getElementById("pay")

//Buttons
const loanBtnElement = document.getElementById("loan-btn")
const bankBtnElement = document.getElementById("bank-btn")
const workBtnElement = document.getElementById("work-btn")
const repayBtnElement = document.getElementById("repay-btn")
const buyBtnElement = document.getElementById("buy-btn")

//Laptop info
const laptopsElement = document.getElementById("laptops")
const specsElement = document.getElementById("specs")
const imageElement = document.getElementById("image")
const titleElement = document.getElementById("title")
const descriptionElement = document.getElementById("description")
const priceElement = document.getElementById("price")

let balance = 0;
let outstandingLoan = 0;
let pay = 0;
let laptops = [];
let laptopPrice = 0;
let laptopName = "";
let loan = false;

const api = 'https://noroff-komputer-store-api.herokuapp.com/';


/*  FUNCTIONS
-----------------*/

//-------BANK----------

const handleLoan = () => {
    let maxLoan = balance * 2;
    if( loan === false ) {
        const loanRequest = parseInt(prompt("Please enter the amount you wish to loan: "));
        if (maxLoan >= loanRequest) {
            loanState(loan = true);
            outstandingLoan = loanRequest;
            outstandingLoanElement.innerText = outstandingLoan;
        } else if(loanRequest > 0 ){
            alert('Loan request denied')
        }
    }
    else {
        alert('First pay off outstanding loan')
    }
}

const isLoanPaid = (outstandingLoan) => {
    if(outstandingLoan === 0) {
        loanState(loan = false);
    }
}

const loanState = (loan) => {
    if (loan) {
        loanSectionElement.style.visibility = "visible";
        repayBtnElement.style.visibility = "visible";
    } else {
        loanSectionElement.style.visibility = "hidden";
        repayBtnElement.style.visibility = "hidden";
    }
};


//---------WORK----------

const handleBank = () => {
    if(loan) {
        isLoanPaid(outstandingLoan -= pay * 0.10);
        pay = pay * 0.90;
    }
    balance += pay;
    pay = 0;

    balanceElement.innerText = balance;
    payElement.innerText = pay;
    outstandingLoanElement.innerText = outstandingLoan;
}

const handleWork = () => {
    pay += 100;
    payElement.innerText = pay;
}

const handleRepay = () => {
    if(pay < outstandingLoan) {
        isLoanPaid(outstandingLoan -= pay);
    }
    else {
        balance += (pay - outstandingLoan)
        balanceElement.innerText = balance;
        outstandingLoan = 0;
        loanState(loan = false);
    }

    pay = 0;
    outstandingLoanElement.innerText = outstandingLoan;
    payElement.innerText = pay;
}


//---------LAPTOPS----------

fetch(api + 'computers')
    .then(response => response.json())
    .then(data => laptops = data)
    .then(laptops => addLaptopsToMenu(laptops)
    );

const addLaptopsToMenu = (laptops) => {
    laptops.forEach(x => addLaptopToMenu(x))
    specsElement.innerText = laptops[0].specs
    imageElement.src = api + laptops[0].image;
    titleElement.innerText = laptops[0].title;
    descriptionElement.innerText = laptops[0].description;
    priceElement.innerText = `${laptops[0].price} NOK`;
    laptopPrice = laptops[0].price;
    laptopName = laptops[0].title;
}

const addLaptopToMenu = (laptop) => {
    const laptopElement = document.createElement("option");
    laptopElement.value = laptop.id;
    laptopElement.appendChild(document.createTextNode(laptop.title))
    laptopsElement.appendChild(laptopElement);
}

const handleLaptopChange = e => {
    const selectedLaptop = laptops[e.target.selectedIndex];
    specsElement.innerText = selectedLaptop.specs;
    imageElement.src = api + selectedLaptop.image;
    titleElement.innerText = selectedLaptop.title;
    descriptionElement.innerText = selectedLaptop.description;
    priceElement.innerText = `${selectedLaptop.price} NOK`;
    laptopPrice = selectedLaptop.price;
    laptopName = selectedLaptop.title;
}


//------INFO SECTION-------

const handleBuy = () => {
    if(laptopPrice <= balance) {
        balance -= laptopPrice;
        balanceElement.innerText = balance;
        alert(`Congrats! You are now the owner of a ${laptopName}`)
    }
    else {
        alert('You need more money!')
    }
}


/*    EVENT LISTENERS
----------------------*/

loanBtnElement.addEventListener("click", handleLoan);
bankBtnElement.addEventListener("click", handleBank);
workBtnElement.addEventListener("click", handleWork);
laptopsElement.addEventListener("change", handleLaptopChange);
repayBtnElement.addEventListener("click",handleRepay );
buyBtnElement.addEventListener("click", handleBuy);
imageElement.addEventListener('error', () => {
    imageElement.src = "./assets/no-image.png"
})