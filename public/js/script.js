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
  document.getElementById('appointmentDate').setAttribute('min', today);


  