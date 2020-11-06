//Day of Week Variables
var sun = moment().startOf("week");
var sunForm = sun.format("YYYYMD");
var sunDisp = sun.format("M/D/YYYY");
var mon = moment(sun).add(1, "day");
var monForm = mon.format("YYYYMD");
var monDisp = mon.format("M/D/YYYY");
var tue = moment(sun).add(2, "day");
var tueForm = tue.format("YYYYMD");
var tueDisp = tue.format("M/D/YYYY");
var wed = moment(sun).add(3, "day");
var wedForm = wed.format("YYYYMD");
var wedDisp = wed.format("M/D/YYYY");
var thu = moment(sun).add(4, "day");
var thuForm = thu.format("YYYYMD");
var thuDisp = thu.format("M/D/YYYY");
var fri = moment(sun).add(5, "day");
var friForm = fri.format("YYYYMD");
var friDisp = fri.format("M/D/YYYY");
var sat = moment(sun).add(6, "day");
var satForm = sat.format("YYYYMD");
var satDisp = sat.format("M/D/YYYY");
var year = moment().year();

// variables for new event page
var days = document.getElementById("dayValue");
var daySelectInput = days.value;
var time = document.getElementById("timeValue");
var appointmentTime = time.value;
var duration = document.getElementById("durationValue");
var appointmentDuration = duration.value;
var eventTextArea = document.querySelector("#event-description");
var submitButton = document.querySelector("#event-btn-submit");
var eventArray = [];

submitButton.addEventListener("click", function () {
  if (JSON.parse(localStorage.getItem("event") !== null)) {
    eventArray = JSON.parse(localStorage.getItem("event"));
  } else {
    eventArray = [];
  }
  var event = {
    daySelect: days.value,
    timeSelect: time.value,
    durSelect: duration.value,
    eventText: eventTextArea.value.trim(),
  };
  eventArray.push(event);
  localStorage.setItem("event", JSON.stringify(eventArray));
  console.log(eventArray);
});

//Object Declaration
var weekdayArray = [
  {
    dateDay: "sun",
    dateHoli: sunForm,
    dateDisp: sunDisp,
    holiday: [],
    weather: {},
  },
  {
    dateDay: "mon",
    dateHoli: monForm,
    dateDisp: monDisp,
    holiday: [],
    weather: {},
  },
  {
    dateDay: "tue",
    dateHoli: tueForm,
    dateDisp: tueDisp,
    holiday: [],
    weather: {},
  },
  {
    dateDay: "wed",
    dateHoli: wedForm,
    dateDisp: wedDisp,
    holiday: [],
    weather: {},
  },
  {
    dateDay: "thu",
    dateHoli: thuForm,
    dateDisp: thuDisp,
    holiday: [],
    weather: {},
  },
  {
    dateDay: "fri",
    dateHoli: friForm,
    dateDisp: friDisp,
    holiday: [],
    weather: {},
  },
  {
    dateDay: "sat",
    dateHoli: satForm,
    dateDisp: satDisp,
    holiday: [],
    weather: {},
  },
];

//Holiday API Fetch
var holidayObject = {};
var holidayReturn = [];
var sunHolidays = {};
var monHolidays = {};
var tueHolidays = {};
var wedHolidays = {};
var thuHolidays = {};
var friHolidays = {};
var satHolidays = {};
var holidayArray = [];

var calendarificUrl =
  "https://calendarific.com/api/v2/holidays?&api_key=6e8b6a09a801368154e03d7f4180f3f6e0a237ce&country=US&year=" +
  year;

function holiday() {
  fetch(calendarificUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      for (var i = 0; i < data.response.holidays.length; i++) {
        holidayObject = {
          date:
            data.response.holidays[i].date.datetime.year.toString() +
            data.response.holidays[i].date.datetime.month.toString() +
            data.response.holidays[i].date.datetime.day.toString(),
          name: data.response.holidays[i].name,
        };
        holidayReturn.push(holidayObject);
      }
    })
    .then(function () {
      for (var i = 0; i < weekdayArray.length; i++) {
        for (var j = 0; j < holidayReturn.length; j++) {
          if (weekdayArray[i].dateHoli === holidayReturn[j].date) {
            weekdayArray[i].holiday.push(holidayReturn[j].name);
          }
        }
      }
      addHolidayMain(weekdayArray);
    });
}

//Function to Change Unix Time to Local Time
function toLocalDate(unixTime) {
  var unixDate = new Date(unixTime * 1000);
  return unixDate.toLocaleDateString("en-US");
}

//Open Weather API
var cityName = "";
var stateName = "";
var lattitude = "";
var longitude = "";
var key = "c2b19ce1b72a2b30136891642cb070b5";

if (localStorage.getItem("siteCity") === null) {
  cityName = "Denver";
  stateName = "Colorado";
} else {
  cityName = localStorage.getItem("siteCity");
  stateName = localStorage.getItem("siteState");
}

