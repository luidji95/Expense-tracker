'use strict';

// Pravimo klasu DataTime koju ce da nasledjuju obe klase (Income and Transaction jer ce nam isti podaci koje dobijamo iz metoda ove klase biti potrebni za svaku instancu i transakcije i incom-a)
class DataTimeClass {
    getCurrentTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }

    getCurrentDate() {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        return `${day}/${month}/${year}`;
    }
}

/* Kreiramo klasu Income sa svim neophodnim podacima  */
class Income extends DataTimeClass {
    constructor(incomeValue) {
        super();
        this.id = crypto.randomUUID();
        this.incomeValue = incomeValue;
        this.time = this.getCurrentTime();
        this.date = this.getCurrentDate();
    }
}

/*Kreiramo klasu Transaction sa svim neophodnim podacima */
class Transaction extends DataTimeClass {
    constructor(transactionName, transactionValue) {
        super();
        this.id = crypto.randomUUID();
        this.transactionName = transactionName;
        this.transactionValue = transactionValue;
        this.time = this.getCurrentTime();
        this.date = this.getCurrentDate();
    }
}

/* Pristupamo elementima sa kojima ce se vrsiti interakcija u programu */
const tableIncome = document.querySelector('.table-income');
const tableExpenses = document.querySelector('.table-transactions');

const addIncome = document.querySelector('.add-income');
const incomeInput = document.querySelector('.input-income');
const balance = document.querySelector('.balance-sum');

const addTransaction = document.querySelector('.add-transaction');
const transactionReason = document.querySelector('.input-transaction-reason');
const transactionAmount = document.querySelector('.input-transaction-amounth');
const expenses = document.querySelector('.exp-sum');

/* Klasa Manager napravljena radi lakseg upravljanja svim transakcijama i incom-ima koje imamo u nasem programu */
class Manager {
    constructor() {
        this.IncomeArray = [];
        this.TransactionsArray = [];
        this.totalBalance = 0;
        this.totalExpenses = 0;
    }

    // Dodavanje incom-a u array
    addIncomeToArray(income) {
        this.IncomeArray.push(income);
    }
    // Dodavanje Transaction-a u array
    addTransactionToArray(transaction) {
        this.TransactionsArray.push(transaction);
    }

    //Povecavamo balans za odredjeni iznos 
    increaseBalance(value) {
        return this.totalBalance += value;
    }

    // Smanjujemo balans 
    decreaseBalance(value) {
        return this.totalBalance -= value;
    }

    getTotalBalance() {
        return this.totalBalance;
    }

    // Renderujemo income tj sve income koje se nalaze u nizu 
    renderAllIncomes() {
        tableIncome.textContent = "";
        this.IncomeArray.forEach(income => {
            const html = `<div id="${income.id}" class="newIncome">
                <p>${income.incomeValue} $</p>
                <p>${income.time}</p>
                <p>${income.date}</p>
                <p class="delete-income">X</p>
            </div>`;
            tableIncome.insertAdjacentHTML("afterbegin", html);
        });
    }

    // Renderujemo sve transakcije iz niza transakcija
    renderAllTransactions() {
        tableExpenses.textContent = "";
        this.TransactionsArray.forEach(transaction => {
            const html = `<div id="${transaction.id}" class="newTransaction">
                <p>${transaction.transactionName}</p>
                <p>${transaction.transactionValue} $</p>
                <p>${transaction.time}</p>
                <p>${transaction.date}</p>
                <p class="delete-transaction">X</p>
            </div>`;
            tableExpenses.insertAdjacentHTML("afterbegin", html);
        });
    }

    increaseExpense(value) {
        return this.totalExpenses += value;
    }

    decreaseExpense(value) {
        return this.totalExpenses -= value;
    }

    canAffordTransaction(value) {
        return this.totalBalance >= value;
    }

    deleteIncome(id) {
        const incomeIndex = this.IncomeArray.findIndex(income => income.id === id);
        if (incomeIndex !== -1) {
            const income = this.IncomeArray[incomeIndex];
            this.decreaseBalance(income.incomeValue);
            this.IncomeArray.splice(incomeIndex, 1);
            this.renderAllIncomes();
            balance.textContent = this.getTotalBalance(); // Ažuriramo prikaz balansa
        }
    }
 
    deleteTransaction(id) {
        const transactionIndex = this.TransactionsArray.findIndex(transaction => transaction.id === id);
        if (transactionIndex !== -1) {
            const transaction = this.TransactionsArray[transactionIndex];
            this.increaseBalance(transaction.transactionValue);
            this.TransactionsArray.splice(transactionIndex, 1);
            this.renderAllTransactions();
            balance.textContent = this.getTotalBalance(); // Ažuriramo prikaz balansa
            expenses.textContent = this.totalExpenses -= transaction.transactionValue; // Ažuriramo prikaz troškova
        }
    }

    sortTransaction() {
        this.TransactionsArray.sort((a, b) => a.transactionName.localeCompare(b.transactionName));
        this.renderAllTransactions(); // Renderovanje nakon sortiranja
    }
}

const manager = new Manager();

// Funkcija za validaciju inputa
function validateInputs() {
    if (transactionReason.value.trim() !== "" && transactionAmount.value.trim() !== "") {
        addTransaction.disabled = false;
        addTransaction.classList.remove('disabled-button');
        addTransaction.classList.add('enabled-button');
    } else {
        addTransaction.disabled = true;
        addTransaction.classList.remove('enabled-button');
        addTransaction.classList.add('disabled-button');
    }
}

// Inicijalna validacija
validateInputs();

addIncome.addEventListener('click', function() {
    const value = parseInt(incomeInput.value);
    if (!isNaN(value)) {
        manager.increaseBalance(value);
        balance.textContent = manager.getTotalBalance();
        const newIncome = new Income(value);
        manager.addIncomeToArray(newIncome);
        manager.renderAllIncomes();
    } else {
        console.log('Uneta vrednost nije broj');
    }
});

addTransaction.addEventListener('click', function() {
    const reason = transactionReason.value;
    const sum = parseInt(transactionAmount.value);
    if (!isNaN(sum) && manager.canAffordTransaction(sum)) {
        manager.decreaseBalance(sum);
        balance.textContent = manager.getTotalBalance();
        expenses.textContent = manager.increaseExpense(sum);
        const newTransaction = new Transaction(reason, sum);
        manager.addTransactionToArray(newTransaction);
        manager.renderAllTransactions();
    } else {
        console.log('Nemate dovoljno sredstava ili uneta vrednost nije broj');
    }
});

tableIncome.addEventListener('click', function(ev) {
    if (ev.target.classList.contains('delete-income')) {
        const income = ev.target.closest('div');
        manager.deleteIncome(income.id);
    }
});

tableExpenses.addEventListener('click', function(ev) {
    if (ev.target.classList.contains('delete-transaction')) {
        const transaction = ev.target.closest('div');
        manager.deleteTransaction(transaction.id);
    }
});

const sortButton = document.querySelector('.sort');

sortButton.addEventListener('click', function() {
    manager.sortTransaction();
});

// Dodavanje događaja za validaciju inputa
transactionReason.addEventListener('input', validateInputs);
transactionAmount.addEventListener('input', validateInputs);
