document.addEventListener('DOMContentLoaded',()=>{
  //quotes creation ===========================

  let quotes =  [
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "The purpose of our lives is to be happy.", category: "Happiness" },
    { text: "Get busy living or get busy dying.", category: "Motivation" }
  ] || JSON.parse(localStorage.getItem('quotes'));

  // Function to save quotes to local storage
  const saveQuotes = ()=>{
    localStorage.setItem('quotes',JSON.stringify(quotes));
    console.log(quotes);
  }

  //function to display a quote randomly ======
  const showRandomQuote = ()=>{
  const quoteDisplay = document.getElementById('quoteDisplay');
  const randomSelector = Math.floor(Math.random()*quotes.length);
  const randomQuote = quotes[randomSelector];
  quoteDisplay.innerHTML='';
    //creat a parag to display the quote=======
  const quoteTextElement = document.createElement('p');
  quoteTextElement.textContent = `${randomQuote.text}`;
  const quoteCategoryElement = document.createElement('p');
  quoteCategoryElement.textContent = `-${randomQuote.category}`
  //append child to display the quotes============
  quoteDisplay.appendChild(quoteTextElement);
  quoteDisplay.appendChild(quoteCategoryElement);
  }
  //creat a function to add quotes by the user======
  const createAddQuoteForm = ()=>{
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
    if (newQuoteText && newQuoteCategory) {
      //if the input is true===
      //add the txt and category vaalues to the quotes array =====
      quotes.push({text:newQuoteText , category:newQuoteCategory});
      if (newQuoteCategory!==''&&newQuoteText!=='') {
        alert('quotes add successfully');
      }
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
    }
    else if (newQuoteCategory =="" || newQuoteText =="") {
      alert('please enter a valid text and category')
    }
  }

  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  document.getElementById('addQuoteButton').addEventListener('click',createAddQuoteForm);
  document.getElementById('addQuoteButton').addEventListener('click',saveQuotes);
});
