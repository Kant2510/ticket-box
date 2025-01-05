document.addEventListener('DOMContentLoaded', () => {
    const selectAllCheckbox = document.getElementById('selectAllBTN');
    const selectAll = document.getElementById('selectAll');
    const ticketCheckboxes = document.querySelectorAll('.ticket-checkbox');
    const bookNowBtn = document.getElementById('bookNowBtn');
    const deleteBtn = document.getElementById('deleteBtn');
    const deleteModal = document.getElementById('deleteModal');
    const errorModal = document.getElementById('errorModal');
    const noSelectionModal = document.getElementById('noSelectionModal');
    const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
    const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
    const closeErrorModalBtn = document.getElementById('closeErrorModalBtn');
    const closeNoSelectionModalBtn = document.getElementById('closeNoSelectionModalBtn');
  
    // Select All functionality
    selectAllCheckbox.addEventListener('click', () => {
      selectAll.checked = !selectAll.checked;
      ticketCheckboxes.forEach(checkbox => {
        checkbox.checked = selectAll.checked;
      });
    });
  
    // Book Now functionality
    bookNowBtn.addEventListener('click', () => {
      const selectedTickets = document.querySelectorAll('.ticket-checkbox:checked');
      if (selectedTickets.length === 0) {
        noSelectionModal.style.display = 'flex';
      } else if (selectedTickets.length > 1) {
        errorModal.style.display = 'flex';
      } else {
        const selectedEventId = selectedTickets[0].getAttribute('data-id');
        window.location.href = `/detail/${selectedEventId}}`; // Chuyển đến trang đặt vé với eventId
      }
    });
  
    // Delete functionality
    deleteBtn.addEventListener('click', () => {
      const selectedTickets = document.querySelectorAll('.ticket-checkbox:checked');
      if (selectedTickets.length > 0) {
        deleteModal.style.display = 'flex';
      } else {
        noSelectionModal.style.display = 'flex';
      }
    });
  
    // Confirm Delete
    confirmDeleteBtn.addEventListener('click', () => {
      const selectedTickets = document.querySelectorAll('.ticket-checkbox:checked');
      const selectedEventIds = Array.from(selectedTickets).map(checkbox => checkbox.getAttribute('data-id'));
  
      // Gửi yêu cầu xóa đến backend
      fetch('/delete-carts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ eventIds: selectedEventIds }),
      })
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            alert('Tickets deleted successfully!');
            location.reload(); // Tải lại trang để cập nhật giỏ hàng
          } else {
            alert('Failed to delete tickets.');
          }
        })
        .catch(error => {
          console.error('Error:', error);
          alert('An error occurred while deleting tickets.');
        });
  
      deleteModal.style.display = 'none';
    });
  
    // Close modals
    cancelDeleteBtn.addEventListener('click', () => {
      deleteModal.style.display = 'none';
    });
  
    closeErrorModalBtn.addEventListener('click', () => {
      errorModal.style.display = 'none';
    });
  
    closeNoSelectionModalBtn.addEventListener('click', () => {
      noSelectionModal.style.display = 'none';
    });
});