//import users and destinations here
import { checkLoginStatus } from "./script.js";
import { populateCountryDropdown, getCountryFlagUrl } from "./countries/countries.js";
//global variables used by both events
const registerButton = document.getElementById("registerButton");
const addDestinationContainer = document.getElementById("addDestinationContainer");
const userAccessContainer = document.getElementById("userAccessContainer");
const registerForm = document.getElementById("registerForm");
const signInForm = document.getElementById("signInForm");
const addDestinationForm = document.getElementById("addDestinationForm");
const signInContainer = document.getElementById("signInContainer");
const signInMessage = document.getElementById("signInMessage");
const registerMessage = document.getElementById("registerMessage");
const countryDropdown = document.getElementById("destinationCountryCode");
const countryFlag = document.getElementById("countryFlag");

const currentUserLogin = (await checkLoginStatus()) || false;

const currentDate = new Date().toLocaleString([], {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: undefined,
});

//if the user clicks on the register button, we hide the messages hinting at signing in or register
const displayRegisterForm = () => {
  signInMessage.classList.add("hidden");
  registerMessage.classList.add("hidden");
  registerForm.classList.remove("hidden");
  registerButton.classList.add("hidden");
  signInContainer.classList.add("hidden");
};
//listen for register button
registerButton.addEventListener("click", displayRegisterForm);

const registerUser = async (e) => {
  //clear local storage to make sure this doesn't cause troubles
  localStorage.clear();
  //avoid reloading the page
  e.preventDefault();
  //read input values
  const newUserEmail = document.getElementById("newUserEmail").value;
  const username = document.getElementById("newUsername").value;
  const newUserPassword = document.getElementById("newUserPassword").value;

  if (newUserEmail === "" || username === "" || newUserPassword === "") {
    alert("Please make sure you have entered all required fields.");
    console.log(newUserEmail, username, newUserPassword);
  } else if (newUserPassword.length < 8) {
    alert("Password must be at least 8 characters long");
  } else if (!newUserEmail.includes("@") || !newUserEmail.includes(".")) {
    alert("This email address is invalid. Please make sure to enter a valid email address. Example: 'email@example.com'");
  } else {
    alert(`User registered successfully. Welcome ${username}!`);
    //POST request to create the user - createUser()
    const userPayload = {
      userName: username,
      hashedPassword: newUserPassword,
      email: newUserEmail,
      cretedOn: currentDate,
      // lastLoggedIn: currentDate,
      isLoggedIn: true,
    };
    const registeredUser = await createNewUser(userPayload);
    //update local storage with user email and login status
    localStorage.setItem("currentUser", JSON.stringify({ isLoggedIn: registeredUser.isLoggedIn, email: registeredUser.email }));
    //when all is good and the user is registered, display the create a new destination form
    displayCreateForm(true);
  }
};

const createNewUser = async (userPayload) => {
  //send request to backend using the endpoint for users
  const response = await fetch("http://localhost:3000/api/users", {
    method: "POST",
    body: JSON.stringify(userPayload),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const registeredUser = await response.json();
  console.log("registeredUser", registeredUser);
  return registeredUser;
};

const signInUser = async (e) => {
  localStorage.clear();
  //avoid reloading the page
  e.preventDefault();
  const userEmail = document.getElementById("userEmail").value;
  const userPassword = document.getElementById("userPassword").value;
  if (userEmail === "" || userPassword === "") {
    alert("Please make sure you have entered all required fields.");
  } else {
    //POST to authenticate user
    const credentials = { email: userEmail, password: userPassword };
    const authenticatedUser = await authenticateUser(credentials);
    alert(`You are now signed in. Welcome back ${authenticatedUser.user.userName}!`);
    console.log("authenticatedUser", authenticatedUser);
    localStorage.setItem("currentUser", JSON.stringify({ isLoggedIn: authenticatedUser.user.isLoggedIn, email: authenticatedUser.user.email }));
    displayCreateForm(true);
  }
};

const authenticateUser = async (credentials) => {
  const response = await fetch("http://localhost:3000/api/users/authentication", {
    method: "POST",
    body: JSON.stringify(credentials),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const authenticatedUser = await response.json();
  console.log("authenticatedUser", authenticatedUser);
  return authenticatedUser;
};

const addDestination = async (e) => {
  e.preventDefault();
  const currentUserObject = localStorage.getItem("currentUser");
  const currentUser = JSON.parse(currentUserObject);
  console.log(currentUser);
  const title = document.getElementById("destinationTitle").value;
  const description = document.getElementById("destinationDescription").value;
  const imageURL = document.getElementById("destinationImageUrl").value;
  const wikiLink = document.getElementById("destinationWikiLink").value;
  const countryCode = document.getElementById("destinationCountryCode").value;

  const destinationPayload = {
    title: title,
    description: description,
    image: imageURL,
    link: wikiLink,
    countryCode: countryCode,
  };

  const payload = { destination: destinationPayload, userEmail: currentUser.email };
  console.log("payload", payload);
  const createdDestination = await createDestination(payload);

  if (createdDestination) {
    alert(`${createdDestination.title} has been added to the list of destinations!`);
  } else {
    alert(`${createdDestination.title} could not be added`);
  }
  return createdDestination;
};

const createDestination = async (payload) => {
  const response = await fetch(`http://localhost:3000/api/destinations`, {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const createdDestination = await response.json();
  console.log("createdDestination", createdDestination);
  return createdDestination;
};

//when register form is submitted
registerForm.addEventListener("submit", (e) => registerUser(e));
//if user signs in - displayed by default
signInForm.addEventListener("submit", (e) => signInUser(e));
//when the user clicks on create new destination
addDestinationForm.addEventListener("submit", (e) => addDestination(e));
//on reload check if the user is still logged in
const displayCreateForm = async (currentUserLogin) => {
  if (currentUserLogin === true) {
    console.log(currentUserLogin);
    addDestinationContainer.classList.remove("hidden");
    addDestinationContainer.classList.add("formContainer");
    userAccessContainer.classList.remove("formContainer");
    userAccessContainer.classList.add("hidden");
  } else if (currentUserLogin === false) {
    addDestinationContainer.classList.remove("formContainer");
    addDestinationContainer.classList.add("hidden");
    userAccessContainer.classList.remove("hidden");
  }
};
window.addEventListener("load", () => displayCreateForm(currentUserLogin));

//Populate Country select with countries
populateCountryDropdown(countryDropdown);

// Event listener to handle country selection and flag display
countryDropdown.addEventListener("change", function () {
  const selectedCode = this.value;
  console.log("Selected country code:", selectedCode);

  const flagUrl = getCountryFlagUrl(selectedCode);

  // Update the flag image source and display it
  if (selectedCode) {
    countryFlag.src = flagUrl;
    countryFlag.style.display = "block"; // Show the flag image
  } else {
    countryFlag.style.display = "none"; // Hide the flag image if no country is selected
  }
});
