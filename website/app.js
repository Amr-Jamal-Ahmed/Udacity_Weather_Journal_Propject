/* Global Variables */
// Personal API Key for OpenWeatherMap API
const apiKey = "16c10682747c2a4e2f74b90d48d37c7a&units=imperial";

//zip code input ele
const zipCodeInput = document.getElementById("zip");
// generate button
const generateBtn = document.getElementById("generate");
// entryHolder element
const entryHolder = document.getElementById("entry-holder");
// date element
const dateEle = document.getElementById("date");
// temp element
const tempEle = document.getElementById("temp");
// content element
const feelings = document.getElementById("feelings");

const leftArrow = document.querySelector(".left-arrow");
const rightArrow = document.querySelector(".right-arrow");

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth() + "." + d.getDate() + "." + d.getFullYear();

leftArrow.addEventListener("click", rotateCubeTo0Deg);

function rotateCubeTo0Deg(e) {
  e.stopPropagation();

  // console.log("pressed");
  if (
    e.currentTarget === leftArrow ||
    leftArrow === e.target ||
    e.target === generateBtn
  ) {
    const id = leftArrow.dataset.target;
    document.getElementById(`${id}`).classList.add("rotateY-0-deg");
    document.getElementById(`${id}`).classList.remove("rotateY-minus-90-deg");
  }
}

rightArrow.addEventListener("click", rotateCubeToMinus90Deg);

function rotateCubeToMinus90Deg(e) {
  e.stopPropagation();

  if (
    e.currentTarget === rightArrow ||
    e.target === rightArrow ||
    e.target === generateBtn
  ) {
    const id = rightArrow.dataset.target;
    document.getElementById(`${id}`).classList.add("rotateY-minus-90-deg");
    document.getElementById(`${id}`).classList.remove("rotateY-0-deg");
  }
}

// here is code for watch if zip code input element value changed or not
// if changed then remove error style from generateBtn ele if he has
zipCodeInput.addEventListener("input", removeErrorZipCodeMessage);

/**
 * @description - This is function used for print error zip code message
 */
function printErrorZipCode() {
  generateBtn.classList.add("error");
  generateBtn.innerHTML = "Invalid Zip Code";
}

/**
 * @description - This is function used for remove error zip code message
 */
function removeErrorZipCodeMessage() {
  generateBtn.classList.remove("error");
  generateBtn.innerHTML = "Generate";
}

// This
document.forms[0].addEventListener("submit", (e) => e.preventDefault());

// add event listner to generate button to call getWeatherData function when user click on it
generateBtn.addEventListener("click", handleGenerateBtnOnClick);

function handleGenerateBtnOnClick(e) {
  e.stopPropagation();

  let allData = {};

  if (e.currentTarget === generateBtn || e.target === generateBtn) {
    const zip = document.getElementById("zip").value;

    if (zip) {
      generateBtn.classList.add("loading");
      generateBtn.innerHTML = "Loading...";

      getWeatherData(zip)
        .then((data) => {
          if (data.cod === 200) {
            // console.log("data",data);
            const { main } = data;

            const { temp } = main;

            const feel = feelings.value;

            allData = {
              temp: temp,
              content: feel,
            };
            // console.log("allDataObj",allData);

            postAllData("/allData", allData)
              .then(() => {
                return retrieveData();
              })
              .then((allData) => {
                updateLayout({ ...allData, date: newDate });

                /*here in this line i remove loading class 
                  and reset innerHTML to default value
                  when request done and get response 
                */
                generateBtn.classList.remove("loading");
                generateBtn.innerHTML = "Generate";
                /*this is line for rotate cube to -90deg two view the other side of it 
                  which have print data to user
                */
                rotateCubeToMinus90Deg(e);
              })
              .catch((err) => {
                console.log(err);
                generateBtn.classList.remove("loading");
                generateBtn.innerHTML = "faild to generate try again";
                generateBtn.classList.add("error");
              });
          } else {
            generateBtn.classList.remove("loading");

            // start codeing for print error zip code message to user
            printErrorZipCode(true);
          }
        })
        .catch((err) => {
          console.log(err);
          generateBtn.classList.remove("loading");
          generateBtn.innerHTML = "faild to generate try again";
          generateBtn.classList.add("error");
        });
    }
  }
}

/**
 * @description - This is function for make request for oneWeatherMap application
 *                to get weather description and temprature
 * @param {Number} zip
 */
const getWeatherData = async (zip) => {
  // fetch openWeatherMap API Data
  const response = await fetch(
    `https://api.openweathermap.org/data/2.5/weather?zip=${zip},us&appid=${apiKey}`
  );

  return response.json();
};

/**
 * @description - This is function for make post request to server for sent weather data
 * @param {object} param0 - This is param is object that has temp prop and desciption prop
 * @return {object} - This is function return weather data object for as response from server
 */
const postAllData = (url, { temp, content }) => {
  // console.log("data for openweather api",temp,content);
  return fetch(`${url}`, {
    // Adding method type
    method: "POST",

    // Adding body or contents to send
    body: JSON.stringify({
      temp: temp,
      content: content,
    }),

    // Adding headers to the request
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response)
    .catch((err) => {
      console.log(err);
      return err;
    });
};

/**
 * @description - This is function used for return all data from
 *                server and update app UI with recieved data
 */
const retrieveData = () => {
  return fetch("/allData")
    .then((response) => response.json())
    .catch((err) => err);
};

fetch("/allData")
  .then((res) => res.json())
  .then((allData) => {
    // console.log("all",allData);
    updateLayout({ ...allData, date: newDate });
  })
  .catch((err) => err);
/**
 * @description - This is function used for update layout with
 *                new data coming from weatherData obj
 * @param {object} param0 - This param for take weatherData obj values
 */
function updateLayout({ date, temp, content }) {
  if (date && temp) {
    document.getElementById("title").innerHTML = "Most Recent Entry";
    Array.from(entryHolder.children).forEach((child) => {
      child.classList.remove("empty");
    });

    // here i am select textContent Dom ele that inside tempEle and changing it's content
    const dateEle = document.getElementById("date");
    changeContentTextContentDomEle(dateEle, date);

    // here i am select textContent Dom ele that inside tempEle and changing it's content
    const tempEle = document.getElementById("temp");
    temp = temp + " deg";
    changeContentTextContentDomEle(tempEle, temp);

    /* here i am select textContent Dom ele 
           that inside tempEle and changing it's content
        */
    const feelingsEle = document.getElementById("content");
    content = content || "your are't entered your feelings yet";
    changeContentTextContentDomEle(feelingsEle, content);
  }
}

/**
 * @description - This is function used for
 *                change content of textContent dom ele that inside his parent
 * @param {object} parent - This param for represent parent Element
 * @param {text} data - This param for take new data value
 */
function changeContentTextContentDomEle(parent, data) {
  const dateTextContentEle = parent.querySelector(".text-content");
  dateTextContentEle.innerHTML = `${data}`;
}
