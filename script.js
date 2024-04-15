document.addEventListener('DOMContentLoaded', function () {
  const carsContainer = document.getElementById('cars');
  const makeFilter = document.getElementById('make');
  const filterInfo = document.getElementById('filterInfo'); // Reference to the filter info div

  // Function to fetch and render cars
  function fetchAndRenderCars(make = '') {
    let url = 'https://exam.razoyo.com/api/cars';
    if (make) {
      url += `?make=${make}`;
    }

    fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    })
    .then(response => response.json())
    .then(data => {
      console.log(data); // Log the data to the console

      // Clear previous cars
      carsContainer.innerHTML = '';

      // Render cars
      data.cars.forEach(car => {
        const carElement = document.createElement('div');
        carElement.classList.add('car');
        carElement.innerHTML = `
          <button class="toggle-btn" data-id="${car.id}" data-state="open">+</button>
          <h2>${car.make} ${car.model || 'Unnamed Model'}</h2>
          <img class="car-image" src="${car.image}" alt="${car.name || 'Unnamed Car'}" />
          <div class="car-details">
            <p><strong>Model:</strong> ${car.model}</p>
            <p><strong>Year:</strong> ${car.year}</p>
          </div>
        `;
        carsContainer.appendChild(carElement);
      });

      // Update filter info
      filterInfo.textContent = make ? `Filtered by ${make}` : 'All Makes';

      // Update make filter options
      makeFilter.innerHTML = ''; // Clear existing options
      const allMakesOption = document.createElement('option'); // Add an option for "All Makes"
      allMakesOption.value = '';
      allMakesOption.textContent = 'All Makes';
      makeFilter.appendChild(allMakesOption);
      data.makes.forEach(make => {
        const option = document.createElement('option');
        option.value = make;
        option.textContent = make;
        makeFilter.appendChild(option);
      });
    })
    .catch(error => console.error('Error fetching cars:', error));
  }

  // Initial fetch and render cars
  fetchAndRenderCars();

  // Event listener for make filter change
  makeFilter.addEventListener('change', function () {
    const selectedMake = this.value; // Retrieve the selected value from the filter dropdown
    
    if (selectedMake === '') {
      // If "All Makes" is selected, fetch and render all cars
      fetchAndRenderCars();
    } else {
      // Otherwise, fetch and render cars filtered by the selected make
      fetchAndRenderCars(selectedMake);
    }
  });

  // Event delegation for toggle button click
  carsContainer.addEventListener('click', function (event) {
    if (event.target.classList.contains('toggle-btn')) {
      const carElement = event.target.parentElement;
      const carImage = carElement.querySelector('.car-image');
      const carDetails = carElement.querySelector('.car-details');
      const currentState = event.target.getAttribute('data-state');

      // Toggle visibility of car image and details
      if (currentState === 'open') {
        carImage.style.display = 'none';
        carDetails.style.display = 'none';
        event.target.textContent = '-';
        event.target.setAttribute('data-state', 'closed');
      } else {
        carImage.style.display = 'block';
        carDetails.style.display = 'block';
        event.target.textContent = '+';
        event.target.setAttribute('data-state', 'open');
      }
    }
  });
});
