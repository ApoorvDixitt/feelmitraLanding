import axios from 'axios';

// Example journal entry
const journalEntry = {
  journalEntry: "Today I felt really happy and accomplished my goals."
};

// Sending the journal entry to the backend API
axios.post('http://localhost:3000/api/journal', journalEntry)
  .then(response => {
    console.log('Success:', response.data);
  })
  .catch(error => {
    console.error('Error:', error);
  }); 