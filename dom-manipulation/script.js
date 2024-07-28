// Quotes array with sample data
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Inspiration" },
  { text: "Do not wait to strike till the iron is hot; but make it hot by striking.", category: "Motivation" },
  { text: "The best way to predict the future is to create it.", category: "Future" }
];

// Function to save quotes to local storage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Function to save selected category to local storage
function saveSelectedCategory(category) {
  localStorage.setItem('selectedCategory', category);
}

// Function to show a random quote
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.textContent = `"${quote.text}" - ${quote.category}`;
}

// Function to create the form for adding new quotes
function createAddQuoteForm() {
  const formContainer = document.getElementById('quoteFormContainer');
  
  const formHtml = `
    <div>
      <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
      <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
      <button onclick="addQuote()">Add Quote</button>
    </div>
  `;

  formContainer.innerHTML = formHtml;
}

// Function to add a new quote
function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    // Add the new quote to the quotes array
    quotes.push({ text: newQuoteText, category: newQuoteCategory });

    // Save the updated quotes array to local storage
    saveQuotes();

    // Update the categories in the filter dropdown
    populateCategories();

    // Clear the input fields
    document.getElementById('newQuoteText').value = '';
    document.getElementById('newQuoteCategory').value = '';

    alert('New quote added!');
  } else {
    alert('Please enter both a quote and a category.');
  }
}

// Function to export quotes to a JSON file
function exportQuotes() {
  const jsonString = JSON.stringify(quotes);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  a.click();
  URL.revokeObjectURL(url);
}

// Function to import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

// Function to populate the category filter dropdown
function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  uniqueCategories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });
  const selectedCategory = localStorage.getItem('selectedCategory') || 'all';
  categoryFilter.value = selectedCategory;
  filterQuotes();
}

// Function to filter quotes based on the selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  saveSelectedCategory(selectedCategory);
  const filteredQuotes = selectedCategory === 'all' 
    ? quotes 
    : quotes.filter(quote => quote.category === selectedCategory);
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = filteredQuotes.map(quote => `<div>"${quote.text}" - ${quote.category}</div>`).join('');
}

// Function to sync quotes with the server
async function syncQuotes() {
  await fetchQuotesFromServer();
  await postQuotesToServer();
}

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/posts');
    const serverQuotes = await response.json();
    const formattedQuotes = serverQuotes.map(item => ({
      text: item.title,
      category: "Server"
    }));
    quotes.push(...formattedQuotes);
    saveQuotes();
    populateCategories();
    alert('Quotes synced with server!');
  } catch (error) {
    console.error('Error fetching quotes from server:', error);
  }
}

// Function to post quotes to the server
async function postQuotesToServer() {
  try {
    for (const quote of quotes) {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title: quote.text, body: quote.category })
      });
      const result = await response.json();
      console.log('Quote posted to server:', result);
    }
  } catch (error) {
    console.error('Error posting quotes to server:', error);
  }
}

// Periodic syncing with server
setInterval(syncQuotes, 60000); // Sync every 60 seconds

// Event listener for the "Show New Quote" button
document.getElementById('newQuote').addEventListener('click', showRandomQuote);

// Event listener for the "Export Quotes" button
document.getElementById('exportQuotes').addEventListener('click', exportQuotes);

// Initialize with a random quote, create the add quote form, and populate the category filter
document.addEventListener('DOMContentLoaded', () => {
  showRandomQuote();
  createAddQuoteForm();
  populateCategories();
  syncQuotes();
});
