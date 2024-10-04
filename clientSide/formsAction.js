import { changeUserLoggedInStatus } from "./apiCalls/fetchUsers.js";

//global variables used by both events
const registerButton = document.getElementById("registerButton");
const signInButton = document.getElementById("signInButton");
const registerForm = document.getElementById("registerForm");
const signInForm = document.getElementById("signInForm");
const signInContainer = document.getElementById("signInContainer");
const registerContainer = document.getElementById("registerContainer");
const messageToUser = document.getElementById("messageToUser");

//const currentUserLogin = (await checkLoginStatus()) || false;

const currentDate = new Date().toLocaleString([], {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: undefined,
});

//if the user clicks on the register button, we hide the messages hinting at signing in or register
const displayForm = (buttonName) => {
  console.log(buttonName);
  if (buttonName === "signIn") {
    signInContainer.classList.remove("hidden");
    registerContainer.classList.add("hidden");
    messageToUser.textContent = "Please sign in to add a new destination";
  } else if (buttonName === "register") {
    registerContainer.classList.remove("hidden");
    signInContainer.classList.add("hidden");
    messageToUser.textContent = "Please register to add a new destination";
  }
};
//listen for which button is clicked and show the right form
registerButton.addEventListener("click", () => displayForm(registerButton.name));
signInButton.addEventListener("click", () => displayForm(signInButton.name));

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
      createdOn: currentDate,
      // lastLoggedIn: currentDate,
      isLoggedIn: true,
    };
    const registeredUser = await createNewUser(userPayload);
    if (registeredUser) {
      //update local storage with user email and login status
      localStorage.setItem("currentUser", JSON.stringify({ isLoggedIn: registeredUser.isLoggedIn, email: registeredUser.email }));
      window.location.replace("/clientSide/index.html");
    } else {
      console.error("Failed to register user", response.statusText);
      alert("Registration failed. Please try again.");
    }
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
    if (authenticatedUser) {

      // Try to change user loggedIn status in db.
      try {
      await changeUserLoggedInStatus(userEmail, true);
      } catch (error) {
        console.log(`Error changing ${userEmail} isLoggedIn status in database:` + error)
      }
      alert(`You are now signed in. Welcome back ${authenticatedUser.user.userName}!`);
      console.log("authenticatedUser", authenticatedUser);
      localStorage.setItem("currentUser", JSON.stringify({ isLoggedIn: authenticatedUser.user.isLoggedIn, email: authenticatedUser.user.email }));
      window.location.replace("/clientSide/index.html");
    } else {
      console.error("Failed to log in the user", response.statusText);
      alert("User log in failed. Please try again.");
    }
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
  const newlyAuthenticatedUser = await response.json();
  console.log("authenticatedUser!", newlyAuthenticatedUser);

  return newlyAuthenticatedUser;
};

//when register form is submitted
registerForm.addEventListener("submit", (e) => registerUser(e));
//if user signs in - displayed by default
signInForm.addEventListener("submit", (e) => signInUser(e));
