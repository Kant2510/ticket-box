import EventModel from './event.model.js'; // Import EventModel từ file model của bạn

// Hàm thu thập dữ liệu từ form
function collectFormData() {
  const title = document.getElementById('event-name').value;
  const addressProvince = document.getElementById('city-province').value;
  const addressDetail = document.getElementById('event-details').value;
  const startDate = new Date(document.getElementById('start-time').value);
  const endDate = new Date(document.getElementById('end-time').value);
  const visitCount = 0;
  const category = document.getElementById('event-category').value;
  const status = "Active";
  const ticketTypes = "Free";
  const organizerId = "Long";
  const description = document.getElementById('description').value;
  const eventType = document.getElementById('event-type').value;
  const venueName = document.getElementById('venue-name').value;
  const district = document.getElementById('district').value;
  const eventImages = {
    logo: document.getElementById('event-logo').value,
    banner: document.getElementById('event-banner').value
  };

  return {
    title,
    addressProvince,
    addressDetail,
    startDate,
    endDate,
    visitCount,
    category,
    status,
    ticketTypes,
    organizerId,
    description,
    eventType,
    venueName,
    district,
    eventImages
  };
}

// Hàm lưu dữ liệu trực tiếp vào MongoDB
async function saveDataToDatabase() {
  try {
    const formData = collectFormData(); // Thu thập dữ liệu từ form

    // Sử dụng EventModel.create để lưu trực tiếp
    const createdEvent = await EventModel.create(formData);
    console.log('Event saved successfully:', createdEvent);

    // Gọi hàm tiếp theo hoặc cập nhật giao diện
    next();
  } catch (error) {
    console.error('Error saving event:', error);
  }
}
