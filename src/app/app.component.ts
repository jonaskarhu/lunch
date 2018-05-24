import { Component, OnInit } from '@angular/core';
import { DateService } from './date.service';
import { timer } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css',
              '../../node_modules/weather-underground-icons/dist/wu-icons-style.css?v=1.0.1'],
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
  wsymb: string = 'unknown';

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
    //this.weatherTest();
    this.continouslyUpdateWeatherIcon(600000);
  }

  // Private functions
//   private weatherTest () {
//     var request = new XMLHttpRequest();
//     request.responseType = 'json';
//     request.addEventListener("load", function() {
//         if ((this.readyState == 4) && (this.status == 200)) {
//             var jsonResponse = request.response;
//             //console.log(jsonResponse);
//             var temp = jsonResponse.value[0].value;
//             console.log("Temp: " + temp);
//         }
//     });
//     var url = 'https://opendata-download-metobs.smhi.se/'
//     var api = 'api/version/latest/'     // API version
//     var par = 'parameter/1/';           // Momentanvärde 1ggn/h
//     var gbg = 'station/71420/';         // Station Göteborg
//     var per = 'period/latest-hour/';    // Period
//     var fmt = 'data.json';              // Responsformat (json, xml, csv)
//     this.sendRequestThroughProxy(request, url + api + par + gbg + per + fmt);
//   }

  private continouslyUpdateWeatherIcon(millisecondsinterval) {
    var interval = timer(0, millisecondsinterval);
    interval.subscribe(() => this.getAndSetforecastIcon(this));
  }

  private getAndSetforecastIcon (t) {
    var request = new XMLHttpRequest();
    request.responseType = 'json';
    request.addEventListener("load", function() {
        if ((this.readyState == 4) && (this.status == 200)) {
            var jsonResponse = request.response;

            // Calculate the index of the forecast for the hour after this hour
            var d = new Date();
            var hour = d.getHours();
            var next_hour_index = 0;
            var re = new RegExp('T([0-9]{2}):');
            for (var i = 0; i < jsonResponse.timeSeries.length; ++i) {
                var forecast_hour = Number(re.exec(jsonResponse.timeSeries[i].validTime)[1])
                if (forecast_hour > hour) {
                    next_hour_index = i;
                    break;
                }
            }

            // Get the weather symbol value and map it to an appropriate weather icon
            var next_hr = jsonResponse.timeSeries[next_hour_index].parameters;
            for (var para = next_hr.length - 1; para > -1; --para) {
                if (next_hr[para].name == "Wsymb2") {
                    var curr_weather = '';
                    var weather_symbol_1_to_27 = next_hr[para].values[0];
                    switch (weather_symbol_1_to_27) {
                        // curr_weather is the explanation SMHI uses for the Wsymb2 values
                        // TODO: remove curr_weather from code and put into comment.
                        case 1:  {curr_weather = "Clear sky";               t.wsymb = 'clear'; break}
                        case 2:  {curr_weather = "Nearly clear sky";        t.wsymb = 'mostlysunny'; break}
                        case 3:  {curr_weather = "Variable cloudiness";     t.wsymb = 'mostlycloudy'; break}
                        case 4:  {curr_weather = "Halfclear sky";           t.wsymb = 'mostlycloudy'; break}
                        case 5:  {curr_weather = "Cloudy sky";              t.wsymb = 'cloudy'; break}
                        case 6:  {curr_weather = "Overcast";                t.wsymb = 'cloudy'; break}
                        case 7:  {curr_weather = "Fog";                     t.wsymb = 'fog'; break}
                        case 8:  {curr_weather = "Light rain showers";      t.wsymb = 'chancerain'; break}
                        case 9:  {curr_weather = "Moderate rain showers";   t.wsymb = 'rain'; break}
                        case 10: {curr_weather = "Heavy rain showers";      t.wsymb = 'rain'; break}
                        case 11: {curr_weather = "Thunderstorm";            t.wsymb = 'tstorms'; break}
                        case 12: {curr_weather = "Light sleet showers";     t.wsymb = 'chancesleet'; break}
                        case 13: {curr_weather = "Moderate sleet showers";  t.wsymb = 'sleet'; break}
                        case 14: {curr_weather = "Heavy sleet showers";     t.wsymb = 'sleet'; break}
                        case 15: {curr_weather = "Light snow showers";      t.wsymb = 'chanceflurries'; break}
                        case 16: {curr_weather = "Moderate snow showers";   t.wsymb = 'flurries'; break}
                        case 17: {curr_weather = "Heavy snow showers";      t.wsymb = 'flurries'; break}
                        case 18: {curr_weather = "Light rain";              t.wsymb = 'chancerain'; break}
                        case 19: {curr_weather = "Moderate rain";           t.wsymb = 'rain'; break}
                        case 20: {curr_weather = "Heavy rain";              t.wsymb = 'rain'; break}
                        case 21: {curr_weather = "Thunder";                 t.wsymb = 'tstorms'; break}
                        case 22: {curr_weather = "Light sleet";             t.wsymb = 'chancesleet'; break}
                        case 23: {curr_weather = "Moderate sleet";          t.wsymb = 'sleet'; break}
                        case 24: {curr_weather = "Heavy sleet";             t.wsymb = 'sleet'; break}
                        case 25: {curr_weather = "Light snowfall";          t.wsymb = 'chancesnow'; break}
                        case 26: {curr_weather = "Moderate snowfall";       t.wsymb = 'snow'; break}
                        case 27: {curr_weather = "Heavy snowfall";          t.wsymb = 'snow'; break}
                    }
                    break;
                }
            }
        }
    });
    var url = 'https://opendata-download-metfcst.smhi.se/'
    var api = 'api/category/pmp3g/version/2/'   // API version
    var geo = 'geotype/point/'                  // Point or Grid
    var lon = 'lon/11.934536/';                 // Longitude
    var lat = 'lat/57.690638/';                 // Latitude
    var fmt = 'data.json';                      // Response Format (json, xml, csv)
    this.sendRequestThroughProxy(request, url + api + geo + lon + lat + fmt);
  }

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
            var error = htmlDoc.getElementById("temp_unknownn");

            if ((temperature == "N/A°C") || (error != null)) {
                var regexp = new RegExp('Närmaste aktiva mätpunkt.*?([-]{0,1}[0-9]+,[0-9])&deg;C<\/a>', 'g');
                var result = regexp.exec(page);
                t.temp = result[1] + '°C';
            }
            else {
                t.temp = temperature;
            }
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
