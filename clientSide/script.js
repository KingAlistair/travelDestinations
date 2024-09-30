//import users and destinations
const destinationsContainer = document.getElementById("destinationsContainer");

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
  //IF user is logged in:
  if (currentUserStatus) {
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

//ONLOAD call function to fetch user status
window.addEventListener("load", displayDestinations);
