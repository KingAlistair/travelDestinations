//import users and destinations
import { populateCountryDropdown, getCountryFlagUrl, getCountryNameByCode } from "./countries/countries.js";
import { changeUserLoggedInStatus, getUserByEmail, getUsers } from "./apiCalls/fetchUsers.js";
import { getAllDestinations, createDestination, deleteDestination, updateDestination } from "./apiCalls/fetchDestinations.js";

const destinationsContainer = document.getElementById("destinationsContainer");
const addDestinationForm = document.getElementById("addDestinationForm");
const editDestinationForm = document.getElementById("editDestinationForm");
const addDestinationContainer = document.getElementById("addDestinationContainer");
const editDestinationContainer = document.getElementById("editDestinationContainer");
//const countryFlag = document.getElementById("countryFlag");

//This function gets us the currentUser login status if there is one
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
      const user = await getUserByEmail(email);
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

const getUserFromLocalStorage = () => {
  const currentUserObject = localStorage.getItem("currentUser");
  const currentUser = JSON.parse(currentUserObject);
  return currentUser;
};

getUserFromLocalStorage();

const loadUI = async () => {
  //gets current logged in user if any
  //displays destinations
  const currentUserStatus = (await checkLoginStatus()) || false;
  console.log("currentUserStatus", currentUserStatus);
  await setupCountrySelector("destination");
  await setupCountrySelector("editDestination");
  editDestinationForm.reset();
  addDestinationForm.reset();
  if (currentUserStatus) {
    //if user is loggedin
    //adjusting header with user details to show/hide buttons and user email
    const currentUser = await getUserFromLocalStorage();

    document.getElementById("signInHeader").style.display = "none";
    document.getElementById("profileMenu").style.display = "flex";
    document.querySelector("#profileMenu h3").textContent = currentUser.email;
    document.getElementById("signUpButton").style.display = "none";
    document.getElementById("destinationsForms").style.display = "block";
    document.getElementById("CTAContainerWrapper").style.display = "none";
  } else {
    document.getElementById("signInHeader").style.display = "flex";
    document.getElementById("profileMenu").style.display = "none";
    document.getElementById("signUpButton").style.display = "flex";
    document.getElementById("destinationsForms").style.display = "none";
    document.getElementById("CTAContainerWrapper").style.display = "block";
  }
  await displayDestinations(currentUserStatus);
};

const displayDestinations = async (currentUserStatus) => {
  const allDestinations = await getAllDestinations();
  console.log("allDestinations", allDestinations);
  //also fetch users
  const allUsers = await getUsers();
  if (allDestinations.length > 0) {
    //loop through destinations and display each of them
    allDestinations.forEach((destination) => {
      const user = allUsers.find((user) => user._id === destination.userId);
      const destinationAuthor = user ? user.userName : "Unknown";
      displayDestination(destination, destinationAuthor, currentUserStatus);
    });
  } else {
    console.log("No destinations to display");
    await displayDestination(destination, destinationAuthor, currentUserStatus);
  }
};

const displayDestination = async (destination, destinationAuthor, currentUserStatus) => {
  if (destination) {
    let template = document.getElementById("destinationCardTemplate");
    let clone = template.content.cloneNode(true);
    //populate the template with data
    //adding fallback image if there is no image uploaded
    clone.querySelector(".destination-image").src = `./destinationImages/${destination?.image}` || "./photos/france.jpg";
    clone.querySelector(".destination-image").alt = `Image for ${destination.title}`;
    clone.querySelector(".destination-title").textContent = destination.title;
    clone.querySelector(".user-name").textContent = destinationAuthor;
    clone.querySelector(".destination-description").textContent = destination.description;

    //adding hidden or visible for the link div depending if there is data for it
    const wikiLink = clone.querySelector(".wiki-link");
    if (destination?.link && destination?.link !== "") {
      wikiLink.textContent = "Wiki link";
      wikiLink.href = destination?.link;
      // Make visible if there is a link
      clone.querySelector(".post-info").style.display = "flex";
    } else {
      // Hide if there is no link
      clone.querySelector(".post-info").style.display = "none";
    }
    // Conditionally show edit and delete buttons on the card if the user is logged in
    if (currentUserStatus) {
      clone.querySelector(".action-buttons").style.display = "flex";
      clone.querySelector(".login-button").style.display = "none";
      //add event listeners for the buttons here

      //NEED TO CONTINUE
      const editButton = clone.querySelector(".edit-btn");
      editButton.addEventListener("click", async () => loadEditForm(destination));

      // Delete destination functionality
      const deleteButton = clone.querySelector(".delete-btn");
      deleteButton.addEventListener("click", async () => {
        const confirmed = confirm(`Are you sure you want to delete the destination "${destination.title}"?`);
        if (confirmed) {
          const currentUserObject = localStorage.getItem("currentUser");
          const currentUser = JSON.parse(currentUserObject);
          try {
            await deleteDestination(destination._id, currentUser.email);

            // Find and remove the specific destination card from the DOM
            const destinationCard = deleteButton.closest(".destination-card"); // Find the card to remove
            if (destinationCard) {
              destinationCard.remove(); // Remove the specific card
            }
          } catch (error) {
            console.error(`Error deleting destination ${destination.title}: `, error);
            alert("An error occurred while deleting the destination. Please try again.");
          }
        }
      });
    } else {
      clone.querySelector(".action-buttons").style.display = "none";
      clone.querySelector(".login-button").style.display = "block";
      //event listener for add destination button here ? or just scroll to the top
    }
    document.getElementById("destinations").appendChild(clone);
  } else {
    console.log("No destinations to display");
    document.getElementById("destinations").textContent = "";
  }
};

