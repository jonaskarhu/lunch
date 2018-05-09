import { Injectable } from '@angular/core'

export class DateService {
    getDate() {
        var d = new Date();
        var day = toDay(d.getDay().toString());
        var year = d.getFullYear().toString();
        var month = padSingles((d.getMonth() + 1).toString());
        var date = padSingles(d.getDate().toString());
        return day + " " + year + "-" + month + "-" + date;
    }
}

function toDay(day_int_string) {
    switch(day_int_string) {
        case "0":
            return "Söndag";
        case "1":
            return "Måndag";
        case "2":
            return "Tisdag";
        case "3":
            return "Onsdag";
        case "4":
            return "Torsdag";
        case "5":
            return "Fredag";
        case "6":
            return "Lördag";
    }
}

function padSingles(monthOrDay) {
    if (monthOrDay.length < 2) {
        return "0" + monthOrDay;
    }
    else {
        return monthOrDay;
    }
}