import { Component, OnInit } from '@angular/core';
import { DateService } from './date.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DateService]
})

export class AppComponent implements OnInit {
  constructor() {}
  title = 'app';

  private ds = new DateService();

  date: string = 'N/A';
  restaurantsArray: Array<Array<string>> = [];

  ngOnInit() {
    //this.date = this.ds.getDate();
    this.fetchAndPushMenusHTML(
        this,
        "https://www.kvartersmenyn.se/find/_/city/19/sort/n_d/area/inom-vallgraven_81",
        [
            'Zaffran- A Taste of Persia',
            'Today sushi',
            'Thai Oriental',
            'SAK Restaurang',
            'Restaurang Sun Wall',
            'Old Persian',
            'La Piccola Gondola',
            'Kobe Sushi Bar',
            'John Scotts Palace',
            'Irish Embassy Downtown',
            'Harrys Göteborg',
            'Danilo Kungstorget'
        ],
        [
            'Irish Embassy Downtown',
            'Restaurang Sun Wall',
            'Today sushi',
            'Thai Oriental',
            'Kobe Sushi Bar'
        ]);
    this.fetchAndPushMenusHTML(
        this,
        "https://www.kvartersmenyn.se/find/_/city/0/keyword/0/area/nordstan_483",
        [
            'Asienköket i Nordstan',
            'Bon Vivant',
            'G Mat & Vin',
            'Restaurang Ullevigatan',
            'Saigon Asian Street Food',
            'Trattoria Prego'
        ],
        [
            'Asienköket i Nordstan'
        ]);
  }
  private checkFetched(theString) {
    if (this.restaurantsArray.length > 5){
        this.date = theString;
    }
  }
  private fetchAndPushMenusHTML(t, url, restaurantsToDisplay, restaurantsWithoutPrice) {
    var request = new XMLHttpRequest();
    request.addEventListener("load", function() {
        t.checkFetched("HTTP resp");
        if ((this.readyState == 4) && (this.status == 200) && (this.responseText !== undefined)) {
            var page = this.responseText;
            var parser = new DOMParser();
            var htmlDoc = parser.parseFromString(page, "text/html");
            var restaurants = htmlDoc.getElementsByClassName("row t_lunch");
            t.pushArray(restaurants, restaurantsToDisplay, restaurantsWithoutPrice);
        }
    })
    t.checkFetched("Trying HTTPreq");
    request.open("GET", url);
    request.send();
  }

  private pushArray(restaurants, restaurantsToDisplay, restaurantsWithoutPrice) {
    for (var i = 0; i < restaurants.length; i++) {
        var res = restaurants[i];
        var resName = res.getAttribute('data-name');
        var menu = res.getElementsByClassName('t_lunch')[2].innerHTML;
        var price = "";
        if (!restaurantsWithoutPrice.includes(resName)) {
            price = "<br>" + res.getElementsByClassName('t_lunch')[1].childNodes[1].innerHTML;
        }
        if (restaurantsToDisplay.includes(resName)) {
            this.restaurantsArray.push([resName, menu + price]);
        }
    }
  }
}