function weatherBalloon(city, state) {
  fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "," +
      state +
      "&units=imperial" +
      "&appid=" +
      key
  )
    .then(function (resp) {
      return resp.json();
    }) // Convert data to json
    .then(function (data) {
      lattitude = data.coord.lat;
      longitude = data.coord.lon;

      fetch(
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
          lattitude +
          "&lon=" +
          longitude +
          "&units=imperial&exclude=minutely,hourly,alerts" +
          "&appid=" +
          key
      )
        .then(function (response) {
          return response.json();
        })
        .then(function (oneCallData) {
          for (var i = 0; i < weekdayArray.length; i++) {
            for (var j = 0; j < oneCallData.daily.length; j++) {
              if (weekdayArray[i].dateDisp < moment().format("M/D/YYY")) {
                (weekdayArray[i].weather.date = weekdayArray[i].dateDisp),
                  (weekdayArray[i].weather.lowTemp = "N/A"),
                  (weekdayArray[i].weather.highTemp = "N/A"),
                  (weekdayArray[i].weather.uvIndex = "N/A"),
                  (weekdayArray[i].weather.windSpeed = "N/A"),
                  (weekdayArray[i].weather.icon =
                    "https://openweathermap.org/img/wn/01n@2x.png");
              } else if (
                weekdayArray[i].dateDisp ===
                toLocalDate(oneCallData.daily[j].dt)
              ) {
                (weekdayArray[i].weather.date = toLocalDate(
                  oneCallData.daily[j].dt
                )),
                  (weekdayArray[i].weather.lowTemp =
                    oneCallData.daily[j].temp.min),
                  (weekdayArray[i].weather.highTemp =
                    oneCallData.daily[j].temp.max),
                  (weekdayArray[i].weather.uvIndex = oneCallData.daily[j].uvi),
                  (weekdayArray[i].weather.windSpeed =
                    oneCallData.daily[j].wind_speed),
                  (weekdayArray[i].weather.icon =
                    "https://openweathermap.org/img/wn/" +
                    oneCallData.daily[j].weather[0].icon +
                    "@2x.png");
              }
            }
          }
          addWeatherMain(weekdayArray);
        });
    });
}

var siteCity = $("#siteCity");
var siteState = $("#siteState");
var userName = $("#user-name");
var userColor;
var userBadge = document.querySelector(".users");

$("#site-settings-btn-submit").click(function () {
  localStorage.setItem("siteCity", siteCity.val());
  localStorage.setItem("siteState", siteState.val());
  $("input[name=siteCity]").val("");
  $("input[name=siteState]").val("");

  $(".location").empty();

  var citySettingsDisplay = $("<p>");
  citySettingsDisplay.text("City: " + localStorage.getItem("siteCity"));
  $(".location").append(citySettingsDisplay);

  var stateSettingsDisplay = $("<p>");
  stateSettingsDisplay.text("State: " + localStorage.getItem("siteState"));
  $(".location").append(stateSettingsDisplay);
});

var colorArray;
colorArray = [
  "#EC7063",
  "#A569BD",
  "#5DADE2",
  "#58D68D",
  "#DC7633",
  "#5D6D7E",
  "#943126",
  "#5B2C6F",
  "#21618C",
  "#0E6655",
  "#A04000",
  "#717D7E",
  "#212F3D",
];

var userObject = [];
if (JSON.parse(localStorage.getItem("userNames") !== null)) {
  userObject = JSON.parse(localStorage.getItem("userNames"));
} else {
  userObject = [];
}

$("#new-user-btn-submit").click(function () {
  var iColor = userObject.length;
  userColor = colorArray[iColor];

  userObject.push({
    name: userName.val(),
    color: userColor,
  });

  var userObj = JSON.stringify(userObject);
  localStorage.setItem("userNames", userObj);
  $("input[name=userName]").val("");

  $(".users").empty();

  for (i = 0; i < userObject.length; i++) {
    $(".users").append(
      '<p class="userBadge"><span class="userBox" style="padding:2px;color:white;background-color:' +
        userObject[i].color +
        '">' +
        userObject[i].name +
        "</span></p>"
    );
  }
});

