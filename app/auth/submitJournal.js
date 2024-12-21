// app/auth/submitJournal.js

// Example journal entry
const journalEntry = {
  journalEntry: "Today I felt really happy and accomplished my goals."
};

// Sending the journal entry to the backend API
fetch('http://localhost:3000/api/journal', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(journalEntry),
})
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(data => {
    console.log('Success:', data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
