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
    const email = currentUser.email;
    const user = await getUserByEmail(email);
    console.log("user", user);
    // console.log(email);

    document.getElementById("signInHeader").style.display = "none";
    document.getElementById("profileMenu").style.display = "flex";
    document.querySelector("#profileMenu h3").textContent = user.userName;
    document.getElementById("signUpButton").style.display = "none";
    document.getElementById("destinationsForms").style.display = "block";
    document.getElementById("CTAContainerWrapper").style.display = "none";
    // if (user && user.userName) {
    //   document.getElementById("heroHeader").textContent = `Welcome back ${user.userName}!`;
    //   document.getElementById("heroMessage").textContent = "Here you can keep a log of your travels and destinations. Scroll below to start!";
    // }
  } else {
    document.getElementById("signInHeader").style.display = "flex";
    document.getElementById("profileMenu").style.display = "none";
    document.getElementById("signUpButton").style.display = "flex";
    document.getElementById("destinationsForms").style.display = "none";
    document.getElementById("CTAContainerWrapper").style.display = "block";
    // document.getElementById("heroHeader").textContent = inherit;
    // document.getElementById("heroMessage").textContent = inherit;
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
    // await displayDestination(destination, destinationAuthor, currentUserStatus);
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
      wikiLink.textContent = "WIKIPEDIA LINK";
      let link = destination.link;

      // Check if link starts with 'http://' or 'https://'
      if (!/^https?:\/\//i.test(link)) {
        link = "https://" + link;
      }
      wikiLink.href = link;

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
      clone.querySelector(".login-button").addEventListener("click", () => {
        alert("Please log in or register to access this feature");
      });
    }
    document.getElementById("destinations").appendChild(clone);
  } else {
    console.log("No destinations to display");
    document.getElementById("destinations").textContent = "";
  }
};

// Edit a destination
const editDestination = async (e, destination) => {
  e.preventDefault();

  // Retrieve current user data
  const currentUserObject = localStorage.getItem("currentUser");
  const currentUser = JSON.parse(currentUserObject);

  // Use FormData to handle all fields
  const formData = new FormData();
  const imageInput = document.getElementById("editDestinationImageUrl");
  const imageFile = imageInput.files[0];

  // Append either the new file or the existing image path as a string
  if (imageFile) {
    formData.append("image", imageFile); // New image file
  } else {
    formData.append("image", destination.image); // Existing image path as a string
  }

  // Append other form fields
  formData.append("title", document.getElementById("editDestinationTitle").value || destination.title);
  formData.append("description", document.getElementById("editDestinationDescription").value || destination.description);
  formData.append("link", document.getElementById("editDestinationWikiLink").value || destination.link);
  formData.append("countryCode", document.getElementById("editDestinationCountryCode").value || destination.countryCode);
  formData.append("userEmail", currentUser.email);

  try {
    const response = await updateDestination(destination._id, formData);
    if (response.ok) {
      const updatedDestination = await response.json();
      console.log("updatedDestination", updatedDestination);
      alert(`The destination "${updatedDestination.title}" has been updated.`);

      // Reset the form and update the UI
      editDestinationForm.reset();
      editDestinationContainer.style.display = "none";
      addDestinationContainer.style.display = "flex";
      await loadUI();
    } else {
      console.log("Something is strange, but it works, kinda :/");
      window.location.reload(); // Yeah not the best, but if you don't change the image on edit it's buggy
    }
  } catch (error) {
    console.error("Failed to update destination:", error);
  }
};

// Load the edit form with destination data
const loadEditForm = async (destination) => {
  editDestinationForm.removeEventListener("submit", editDestination);
  addDestinationContainer.style.display = "none";
  editDestinationContainer.style.display = "flex";

  // Populate form fields with the existing destination data
  document.getElementById("editDestinationTitle").value = destination.title;
  document.getElementById("editDestinationDescription").value = destination.description;
  const imageInput = document.getElementById("editDestinationImageUrl");
  const imageUrl = destination.image ? `./destinationImages/${destination.image}` : "./photos/france.jpg";
  imageInput.placeholder = imageUrl;
  document.getElementById("editDestinationWikiLink").value = destination.link || "";
  document.getElementById("editDestinationCountryCode").value = destination.countryCode;

  // Show the existing image as background
  imageInput.style.backgroundImage = `url(${imageUrl})`;
  imageInput.style.backgroundSize = "cover";
  imageInput.style.backgroundPosition = "center";
  imageInput.style.backgroundRepeat = "no-repeat";

  // Add submit event listener to handle the edit submission
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
      //Remove jwt
      localStorage.removeItem("jwt");
      // Clear destination cards from the DOM
      document.getElementById("destinations").innerHTML = "";
      //update the UI
      await loadUI();
      // localStorage.removeItem("currentUser");
      alert("The user is now logged out");
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

  // Retrieve current user data
  const currentUserObject = localStorage.getItem("currentUser");
  const currentUser = JSON.parse(currentUserObject);
  console.log(currentUser);

  // Create form data
  const formData = new FormData();

  // Get form values
  const title = document.getElementById("destinationTitle").value;
  const description = document.getElementById("destinationDescription").value;
  const imageFile = document.getElementById("destinationImageUrl").files[0];
  const wikiLink = document.getElementById("destinationWikiLink").value;
  const countryCode = document.getElementById("destinationCountryCode").value;

  // Append form fields to formData
  formData.append("title", title);
  formData.append("description", description);
  formData.append("image", imageFile); // Append imageFile
  formData.append("link", wikiLink);
  formData.append("countryCode", countryCode);
  formData.append("userEmail", currentUser.email); // Add email to formData for backend validation

  try {
    // Post new destination with formData
    const response = await createDestination(formData);

    if (response) {
      alert(`${response.title} has been added to the destinations!`);
      document.getElementById("destinations").innerHTML = "";
      document.getElementById("addDestinationForm").reset();
      // document.getElementById("countryFlag").style.display = "none";

      // Update the UI
      console.log("Updating UI");

      // Clear the saved image from localStorage after submission
      localStorage.removeItem("uploadedImage");

      await loadUI();
    } else {
      console.log("Error with adding a destination");
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
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

// Add image to add input field as background
document.getElementById("destinationImageUrl").addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function (evt) {
    const img = new Image();
    img.onload = (e) => {
      const inputField = document.getElementById("destinationImageUrl");
      inputField.style.backgroundImage = `url(${img.src})`;

      // Add styling for the background image to fit
      inputField.style.backgroundSize = "cover";
      inputField.style.backgroundPosition = "center";
      inputField.style.backgroundRepeat = "no-repeat";
    };
    img.src = evt.target.result;
  };
  reader.readAsDataURL(file);
});

// Add image to edit destinaiton input field as background
document.getElementById("editDestinationImageUrl").addEventListener("change", (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();
  reader.onload = function (evt) {
    const img = new Image();
    img.onload = () => {
      const inputField = document.getElementById("editDestinationImageUrl");
      inputField.style.backgroundImage = `url(${img.src})`;
      inputField.style.backgroundSize = "cover";
      inputField.style.backgroundPosition = "center";
      inputField.style.backgroundRepeat = "no-repeat";
    };
    img.src = evt.target.result;
  };
  reader.readAsDataURL(file);
});
