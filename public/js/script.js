function openModal() {
    document.getElementById("paymentModal").style.display = "block";
  }

  function closeModal() {
    document.getElementById("paymentModal").style.display = "none";
  }

  function processDummyPayment() {
    closeModal();

    // Show payment success
    // alert("Payment Successful! Redirecting to home...");

    const form = document.querySelector('.doc-book-app-form');
    const dummyPaymentId = "DUMMY_" + Math.random().toString(36).substr(2, 9);

    const input = document.createElement('input');
    input.type = 'hidden';
    input.name = 'appointment[payment_id]';
    input.value = dummyPaymentId;
    form.appendChild(input);

    // Submit form
    form.submit();

    // Optional: Redirect after short delay (only if not submitting form)
    // setTimeout(() => {
    //   window.location.href = '/';
    // }, 2000);
  }


  const today = new Date().toISOString().split('T')[0];

  let ele1 =  document.getElementById('appointmentDate');
  if(ele1){
    ele1.setAttribute('min', today);
  }else{
    console.log(`ele not found`);
  }


  const searchInput = document.getElementById("search");
  const searchBtn = document.getElementById('search-btn');
  const suggestionsList = document.getElementById('suggestions');

  // Event listener for search input
  searchInput.addEventListener('input', function() {
    const query = searchInput.value;
    if (query.length > 2) {
      fetchSuggestions(query);
    } else {
      suggestionsList.style.display = 'none';
    }
  });

  // Event listener for search button
  searchBtn.addEventListener('click', function() {
    console.log(`btn is clicked`);
    const query = searchInput.value;
    if (query.length > 0) {
      window.location.href = `/appointment/${query}`;
    }
  });

  function fetchSuggestions(query) {
    fetch(`/api/search?query=${query}`)
      .then(response => response.json())
      .then(data => {
        displaySuggestions(data);
      })
      .catch(error => console.error('Error fetching suggestions:', error));
  }

  function displaySuggestions(suggestions) {
    suggestionsList.innerHTML = '';
    if (suggestions.length > 0) {
      suggestions.forEach(suggestion => {
        const listItem = document.createElement('li');
        listItem.textContent = suggestion.name;
        listItem.onclick = () => window.location.href = `/appointment/${suggestion.id}`;
        suggestionsList.appendChild(listItem);
      });
      suggestionsList.style.display = 'block';
    } else {
      suggestionsList.style.display = 'none';
    }
  }