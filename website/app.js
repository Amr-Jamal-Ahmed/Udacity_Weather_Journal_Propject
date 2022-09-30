/* Global Variables */
// Personal API Key for OpenWeatherMap API
const apiKey = '16c10682747c2a4e2f74b90d48d37c7a&units=imperial';

// generate button
const generateBtn = document.getElementById("generate");
// entryHolder element
const entryHolder = document.getElementById("entry-holder");
// date element 
const dateEle = document.getElementById("date");
// temp element
const tempEle = document.getElementById("temp");
// content element
const feelings = document.getElementById("content");

const leftArrow = document.querySelector(".left-arrow");
const rightArrow = document.querySelector(".right-arrow");

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

leftArrow.addEventListener("click",rotateCubeTo0Deg);

function rotateCubeTo0Deg(e) {
    e.stopPropagation();

    // console.log("pressed");
    if(e.currentTarget === leftArrow || leftArrow === e.target) {
        const id = leftArrow.dataset.target;
        document.getElementById(`${id}`).classList.add("rotateY-0-deg");
        document.getElementById(`${id}`).classList.remove("rotateY-minus-90-deg");
    }
}

rightArrow.addEventListener("click",rotateCubeToMinus90Deg);

function rotateCubeToMinus90Deg(e) {
    e.stopPropagation();

    if(e.currentTarget === rightArrow || e.target === rightArrow) {
        const id = rightArrow.dataset.target;
        document.getElementById(`${id}`).classList.add("rotateY-minus-90-deg");
        document.getElementById(`${id}`).classList.remove("rotateY-0-deg");
    }
}


document.forms[0].addEventListener("submit",e=> e.preventDefault());

// add event listner to generate button to call getWeatherData function when user click on it
generateBtn.addEventListener("click",handleGenerateBtnOnClick);

function handleGenerateBtnOnClick(e) {
    e.stopPropagation();

    if(e.currentTarget === generateBtn || e.target === generateBtn) {
        const zip= document.getElementById("zip").value;

        if(zip) {
            generateBtn.classList.add("loading-animation");

            getWeatherData(zip)
            .then(data => {
                const {main} = data;
            
                const {temp} = main;
            
                const weatherData = {
                    temp : temp
                };
            
                // console.log(weatherData);    
    
                generateBtn.classList.remove("loading-animation");
    
                document.getElementById(`cube`).classList.add("rotateY-minus-90-deg");
                document.getElementById(`cube`).classList.remove("rotateY-0-deg");

                const feel = (feelings.value)? feelings.value : "your are't entered your feelings";

                const allData = {
                    date : newDate,
                    temp : 30,
                    feel : feel,
                };
                updateLayout(allData);
            })
            .catch(err => {
                console.log(err);
            });
        }

        // const url = "https://localhost:3001";
    
        // postWeatherData(url,weatherData);
    
        // retrieveData();
    }
}

/**
 * @description - This is function for make request for oneWeatherMap application to get weather description and temprature
 * @param {Number} zip 
 */
const getWeatherData = async (zip) =>{
    // fetch openWeatherMap API Data
    const response = 
    await fetch(`https://api.openweathermap.org/data/2.5/weather?zip=${zip},us&appid=${apiKey}`);

    return response.json();
};


/**
 * @description - This is function for make post request to server for sent weather data
 * @param {object} param0 - This is param is object that has temp prop and desciption prop
 * @return {object} - This is function return weather data object for as response from server
 */
const postWeatherData = (url,{temp,description}) => {
    fetch(`${url}`,{
        // Adding method type
        method: "POST",
        
        // Adding body or contents to send
        body: JSON.stringify({
            temp: temp,
            description: description,
        }),
        
        // Adding headers to the request
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    })
    .then(response => response.json())
    .catch(err => console.log(err));
}

/**
 * @description - This is function used for return all data from server and update app UI with recieved data
 */
const retrieveData = ()=> {
    fetch("/all")
    .then(response => response.json())
    .then(allData => {
        updateLayout(allData);
    })
    .catch(err => console.log(err));
}

function updateLayout({date,temp,feel}) {

    if(date && temp && feel) {
        document.getElementById("title").innerHTML = 'Most Recent Entry';

        Array.from(entryHolder.children)
        .forEach( child => {
            child.classList.remove("empty");
        });

        document.getElementById("date").innerHTML += date;
        document.getElementById('temp').innerHTML += Math.round(temp) +' deg';
        document.getElementById('content').innerHTML += feel;
    }
}