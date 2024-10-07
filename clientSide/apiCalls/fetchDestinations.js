const url = "http://127.0.0.1:3000/api/destinations";

// Delete destination by id
export async function deleteDestination(destinationId, email) {
  try {
    const response = await fetch(`${url}/${destinationId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }), // Send the email in the request body
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    console.log("Destination deleted successfully");
  } catch (error) {
    console.error("There was an error deleting the destination:", error);
  }
}

//FECTH all destinations
export const getAllDestinations = async () => {
  const response = await fetch(url);
  return await response.json();
};


//CREATE destination
export const createDestination = async (formData) => {
  const response = await fetch(url, {
    method: "POST",
    body: formData, // Send the FormData directly - not application/json
  });
  const createdDestination = await response.json();
  console.log("createdDestination", createdDestination);
  return createdDestination;
};

//UPDATE destination
export async function updateDestination(destinationId, formData) {
  try {
    const response = await fetch(`${url}/${destinationId}`, {
      method: "PUT",
      body: formData, // Send the FormData directly - not application/json
    });

    if (!response.ok) {
      console.log("Erron in fetch: " + response.status)
      throw new Error(`Failed to update the destination. Status code: ${response.status}`);
    }
    const updatedDestination = await response.json();
    console.log("updatedDestination", updatedDestination);
    return updatedDestination;
  } catch (error) {
    console.error("Error:", error);
  }
}
