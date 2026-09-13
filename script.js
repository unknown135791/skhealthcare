
const API_URL = "http://localhost:3000";



const appointmentModal =
    document.getElementById("appointmentModal");

const appointmentForm =
    document.getElementById("appointmentForm");

const formMessage =
    document.getElementById("formMessage");


document.querySelectorAll(".open-modal").forEach(button => {

    button.addEventListener("click", function (event) {

        event.preventDefault();

        appointmentModal.classList.add("show");

        appointmentModal.setAttribute(
            "aria-hidden",
            "false"
        );
    });

});


const closeModal =
    document.querySelector(".close-modal");

if (closeModal) {

    closeModal.addEventListener("click", function () {

        appointmentModal.classList.remove("show");

        appointmentModal.setAttribute(
            "aria-hidden",
            "true"
        );

    });

}



appointmentModal.addEventListener("click", function (event) {

    if (event.target === appointmentModal) {

        appointmentModal.classList.remove("show");

        appointmentModal.setAttribute(
            "aria-hidden",
            "true"
        );

    }

});




appointmentForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const submitButton =
        appointmentForm.querySelector(
            'button[type="submit"]'
        );


    submitButton.disabled = true;

    submitButton.innerHTML =
        "Submitting...";

    const appointment = {

        name:
            document.getElementById("patientName").value.trim(),

        phone:
            document.getElementById("patientPhone").value.trim(),

        email:
            document.getElementById("patientEmail").value.trim(),

        doctor:
            document.getElementById("doctor").value,

        specialty:
            document.getElementById("specialty").value,

        location:
            document.getElementById("location").value,

        date:
            document.getElementById("appointmentDate").value,

        time:
            document.getElementById("appointmentTime").value,

        message:
            document.getElementById("message").value.trim()

    };


    try {

        const response = await fetch(
            `${API_URL}/api/appointments`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(appointment)
            }
        );


        const result = await response.json();


        if (!response.ok || !result.success) {

            throw new Error(
                result.message ||
                "Unable to submit appointment."
            );

        }


        // SUCCESS

        formMessage.textContent =
            "✓ Appointment request submitted successfully.";

        formMessage.style.color = "#168244";


        appointmentForm.reset();



        setTimeout(() => {

            appointmentModal.classList.remove("show");

            appointmentModal.setAttribute(
                "aria-hidden",
                "true"
            );

            formMessage.textContent = "";

        }, 2500);


    } catch (error) {

        console.error(
            "Appointment error:",
            error
        );


        formMessage.textContent =
            "✕ Unable to connect to the hospital server. Please try again.";

        formMessage.style.color = "#d92735";

    }


    submitButton.disabled = false;

    submitButton.innerHTML =
        "Request Appointment →";

});