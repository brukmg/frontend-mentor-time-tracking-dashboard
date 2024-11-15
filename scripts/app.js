// get elements to be manipulated
const mainSection = document.getElementById("main-section");
const loadingIndicator = document.getElementById("loading-indicator");
const filters = document.querySelectorAll("li");

//a variable that holds data to be filtered based on user event
let data;

// after page finished loading getData function will be called
window.onload = function () {
  getData();
};

// a function that fetch data from external source
const getData = () => {
  fetch("https://brukmg.github.io/frontend-mentor-time-tracking-dashboard/data.json")
    .then((response) => response.json())
    .then((json) => {
      loadingIndicator.setAttribute("style", "display: none"); // after success full data fetch loading indicator should not be shown
      data = json; //storing a data for later filtering use
      json.forEach((element) => { // appending cards for each responded data
        const { title, timeframes } = element;
        const cardId = title.replace(" ", "-").toLowerCase();
        mainSection.insertAdjacentHTML(
          "beforeend",
          `<div class="activity-card" id="${cardId}">
                <div class="activity-content">
                  <div class="top">
                    <p class="activity-label text-white">${title}</p>
                    <img src="./images/icon-ellipsis.svg" alt="" />
                  </div>
                  <div class="time-wrapper">
                    <p class="activity-time text-white" id="${cardId}-current">${timeframes.daily.current}hrs</p>
                    <p class="previous-time text-light" id="${cardId}-previous">Yesterday - ${timeframes.daily.previous}hrs</p>
                  </div>
                </div>
              </div>`
        );
      });
    })
    .catch((err) => {
      loadingIndicator.innerHTML =
        "Something went wrong, please try again later.";
      console.log(err);
    });
};

// adding filtering logic for each filter element click event
filters.forEach((element) => {
  element.onclick = function () {
    filters.forEach((el) => el.classList.remove("active"));
    this.classList.add("active");
    const filterBy = this.getAttribute("filter-by");
    data.forEach((element) => {
      const { title, timeframes } = element;
      const cardId = title.replace(" ", "-").toLowerCase();
      const current = document.getElementById(`${cardId}-current`);
      const previous = document.getElementById(`${cardId}-previous`);
      current.innerHTML = `${timeframes[filterBy].current}hrs`;
      previous.innerHTML = `${getPreviousPrefix(filterBy)} ${
        timeframes[filterBy].previous
      }hrs`;
    });
  };
});

// a function that returns previous prefix text for previous
const getPreviousPrefix = (filterBy) => {
  switch (filterBy) {
    case "daily":
      return "Yesterday";
    case "weekly":
      return "Last Week";
    case "monthly":
      return "Last Month";
    default:
      break;
  }
};
