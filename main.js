import './style.css'


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
