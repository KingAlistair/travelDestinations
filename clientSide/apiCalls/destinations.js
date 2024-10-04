const url = "http://127.0.0.1:3000/destinations"

// Delete destination by id
export async function deleteDestination(destinationId) {
    try {
        const response = await fetch(`${url}/${destinationId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.statusText}`);
        };

        console.log('Destination deleted successfully');
    } catch (error) {
        console.error('There was an error deleting the destination:', error);
    }
}