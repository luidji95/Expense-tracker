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