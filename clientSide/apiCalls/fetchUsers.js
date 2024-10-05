const url = "http://127.0.0.1:3000/api/users";

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
