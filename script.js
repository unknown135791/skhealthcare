const API_URL = "https://skhealthcare-backend.onrender.com";

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

const successPopup =
    document.getElementById("successPopup");

const successPopupClose =
    document.getElementById("successPopupClose");

const successPopupOk =
    document.getElementById("successPopupOk");

function showAppointmentSuccess() {
    if (successPopup) {
        successPopup.classList.add("show");
    }
}

function closeAppointmentSuccess() {
    if (successPopup) {
        successPopup.classList.remove("show");
    }
}

if (successPopupClose) {
    successPopupClose.addEventListener(
        "click",
        closeAppointmentSuccess
    );
}

if (successPopupOk) {
    successPopupOk.addEventListener(
        "click",
        closeAppointmentSuccess
    );
}

if (successPopup) {
    successPopup.addEventListener(
        "click",
        function (event) {
            if (event.target === successPopup) {
                closeAppointmentSuccess();
            }
        }
    );
}

appointmentForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const submitButton =
            appointmentForm.querySelector(
                'button[type="submit"]'
            );

        submitButton.disabled = true;
        submitButton.innerHTML = "Submitting...";

        const appointment = {
            name:
                document
                    .getElementById("patientName")
                    .value
                    .trim(),

            phone:
                document
                    .getElementById("patientPhone")
                    .value
                    .trim(),

            email:
                document
                    .getElementById("patientEmail")
                    .value
                    .trim(),

            doctor:
                document
                    .getElementById("doctor")
                    .value,

            specialty:
                document
                    .getElementById("specialty")
                    .value,

            location:
                document
                    .getElementById("location")
                    .value,

            date:
                document
                    .getElementById("appointmentDate")
                    .value,

            time:
                document
                    .getElementById("appointmentTime")
                    .value,

            message:
                document
                    .getElementById("message")
                    .value
                    .trim()
        };

        try {

            const response =
                await fetch(
                    `${API_URL}/api/appointments`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify(appointment)
                    }
                );

            const result =
                await response.json();

            if (
                !response.ok ||
                !result.success
            ) {
                throw new Error(
                    result.message ||
                    result.error ||
                    "Unable to submit appointment."
                );
            }

            appointmentForm.reset();

            appointmentModal.classList.remove("show");

            appointmentModal.setAttribute(
                "aria-hidden",
                "true"
            );

            formMessage.textContent = "";

            showAppointmentSuccess();

        } catch (error) {

            console.error(
                "Appointment error:",
                error
            );

            formMessage.textContent =
                "✕ Unable to connect to the hospital server. Please try again.";

            formMessage.style.color =
                "#d92735";
        }

        submitButton.disabled = false;

        submitButton.innerHTML =
            "Request Appointment →";
    }
);
const emergencyBtn =
    document.getElementById("emergencyBtn");

const emergencyModal =
    document.getElementById("emergencyModal");

const emergencyClose =
    document.getElementById("emergencyClose");

if (emergencyBtn && emergencyModal) {

    emergencyBtn.addEventListener("click", function () {

        emergencyModal.classList.add("show");

        emergencyModal.setAttribute(
            "aria-hidden",
            "false"
        );

    });

}

if (emergencyClose && emergencyModal) {

    emergencyClose.addEventListener("click", function () {

        emergencyModal.classList.remove("show");

        emergencyModal.setAttribute(
            "aria-hidden",
            "true"
        );

    });

}

if (emergencyModal) {

    emergencyModal.addEventListener("click", function (event) {

        if (event.target === emergencyModal) {

            emergencyModal.classList.remove("show");

            emergencyModal.setAttribute(
                "aria-hidden",
                "true"
            );

        }

    });

}