function addWeatherMain(weekdayArray) {
  $(".plannerHead").empty();
  $(".plannerHead").append("<th></th>");

  for (i = 0; i < weekdayArray.length; i++) {
    if (weekdayArray[i].dateDay === "sun") {
      $(".plannerHead").append(
        '<th class="tableHead sunTableHead">Sunday<br>' +
          weekdayArray[i].dateDisp +
          "<br>" +
          '<a href="./weatherSun.html"><img src="' +
          weekdayArray[i].weather.icon +
          '"></img></a>' +
          "</th>"
      );
    } else if (weekdayArray[i].dateDay === "mon") {
      $(".plannerHead").append(
        '<th class="tableHead monTableHead">Monday<br>' +
          weekdayArray[i].dateDisp +
          "<br>" +
          '<a href="./weatherMon.html"><img src="' +
          weekdayArray[i].weather.icon +
          '"></img></a>' +
          "</th>"
      );
    } else if (weekdayArray[i].dateDay === "tue") {
      $(".plannerHead").append(
        '<th class="tableHead tueTableHead">Tuesday<br>' +
          weekdayArray[i].dateDisp +
          "<br>" +
          '<a href="./weatherTue.html"><img src="' +
          weekdayArray[i].weather.icon +
          '"></img></a>' +
          "</th>"
      );
    } else if (weekdayArray[i].dateDay === "wed") {
      $(".plannerHead").append(
        '<th class="tableHead wedTableHead">Wednesday<br>' +
          weekdayArray[i].dateDisp +
          "<br>" +
          '<a href="./weatherWed.html"><img src="' +
          weekdayArray[i].weather.icon +
          '"></img></a>' +
          "</th>"
      );
    } else if (weekdayArray[i].dateDay === "thu") {
      $(".plannerHead").append(
        '<th class="tableHead thuTableHead">Thursday<br>' +
          weekdayArray[i].dateDisp +
          "<br>" +
          '<a href="./weatherThu.html"><img src="' +
          weekdayArray[i].weather.icon +
          '"></img></a>' +
          "</th>"
      );
    } else if (weekdayArray[i].dateDay === "fri") {
      $(".plannerHead").append(
        '<th class="tableHead friTableHead">Friday<br>' +
          weekdayArray[i].dateDisp +
          "<br>" +
          '<a href="./weatherFri.html"><img src="' +
          weekdayArray[i].weather.icon +
          '?weekday=fri"></img></a>' +
          "</th>"
      );
    } else if (weekdayArray[i].dateDay === "sat") {
      $(".plannerHead").append(
        '<th class="tableHead satTableHead">Saturday<br>' +
          weekdayArray[i].dateDisp +
          "<br>" +
          '<a href="./weatherSat.html"><img src="' +
          weekdayArray[i].weather.icon +
          '"></img></a>' +
          "</th>"
      );
    }
  }
}

function addHolidayMain(weekdayArray) {
  $(".holidayMain").empty();
  $(".holidayMain").append('<td class="left">Holidays</td>');

  for (i = 0; i < weekdayArray.length; i++) {
    if (weekdayArray[i].dateDay === "sun") {
      var holidayList = "";
      for (j = 0; j < weekdayArray[i].holiday.length; j++) {
        holidayList = holidayList + weekdayArray[i].holiday[j] + "<br>";
      }
      $(".holidayMain").append("<td>" + holidayList + "</td>");
    }

    if (weekdayArray[i].dateDay === "mon") {
      var holidayList = "";
      for (j = 0; j < weekdayArray[i].holiday.length; j++) {
        holidayList = holidayList + weekdayArray[i].holiday[j] + "<br>";
      }
      $(".holidayMain").append("<td>" + holidayList + "</td>");
    }

    if (weekdayArray[i].dateDay === "tue") {
      var holidayList = "";
      for (j = 0; j < weekdayArray[i].holiday.length; j++) {
        holidayList = holidayList + weekdayArray[i].holiday[j] + "<br>";
      }
      $(".holidayMain").append("<td>" + holidayList + "</td>");
    }

    if (weekdayArray[i].dateDay === "wed") {
      var holidayList = "";
      for (j = 0; j < weekdayArray[i].holiday.length; j++) {
        holidayList = holidayList + weekdayArray[i].holiday[j] + "<br>";
      }
      $(".holidayMain").append("<td>" + holidayList + "</td>");
    }

    if (weekdayArray[i].dateDay === "thu") {
      var holidayList = "";
      for (j = 0; j < weekdayArray[i].holiday.length; j++) {
        holidayList = holidayList + weekdayArray[i].holiday[j] + "<br>";
      }
      $(".holidayMain").append("<td>" + holidayList + "</td>");
    }

    if (weekdayArray[i].dateDay === "fri") {
      var holidayList = "";
      for (j = 0; j < weekdayArray[i].holiday.length; j++) {
        holidayList = holidayList + weekdayArray[i].holiday[j] + "<br>";
      }
      $(".holidayMain").append("<td>" + holidayList + "</td>");
    }

    if (weekdayArray[i].dateDay === "sat") {
      var holidayList = "";
      for (j = 0; j < weekdayArray[i].holiday.length; j++) {
        holidayList = holidayList + weekdayArray[i].holiday[j] + "<br>";
      }
      $(".holidayMain").append("<td>" + holidayList + "</td>");
    }
  }
}



window.addEventListener("load", function () {
  holiday();
  weatherBalloon(cityName, stateName);

  var citySettingsDisplay = $("<p>");
  citySettingsDisplay.text("City: " + localStorage.getItem("siteCity"));
  $(".location").append(citySettingsDisplay);

  var stateSettingsDisplay = $("<p>");
  stateSettingsDisplay.text("State: " + localStorage.getItem("siteState"));
  $(".location").append(stateSettingsDisplay);

  for (i = 0; i < userObject.length; i++) {
    $(".users").append(
      '<p class="userBadge"><span class="userBox" style="padding:2px;color:white;background-color:' +
        userObject[i].color +
        '">' +
        userObject[i].name +
        "</span></p>"
    );
  }

  for (i = 0; i < userObject.length; i++) {
    $(".userDropdown").append(
      '<option id="' +
        userObject[i].name +
        '">' +
        userObject[i].name +
        "</option>"
    );
  }
});
