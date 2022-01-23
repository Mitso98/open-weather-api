const apiKey = "4e34c5f5b50cd0844a064f557fe59929";
let loading = false;

// error message above geenrate button
const mainError = ({ err, del = false }) => {
  // whether delte or show error
  del == false
    ? (document.getElementById("error-404").innerText =
        err + ", please enter correct zip of an American city")
    : (document.getElementById("error-404").innerText = "");
};

// post data to server
const postData = async (url = "", data = {}) => {
  const response = await fetch(url, {
    method: "POST",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    // Body data type must match "Content-Type" header
    body: JSON.stringify(data),
  });
  try {
    const newData = await response.json();
    return newData;
  } catch (error) {
    mainError({ err: error + ", failed posting data to server!" });
  }
};

// get data from UI then post it to server
const getUIData = () => {
  let zipCodeValue = 0;
  let feelingsValue = "";
  const zipCodeElm = document.getElementById("zip");
  const feelings = document.getElementById("feelings");
  const generateBtn = document.getElementById("generate");
  // validate user input
  zipCodeElm.addEventListener("change", (data) => {
    zipCodeValue = data.target.value;
    if (isNaN(zipCodeValue)) {
      return (document.getElementById("error-zip").innerText =
        "please enter a valid zip code!");
    } else {
      document.getElementById("error-zip").innerText = "";
    }
  });

  feelings.addEventListener(
    "change",
    (data) => (feelingsValue = data.target.value)
  );

  // get data from server and render it to UI
  const getFromServer = async () => {
    const res = await fetch("/safe");
    return res.json();
  };

  // creates new div this is made to support updateMostRecent
  const createNewDiv = (index, data, txt, collector) => {
    // use txt as a key to extract the right value from obj
    let key = txt;
    key = key.split(":");
    key = key[0].toLowerCase();

    newDiv = document.createElement("div");
    newDiv.innerText = txt + data[index][key];
    collector.appendChild(newDiv);
  };

  /*Update most recent*/
  const updateMostRecent = (data) => {
    const length = data.length > 3 ? 3 : data.length;
    const parentDiv = document.getElementById("entryHolder");

    let newDiv;
    parentDiv.innerHTML = "";
    for (let i = 0; i < length; i++) {
      let collector = document.createElement("div");

      createNewDiv(i, data, "Date: ", collector);
      createNewDiv(i, data, "Feelings: ", collector);
      createNewDiv(i, data, "Temp: ", collector);

      collector.style.marginTop = "20px";
      parentDiv.appendChild(collector);
    }
  };

  // fire submition to server
  generateBtn.addEventListener("click", () => {
    zipCodeValue === 0
      ? console.log("please enter a valid zip code")
      : fetch(
          `https://api.openweathermap.org/data/2.5/weather?zip=${zipCodeValue},us&appid=${apiKey}`
        )
          .then((res) => {
            res = res.json();
            return res;
          })
          .then((res) => {
            console.log(res.main.temp);
            if (res.cod == 404) {
              throw res.message;
            }
            return res;
          })
          .then((res) => {
            postData("/", {
              temp: Math.trunc(res.main.temp - 273.15),
              feelings: feelingsValue,
              date: Date(Date.now()).toString().split(" ").slice(0, 5).join(),
            }).catch((err) => mainError({ err: err + "posting data error" }));
          })
          .then(() => {
            return getFromServer();
          })
          .then((data) => {
            /*Update most recent section*/
            updateMostRecent(data);
          })
          .then(() => mainError({ del: true })) // finally DEL errors
          .catch((err) => {
            mainError({ err: err });
          });
  });
};

getUIData();
