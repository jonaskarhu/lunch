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
        this.date = theString;
  }
  private fetchAndPushMenusHTML(t, url, restaurantsToDisplay, restaurantsWithoutPrice) {
    // var request = new XMLHttpRequest();
    // request.addEventListener("load", function() {
    //     t.checkFetched("HTTP resp");
    //     if ((this.readyState == 4) && (this.status == 200) && (this.responseText !== undefined)) {
    //         var page = this.responseText;
    //         var parser = new DOMParser();
    //         var htmlDoc = parser.parseFromString(page, "text/html");
    //         var restaurants = htmlDoc.getElementsByClassName("row t_lunch");
    //         t.pushArray(restaurants, restaurantsToDisplay, restaurantsWithoutPrice);
    //         if (t.restaurantsArray.length > 1) {
    //             t.date = t.ds.getDate();
    //         }
    //     }
    // })
    var request = t.createCORSRequest("GET", url);

    request.onload = function () {
        t.checkFetched("HTTP resp");
        if ((this.readyState == 4) && (this.status == 200) && (this.responseText !== undefined)) {
            var page = this.responseText;
            var parser = new DOMParser();
            var htmlDoc = parser.parseFromString(page, "text/html");
            var restaurants = htmlDoc.getElementsByClassName("row t_lunch");
            t.pushArray(restaurants, restaurantsToDisplay, restaurantsWithoutPrice);
            if (t.restaurantsArray.length > 1) {
                t.date = t.ds.getDate();
            }
        }
    }

    t.checkFetched("Trying HTTPreq");
    if (!request) {
        console.log("Couldn't fetch from webpage!");
        alert("CORS is not supported!");
    }
    request.open("GET", url, true);
    request.send();
  }
  private createCORSRequest(method, url) {
    var xhr = new XMLHttpRequest();
    if ("withCredentials" in xhr) {
      // XHR for Chrome/Firefox/Opera/Safari.
      xhr.open(method, url, true);
    // } else if (typeof XDomainRequest != "undefined") {
    //   // XDomainRequest for IE.
    //   xhr = new XDomainRequest();
    //   xhr.open(method, url);
    } else {
      // CORS not supported.
      xhr = null;
    }
    return xhr;
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
