import { createNewUser, changeUserLoggedInStatus } from "./apiCalls/fetchUsers.js";

// Global variables used by both events
const registerButton = document.getElementById("registerButton");
const signInButton = document.getElementById("signInButton");
const registerForm = document.getElementById("registerForm");
const signInForm = document.getElementById("signInForm");
const signInContainer = document.getElementById("signInContainer");
const registerContainer = document.getElementById("registerContainer");
const messageToUser = document.getElementById("messageToUser");

// Current date
const currentDate = new Date().toLocaleString([], {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

// Display the correct form (sign-in or register) based on which button is clicked
const displayForm = (buttonName) => {
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

// Listen for which button is clicked and show the correct form
registerButton.addEventListener("click", () => displayForm(registerButton.name));
signInButton.addEventListener("click", () => displayForm(signInButton.name));

// Function to validate form inputs and trim values
const validateAndTrimForm = (formElements) => {
  let isValid = true;

  formElements.forEach((input) => {
    const originalValue = input.value;
    const trimmedValue = originalValue.trim();

    console.log(`Original Value: '${originalValue}'`); // Log original value
    console.log(`Trimmed Value: '${trimmedValue}'`); // Log trimmed value

    // Check if required fields are empty
    if (input.hasAttribute("required") && trimmedValue === "") {
      isValid = false;
      input.classList.add("error"); // Add an error class to the invalid input
      input.setCustomValidity("This field cannot be empty or contain only spaces.");
    } else {
      input.classList.remove("error"); // Remove error class if input is valid
      input.setCustomValidity(""); // Clear any custom validity messages
    }

    // Assign the trimmed value back to the input
    input.value = trimmedValue;
  });

  return isValid;
};

// Register user functionality
const registerUser = async (e) => {
  e.preventDefault();

  const newUserEmail = document.getElementById("newUserEmail").value;
  const username = document.getElementById("newUsername").value;
  const newUserPassword = document.getElementById("newUserPassword").value;

  const inputsToValidate = [document.getElementById("newUserEmail"), document.getElementById("newUsername"), document.getElementById("newUserPassword")];

  const isFormValid = validateAndTrimForm(inputsToValidate);

  if (!isFormValid) {
    alert("Please make sure all required fields are filled in correctly.");
    return;
  }

  const usernameHasSpaces = /\s/.test(username);

  if (usernameHasSpaces) {
    alert("Username cannot contain spaces. Please enter a single word.");
    return;
  }

  if (newUserPassword.length < 8) {
    alert("Password must be at least 8 characters long");

  if (!newUserEmail.includes("@") || !newUserEmail.includes(".")) {
    alert("Invalid email address. Please enter a valid email (e.g., 'email@example.com').");
    return;
  }

  const userPayload = {
    userName: username,
    hashedPassword: newUserPassword,
    email: newUserEmail,
    createdOn: new Date().toISOString(),
    isLoggedIn: true,
  };

  try {
    const registeredUser = await createNewUser(userPayload);
    
    alert(`Registration was a success! Welcome ${registeredUser.userName}!`);

    localStorage.setItem(
      "currentUser",
      JSON.stringify({
        isLoggedIn: registeredUser.isLoggedIn,
        email: registeredUser.email,
      })
    );
    window.location.replace("/clientSide/index.html");

  } catch (error) {
    alert(`Registration failed: ${error.message}`);
    console.error("Failed to register user:", error);
  }
};

// Sign in user functionality
const signInUser = async (e) => {
  e.preventDefault();

  const userEmail = document.getElementById("userEmail").value;
  const userPassword = document.getElementById("userPassword").value;

  const inputsToValidate = [document.getElementById("userEmail"), document.getElementById("userPassword")];

  // Perform validation and trim whitespace
  const isFormValid = validateAndTrimForm(inputsToValidate);

  if (!isFormValid) {
    alert("Please make sure all required fields are filled in correctly.");
    return;
  }

  const credentials = { email: userEmail, password: userPassword };

  const authenticatedUser = await authenticateUser(credentials);

  if (authenticatedUser) {
    try {
      const updatedUser = await changeUserLoggedInStatus(authenticatedUser.user.email, true);
      console.log(authenticatedUser);
      localStorage.setItem("currentUser", JSON.stringify({ isLoggedIn: updatedUser.isLoggedIn, email: updatedUser.email }));
    } catch (error) {
      console.log(`Error changing ${userEmail} isLoggedIn status: ` + error);
    }
    alert(`You are now signed in. Welcome back ${authenticatedUser.user.userName}!`);

    window.location.replace("/clientSide/index.html");
  } else {
    console.error("Failed to log in the user");
    alert("User login failed. Please try again.");
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
  return await response.json();
};

// Register form submit event
registerForm.addEventListener("submit", (e) => registerUser(e));

// Sign-in form submit event
signInForm.addEventListener("submit", (e) => signInUser(e));
