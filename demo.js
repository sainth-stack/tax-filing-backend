// [09/12, 8:21 pm] Mr Bro: Explanation
// If page and pageSize are present in the query parameters:

// Convert them to integers.
// Calculate the startIndex and endIndex for slicing the array.
// Return the sliced portion of the data.
// If page or pageSize is missing:

// Return the entire dataset.
// [09/12, 8:21 pm] Mr Bro: sample backend code
// [09/12, 8:21 pm] Mr Bro: const express = require('express');
// const app = express();

// // Sample data
// const data = Array.from({ length: 100 }, (_, i) => ({ id: i + 1, name: Item ${i + 1} }));

// app.get('/api/items', (req, res) => {
//     const { page, pageSize } = req.query;

//     // If both page and pageSize are provided, send paginated data
//     if (page && pageSize) {
//         const pageNumber = parseInt(page, 10);
//         const size = parseInt(pageSize, 10);

//         const startIndex = (pageNumber - 1) * size;
//         const endIndex = startIndex + size;

//         return res.json(data.slice(startIndex, endIndex));
//     }

//     // Otherwise, send all data
//     res.json(data);
// });

// // Start the server
// const PORT = 5000;
// app.listen(PORT, () => {
//     console.log(Server running on port ${PORT});
// });
// [09/12, 8:21 pm] Mr Bro: simple front end code
// [09/12, 8:21 pm] Mr Bro: import axios from 'axios';

// const fetchData = async (page, pageSize) => {
//     try {
//         const params = page && pageSize ? { page, pageSize } : {};
//         const response = await axios.get('/api/items', { params });
//         console.log(response.data);
//     } catch (error) {
//         console.error('Error fetching data:', error);
//     }
// };

// // Example usage:
// fetchData(1, 10); // Fetch page 1 with 10 items per page
// fetchData();      // Fetch all items