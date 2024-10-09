const url = "http://127.0.0.1:3000/api/destinations";

// Helper function to get JWT from localStorage
function getAuthHeaders() {
  const token = localStorage.getItem('jwt'); // Retrieve JWT from localStorage
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
}

// FETCH all destinations with Authorization header
export const getAllDestinations = async () => {
  const response = await fetch(url, {
    method: 'GET',
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error('Failed to fetch destinations');
  }

  return await response.json(); // Parse and return JSON data
};


// CREATE destination
export const createDestination = async (formData) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('jwt')}` // Include Authorization header for JWT
      // No Content-Type because FormData will automatically set it to multipart/form-data
    },
    body: formData // Send the FormData directly
  });

  if (response.status === 401) {
    alert('Unauthorized, please log in.');
    window.location.href = '/clientSide/formsPage.html';
  }

  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }

  const createdDestination = await response.json();
  console.log("createdDestination", createdDestination);
  return createdDestination;
};

// DELETE destination by id
export async function deleteDestination(destinationId, email) {
  try {
    const response = await fetch(`${url}/${destinationId}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
      body: JSON.stringify({ email })
    });

    if (response.status === 401) {
      alert('Unauthorized, please log in.');
      window.location.href = '/clientSide/formsPage.html';
    }

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    console.log("Destination deleted successfully");
  } catch (error) {
    console.error("There was an error deleting the destination:", error);
  }
}

// UPDATE destination
export async function updateDestination(destinationId, formData) {
  try {
    const response = await fetch(`${url}/${destinationId}`, {
      method: "PUT",
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('jwt')}` // Include Authorization header for JWT
      },
      body: formData // Send the FormData directly
    });

    if (response.status === 401) {
      alert('Unauthorized, please log in.');
      window.location.href = '/clientSide/formsPage.html';
    }

    if (!response.ok) {
      throw new Error(`Failed to update the destination. Status code: ${response.status}`);
    }

    const updatedDestination = await response.json();
    console.log("updatedDestination", updatedDestination);
    return updatedDestination;
  } catch (error) {
    console.error("Error:", error);
  }
}