const editDestination = async (e, destination) => {
  e.preventDefault();
  const currentUser = await getUserFromLocalStorage();

  const newTitle = document.getElementById("editDestinationTitle").value;
  const newDescription = document.getElementById("editDestinationDescription").value;
  const newImageURL = document.getElementById("editDestinationImageUrl").value;
  const newWikiLink = document.getElementById("editDestinationWikiLink").value;
  const newCountryCode = document.getElementById("editDestinationCountryCode").value;

  console.log("newTitle", newTitle);

  const updatedDestinationPayload = {
    title: newTitle !== "" ? newTitle : destination.title,
    description: newDescription !== "" ? newDescription : destination.description,
    image: newImageURL !== "" ? newImageURL : destination?.image,
    link: newWikiLink !== "" ? newWikiLink : destination?.link,
    countryCode: newCountryCode !== "" ? newCountryCode : destination.countryCode,
  };

  const updatedDataPayload = { destination: updatedDestinationPayload, email: currentUser.email };
  console.log("updatedDataPayload", updatedDataPayload);
  const updatedDestination = await updateDestination(destination._id, updatedDataPayload);

  if (updatedDestination) {
    document.getElementById("destinations").innerHTML = "";
    editDestinationForm.reset();
    editDestinationContainer.style.display = "none";
    addDestinationContainer.style.display = "flex";
    //countryFlag.style.display = "none";
    //update the UI
    console.log("updatedDestination", updatedDestination);
    await loadUI();
    alert(`The destination "${updatedDestination.title}" has been updated.`);
  } else {
    console.log("The destination could not be updated. Try again");
  }
  return updatedDestination;
};

//EDIT DESTINATION
const loadEditForm = async (destination) => {
  editDestinationForm.removeEventListener("submit", editDestination);
  addDestinationContainer.style.display = "none";
  editDestinationContainer.style.display = "flex";
  //set form input fields placeholders to destination values
  const newTitle = document.getElementById("editDestinationTitle");
  const newDescription = document.getElementById("editDestinationDescription");
  const newImageURL = document.getElementById("editDestinationImageUrl");
  const newWikiLink = document.getElementById("editDestinationWikiLink");
  const newCountryCode = document.getElementById("editDestinationCountryCode");

  newTitle.placeholder = destination.title;
  newTitle.value = destination.title;
  newDescription.placeholder = destination.description;
  newDescription.value = destination.description;
  newImageURL.placeholder = destination.image ? `./destinationImages/${destination?.image}` : "./photos/france.jpg";
  newImageURL.value = destination.image ? `./destinationImages/${destination?.image}` : "";
  newWikiLink.placeholder = destination?.link || "Wikipedia link";
  newWikiLink.value = destination?.link || "";
  newCountryCode.value = destination.countryCode;

  editDestinationForm.addEventListener("submit", async (e) => editDestination(e, destination));
};

//Sign-out functionality
const logout = async () => {
  // Get email from localStorage
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const currentUserEmail = currentUser.email;

  if (currentUserEmail && currentUserEmail !== "") {
    try {
      await changeUserLoggedInStatus(currentUserEmail, false);
      localStorage.setItem("currentUser", JSON.stringify({ isLoggedIn: false, email: "" }));
      // Clear destination cards from the DOM
      document.getElementById("destinations").innerHTML = "";
      //update the UI
      console.log("updating ui");
      await loadUI();
      // localStorage.removeItem("currentUser");
      alert("You are now logged out");
    } catch (error) {
      console.log(`Error changing ${userEmail} isLoggedIn status in database:` + error);
    }
  }
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
    document.getElementById("destinations").innerHTML = "";
    addDestinationForm.reset();
    // countryFlag.style.display = "none";
    //update the UI
    await loadUI();
    alert(`${createdDestination.title} has been added to the list of destinations!`);
  } else {
    console.log("not added");
  }
  return createdDestination;
};

const setupCountrySelector = async (formType) => {
  const countryDropdown = document.getElementById(`${formType}CountryCode`);
  // const countryFlag = document.getElementById(`${formType}CountryFlag`);

  if (!countryDropdown) return; // If the elements don't exist, exit || !countryFlag

  // Add event listener for country selection
  countryDropdown.addEventListener("change", function () {
    const selectedCode = this.value;
    // const flagUrl = getCountryFlagUrl(selectedCode);

    // // Update the flag image
    // if (selectedCode) {
    //   countryFlag.src = flagUrl;
    //   countryFlag.style.display = "block"; // Show flag
    // } else {
    //   countryFlag.style.display = "none"; // Hide flag
    // }
  });

  // Populate the country dropdown
  populateCountryDropdown(`${formType}CountryCode`);
  //`${formType}CountryFlag`
};

if (addDestinationForm) {
  //when the user clicks on create new destination
  addDestinationForm.addEventListener("submit", (e) => addDestination(e));
}
//ONLOAD call function to fetch user status
window.addEventListener("load", loadUI);
