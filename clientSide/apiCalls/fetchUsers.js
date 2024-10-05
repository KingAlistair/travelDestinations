const url = "http://127.0.0.1:3000/api/users";


// Register user
export async function createNewUser(userPayload) {
  const response = await fetch(url, {
    method: "POST",
    body: JSON.stringify(userPayload),
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Check if the response is not ok
  if (!response.ok) {
    const errorData = await response.json(); // Get error data from response
    throw new Error(errorData.error || 'Registration failed'); // Throw an error with the message
  }

  // If status is ok, return the response as JSON
  return await response.json();
}


// Authenticate user and handle error responses
export async function authenticateUser(credentials) {
  const response = await fetch(`${url}/authentication`, {
    method: "POST",
    body: JSON.stringify(credentials),
    headers: {
      "Content-Type": "application/json",
    },
  });

  // Check if response was successful
  if (response.ok) {
    return await response.json(); // Successful login, return user data
  } else {
    // Get error message from the response
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to authenticate user");
  }
}


// Changes user status in db, returns updated user
export async function changeUserLoggedInStatus(email, status) {
  try {
    const response = await fetch(`${url}/${email}/session/${status}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to toggle user status. Status code: ${response.status}`);
    }

    const user = await response.json();
    return user;
  } catch (error) {
    console.error("Error:", error);
  }
}

//GET user by email
export const getUserByEmail = async (email) => {
  const response = await fetch(`${url}/${email}`);
  const user = await response.json();
  return user;
};

//GET all users
export const getUsers = async () => {
  const response = await fetch(url);
  const users = await response.json();
  return users;
};
