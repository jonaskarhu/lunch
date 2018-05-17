import { Component, OnInit } from '@angular/core';
import { DateService } from './date.service';
import { timer } from 'rxjs';

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
  temp: string = '-°C';
  fetching: string = "Hämtar menyer...";
  restaurantsArray: Array<Array<string>> = [];

  ngOnInit() {
    this.date = this.ds.getDate();
    this.continouslyUpdateTemp(60000);
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

  // Private functions
  private sendRequestThroughProxy (HttpRequest, url) {
    HttpRequest.open("GET", "https://cors-anywhere.herokuapp.com/" + url, true);
    HttpRequest.send();
  }

  private continouslyUpdateTemp(millisecondsinterval) {
    var interval = timer(0, millisecondsinterval);
    interval.subscribe(() => this.getAndSetTemp(this));
  }

  private getAndSetTemp(t) {
    var request = new XMLHttpRequest();
    request.addEventListener("load", function() {
        if ((this.readyState == 4) && (this.status == 200) && (this.responseText !== undefined)) {
            var page = this.responseText;
            var parser = new DOMParser();
            var htmlDoc = parser.parseFromString(page, "text/html");
            var temperature = htmlDoc.getElementsByClassName("favoritTemp")[0].innerHTML;
            t.temp = temperature;
        }
    });
    this.sendRequestThroughProxy(request, "https://www.temperatur.nu/goteborg_ostra.html");
  }

  private fetchAndPushMenusHTML(t, url, restaurantsToDisplay, restaurantsWithoutPrice) {
    var request = new XMLHttpRequest();
    request.addEventListener("load", function() {
        if ((this.readyState == 4) && (this.status == 200) && (this.responseText !== undefined)) {
            var page = this.responseText;
            var parser = new DOMParser();
            var htmlDoc = parser.parseFromString(page, "text/html");
            var restaurants = htmlDoc.getElementsByClassName("row t_lunch");
            t.fetching = '';
            t.pushArray(restaurants, restaurantsToDisplay, restaurantsWithoutPrice);
        }
    });
    this.sendRequestThroughProxy(request, url);
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
