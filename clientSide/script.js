//import users and destinations
import { populateCountryDropdown, getCountryFlagUrl } from "./countries/countries.js";
import { changeUserLoggedInStatus } from "./apiCalls/fetchUsers.js";

const destinationsContainer = document.getElementById("destinationsContainer");
const countryDropdown = document.getElementById("destinationCountryCode");
const countryFlag = document.getElementById("countryFlag");
const addDestinationForm = document.getElementById("addDestinationForm");
const addDestinationContainer = document.getElementById("addDestinationContainer");
const template = document.getElementById("destinationTemplate");

//FETCH userStatus - checking with local storage too
export const checkLoginStatus = async () => {
  let isLoggedIn;
  //check if there is a currentUser stored
  const currentUserObject = localStorage.getItem("currentUser");
  if (currentUserObject) {
    //if there is, retrieve the status from local storage
    const currentUser = JSON.parse(currentUserObject);
    isLoggedIn = currentUser.isLoggedIn;
    return isLoggedIn;
  } else {
    //otherwise if there is an email saved, get the user from the database and get their login status + store it in local storage
    const email = currentUserObject?.email;
    console.log("email, if any", email);
    if (email) {
      const response = await fetch(`http://localhost:3000/api/users/email/${email}`);
      const user = await response.json();
      if (user) {
        isLoggedIn = user.isLoggedIn;
        localStorage.setItem("currentUser", JSON.stringify({ isLoggedIn: user.isLoggedIn, email: user.email }));
      }
      console.log("isLoggedIn?", user.isLoggedIn);
      return isLoggedIn;
    }
    //if there is no currentUser, set the loginStatus as false and store it
    localStorage.setItem("currentUser", JSON.stringify({ isLoggedIn: false, email: "" }));
    console.log("User not found in local storage. Default isLoggedIn set to false.");
  }
  console.log("isLoggedIn?", isLoggedIn);
  return isLoggedIn;
};

//FECTH destinations
const getAllDestinations = async () => {
  const response = await fetch("http://localhost:3000/api/destinations");
  const retrievedDestinations = await response.json();
  return retrievedDestinations;
};

const displayDestinations = async () => {
  const currentUserStatus = (await checkLoginStatus()) || false;
  console.log("currentUserStatus", currentUserStatus);
  const allDestinations = await getAllDestinations();
  console.log(allDestinations);

  allDestinations.forEach((destination) => {
    //Create card using template
    const card = document.importNode(template.content, true);

    //populate the template with data
    card.querySelector("#destinationImage").src = destination.image;
    card.querySelector("#destinationTitle").textContent = destination.title;
    card.querySelector("#userName").textContent = destination.userName;
    card.querySelector("#destinationDescription").textContent = destination.description;
    card.querySelector("#wikiLink").href = destination.link;
  

  // If user is logged in, show edit and delete buttons
  if (currentUserStatus) {
    card.querySelector(".edit-btn").style.display = "inline";
    card.querySelector(".delete-btn").style.display = "inline";

    //Event listeners for edit and delete buttons
    card.querySelector(".edit-btn").addEventListener("click", () => {
      console.log("Edit destination:", destination);
      //Add edit functionality here
    });

    card.querySelector(".delete-btn").addEventListener("click", async () => {
      const confirmDelete = confirm("Are you sure you want to delete this destination?");
      if (confirmDelete) {
        await deleteDestination(destination._id);
        await displayDestinations(); //refresh the display after deleting
      }
    });
  } else {
    // If user is not logged in, hide edit and delete buttons
    card.querySelector(".edit-btn").style.display = "none";
    card.querySelector(".delete-btn").style.display = "none";
  }
  destinationsContainer.appendChild(card);
  });

  //IF user is logged in:
  if (currentUserStatus) {
    //NEED TO BE REWORKED
    //adjusting header with user details to show/hide buttons and user email
    const currentUserObject = localStorage.getItem("currentUser");
    const currentUser = JSON.parse(currentUserObject);
    console.log(currentUser.email);
    document.getElementById("sign-in").classList.add("hidden");
    document.getElementById("profile-menu").classList.remove("hidden");
    document.querySelector("#profile-menu h3").textContent = currentUser.email;
    allDestinations.forEach((destination) => {
      //display destinations including edit and delete button + profile icon
      //we will use a template for this
    });
  } else {
    //IF user is not logged in:
    //display destinations not including edit or delete button or profile icon
    //we will use a template for this
  }
};
//Sign-out functionality
const logout = async() => {

  // Get email from localStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const currentUserEmail = currentUser.email;

  if (currentUserEmail) {
  try {
    await changeUserLoggedInStatus(currentUserEmail, false);
    } catch (error) {
      console.log(`Error changing ${userEmail} isLoggedIn status in database:` + error)
    };
  };

  localStorage.removeItem("currentUser");
  alert("You are now logged out");
  document.getElementById("sign-in").classList.remove("hidden");
  document.getElementById("profile-menu").classList.add("hidden");
};

const signOutButton = document.getElementById("signOutButton");
if (signOutButton) {
  signOutButton.addEventListener("click", () => {
    logout();
  });
}

//ADD destination
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
  //NEEDS TO BE ADJUSTED
  if (createdDestination) {
    alert(`${createdDestination.title} has been added to the list of destinations!`);
  } else {
    console.log("not added");
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

// Event listener to handle country selection and flag display
if (countryDropdown) {
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
  //Populate Country select with countries
  populateCountryDropdown(countryDropdown);
}
if (addDestinationForm) {
  //when the user clicks on create new destination
  addDestinationForm.addEventListener("submit", (e) => addDestination(e));
}
//ONLOAD call function to fetch user status
window.addEventListener("load", displayDestinations);
