import EventModel from './event.model.js';

// Store ticket types temporarily
let ticketTypes = [];

// Collect event data from form
async function collectEventData() {
  const eventLogoInput = document.getElementById('logo-image');
  const eventBannerInput = document.getElementById('banner-image');
    
  // Check if files are selected
  if (!eventLogoInput.files[0] || !eventBannerInput.files[0]) {
    alert('Please select both logo and banner images'); 
    return; 
  }

  // Convert images to Base64
  const eventLogo = await convertImageToBase64(eventLogoInput.files[0]);
  const eventBanner = await convertImageToBase64(eventBannerInput.files[0]);

  // Log the values of eventLogo and eventBanner
  console.log('Event Logo:', eventLogo);
  console.log('Event Banner:', eventBanner);

  // Validate image conversion
  if (!eventLogo || !eventBanner) {
    throw new Error('Failed to process image files');
  }
  return {
    title: document.getElementById('event-name').value,
    addressProvince: document.getElementById('city-province').value,
    addressDetail: document.getElementById('event-details').value,
    startDate: new Date(document.getElementById('start-time').value),
    endDate: new Date(document.getElementById('end-time').value),
    visitCount: 0,
    category: document.getElementById('event-category').value,
    status: "Active",
    ticketTypes,
    organizerId: "Long",
    eventLogo: eventLogo,
    eventBanner: eventBanner,
    description: document.getElementById('description').value,
    eventType: document.querySelector('input[name="event-type"]:checked')?.value,
    venueName: document.getElementById('venue-name').value,
    district: document.getElementById('district').value,
  };
}
async function convertImageToBase64(file) {
  return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
  });
}
// Add ticket type to array
function addTicketType() {
  const ticketData = {
    name: document.getElementById('ticketName').value,
    price: document.getElementById('ticketPrice').value,
    quantity: document.getElementById('totalTickets').value,
    description: document.getElementById('ticketDescription').value
  };
  
  ticketTypes.push(ticketData);
  document.getElementById('addTicketForm').style.display = 'none';
  
  // Clear form
  document.getElementById('ticketName').value = '';
  document.getElementById('ticketPrice').value = '';
  document.getElementById('totalTickets').value = '';
  document.getElementById('ticketDescription').value = '';
  
  // Update UI to show added ticket
  displayTickets();
}

// Display tickets in UI
function displayTickets() {
  const ticketList = document.createElement('div');
  ticketList.innerHTML = ticketTypes.map((ticket, index) => `
    <div class="ticket-item">
      <h4>${ticket.name}</h4>
      <p>Price: ${ticket.price}</p>
      <p>Quantity: ${ticket.quantity}</p>
      <button onclick="removeTicket(${index})">Remove</button>
    </div>
  `).join('');
  
  document.querySelector('.upload2').appendChild(ticketList);
}

// Remove ticket
function removeTicket(index) {
  ticketTypes.splice(index, 1);
  displayTickets();
}

// Save event with tickets to database
async function saveDataToDatabase() {
  try {
    const formData = await collectEventData();
    console.log('Creating new event with data:', formData); 
    const createdEvent = await EventModel.create(formData);
    console.log('Event created successfully:', createdEvent);
    return createdEvent;
  } catch (error) {
    console.error('Error saving event:', error);
    alert('Error saving event: ' + error.message); 
    throw error;
  }
}

// Add event listeners
document.querySelector('.save-btn').addEventListener('click', addTicketType);

export { saveDataToDatabase, addTicketType, removeTicket };