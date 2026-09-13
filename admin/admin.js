

const API_URL = "http://localhost:3000";





const loginScreen = document.getElementById("loginScreen");
const adminPanel = document.getElementById("adminPanel");

const loginForm = document.getElementById("loginForm");
const adminPassword = document.getElementById("adminPassword");
const loginError = document.getElementById("loginError");

const logoutBtn = document.getElementById("logoutBtn");

const totalAppointments =
    document.getElementById("totalAppointments");

const pendingAppointments =
    document.getElementById("pendingAppointments");

const confirmedAppointments =
    document.getElementById("confirmedAppointments");

const cancelledAppointments =
    document.getElementById("cancelledAppointments");

const searchAppointments =
    document.getElementById("searchAppointments");

const statusFilter =
    document.getElementById("statusFilter");

const refreshAppointments =
    document.getElementById("refreshAppointments");

const appointmentsTableBody =
    document.getElementById("appointmentsTableBody");

const appointmentDetailsModal =
    document.getElementById("appointmentDetailsModal");

const appointmentDetails =
    document.getElementById("appointmentDetails");

const closeDetailsModal =
    document.getElementById("closeDetailsModal");


let appointments = [];




loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("adminUsername").value.trim();
    const password = document.getElementById("adminPassword").value;

    loginError.textContent = "";

    try {
        const response = await fetch(`${API_URL}/api/admin/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
            loginError.textContent = data.message || "Invalid login";
            return;
        }

        sessionStorage.setItem("skAdminLoggedIn", "true");

        loginScreen.style.display = "none";
        adminPanel.style.display = "block";

        loadAppointments();

    } catch (error) {
        console.error(error);

        loginError.textContent =
            "Cannot connect to server. Is the backend running?";
    }
});




if (
    sessionStorage.getItem("skAdminLoggedIn")
    === "true"
) {

    loginScreen.style.display = "none";

    adminPanel.style.display = "block";

    loadAppointments();

}



logoutBtn.addEventListener("click", function () {

    sessionStorage.removeItem(
        "skAdminLoggedIn"
    );

    adminPanel.style.display = "none";

    loginScreen.style.display = "flex";

});


async function loadAppointments() {

    appointmentsTableBody.innerHTML = `
        <tr>
            <td colspan="6"
                style="text-align:center;padding:30px;">
                Loading appointments...
            </td>
        </tr>
    `;


    try {

        const response = await fetch(
            `${API_URL}/api/appointments`
        );


        if (!response.ok) {

            throw new Error(
                "Server returned " +
                response.status
            );

        }


        const data =
            await response.json();


        console.log(
            "Backend response:",
            data
        );


        if (Array.isArray(data)) {

            appointments = data;

        } else if (
            Array.isArray(data.appointments)
        ) {

            appointments =
                data.appointments;

        } else {

            appointments = [];

        }


        updateStatistics();

        renderAppointments();


    } catch (error) {

        console.error(
            "Appointment loading error:",
            error
        );


        appointmentsTableBody.innerHTML = `
            <tr>
                <td colspan="6"
                    style="
                        text-align:center;
                        padding:30px;
                        color:#d93025;
                    ">

                    Could not connect to backend.

                    <br><br>

                    Make sure the backend is running:

                    <br>

                    <b>node server.js</b>

                </td>
            </tr>
        `;

    }

}




function updateStatistics() {

    let pending = 0;
    let confirmed = 0;
    let cancelled = 0;


    appointments.forEach(function (appointment) {

        const status =
            normalizeStatus(
                appointment.status
            );


        if (status === "Pending") {

            pending++;

        } else if (status === "Confirmed") {

            confirmed++;

        } else if (status === "Cancelled") {

            cancelled++;

        }

    });


    totalAppointments.textContent =
        appointments.length;

    pendingAppointments.textContent =
        pending;

    confirmedAppointments.textContent =
        confirmed;

    cancelledAppointments.textContent =
        cancelled;

}




function renderAppointments() {

    const search =
        searchAppointments.value
            .toLowerCase()
            .trim();


    const selectedStatus =
        statusFilter.value;


    const filtered =
        appointments.filter(
            function (appointment) {

                const text = `

                    ${appointment.name || ""}

                    ${appointment.phone || ""}

                    ${appointment.email || ""}

                    ${appointment.doctor || ""}

                    ${appointment.specialty || ""}

                `.toLowerCase();


                const matchesSearch =
                    text.includes(search);


                const status =
                    normalizeStatus(
                        appointment.status
                    );


                const matchesStatus =
                    selectedStatus === "all" ||
                    status === selectedStatus;


                return (
                    matchesSearch &&
                    matchesStatus
                );

            }
        );


    if (filtered.length === 0) {

        appointmentsTableBody.innerHTML = `
            <tr>
                <td colspan="6"
                    style="
                        text-align:center;
                        padding:30px;
                    ">
                    No appointment requests found.
                </td>
            </tr>
        `;

        return;

    }


    appointmentsTableBody.innerHTML =
        filtered.map(
            function (appointment) {

                const status =
                    normalizeStatus(
                        appointment.status
                    );


                return `

                    <tr>

                        <td>

                            <strong>
                                ${escapeHTML(
                                    appointment.name ||
                                    "Unknown"
                                )}
                            </strong>

                            <br>

                            <small>
                                ${escapeHTML(
                                    appointment.email ||
                                    ""
                                )}
                            </small>

                        </td>


                        <td>

                            ${escapeHTML(
                                appointment.phone ||
                                "—"
                            )}

                        </td>


                        <td>

                            <strong>
                                ${escapeHTML(
                                    appointment.doctor ||
                                    "Not specified"
                                )}
                            </strong>

                            <br>

                            <small>
                                ${escapeHTML(
                                    appointment.specialty ||
                                    ""
                                )}
                            </small>

                        </td>


                        <td>

                            ${escapeHTML(
                                appointment.date ||
                                "—"
                            )}

                            <br>

                            ${escapeHTML(
                                appointment.time ||
                                ""
                            )}

                        </td>


                        <td>

                            <span class="
                                status
                                ${status.toLowerCase()}
                            ">

                                ${status}

                            </span>

                        </td>


                        <td>

                            <button
                                class="action-btn view-btn"
                                onclick="viewAppointment('${escapeJS(
                                    appointment.id
                                )}')"
                            >
                                View
                            </button>


                            ${
                                status !== "Confirmed"
                                ?
                                `
                                <button
                                    class="action-btn confirm-btn"
                                    onclick="updateStatus(
                                        '${escapeJS(
                                            appointment.id
                                        )}',
                                        'Confirmed'
                                    )"
                                >
                                    Confirm
                                </button>
                                `
                                :
                                ""
                            }


                            ${
                                status !== "Cancelled"
                                ?
                                `
                                <button
                                    class="action-btn cancel-btn"
                                    onclick="updateStatus(
                                        '${escapeJS(
                                            appointment.id
                                        )}',
                                        'Cancelled'
                                    )"
                                >
                                    Cancel
                                </button>
                                `
                                :
                                ""
                            }


                            <button
                                class="action-btn delete-btn"
                                onclick="deleteAppointment(
                                    '${escapeJS(
                                        appointment.id
                                    )}'
                                )"
                            >
                                Delete
                            </button>

                        </td>

                    </tr>

                `;

            }
        ).join("");

}




window.viewAppointment =
function (id) {

    const appointment =
        appointments.find(
            function (item) {

                return String(item.id)
                    === String(id);

            }
        );


    if (!appointment) {

        alert(
            "Appointment not found."
        );

        return;

    }


    const status =
        normalizeStatus(
            appointment.status
        );


    appointmentDetails.innerHTML = `

        <div class="detail-row">
            <span>Patient</span>
            <strong>
                ${escapeHTML(
                    appointment.name || "—"
                )}
            </strong>
        </div>


        <div class="detail-row">
            <span>Phone</span>
            <strong>
                ${escapeHTML(
                    appointment.phone || "—"
                )}
            </strong>
        </div>


        <div class="detail-row">
            <span>Email</span>
            <strong>
                ${escapeHTML(
                    appointment.email || "—"
                )}
            </strong>
        </div>


        <div class="detail-row">
            <span>Doctor</span>
            <strong>
                ${escapeHTML(
                    appointment.doctor || "—"
                )}
            </strong>
        </div>


        <div class="detail-row">
            <span>Speciality</span>
            <strong>
                ${escapeHTML(
                    appointment.specialty || "—"
                )}
            </strong>
        </div>


        <div class="detail-row">
            <span>Hospital Location</span>
            <strong>
                ${escapeHTML(
                    appointment.location || "—"
                )}
            </strong>
        </div>


        <div class="detail-row">
            <span>Date</span>
            <strong>
                ${escapeHTML(
                    appointment.date || "—"
                )}
            </strong>
        </div>


        <div class="detail-row">
            <span>Time</span>
            <strong>
                ${escapeHTML(
                    appointment.time || "—"
                )}
            </strong>
        </div>


        <div class="detail-row">
            <span>Message</span>
            <strong>
                ${escapeHTML(
                    appointment.message ||
                    "No message provided"
                )}
            </strong>
        </div>


        <div class="detail-row">
            <span>Status</span>
            <strong>

                <span class="
                    status
                    ${status.toLowerCase()}
                ">
                    ${status}
                </span>

            </strong>
        </div>

    `;


    appointmentDetailsModal.style.display =
        "flex";

};


closeDetailsModal.addEventListener(
    "click",
    function () {

        appointmentDetailsModal.style.display =
            "none";

    }
);


appointmentDetailsModal.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            appointmentDetailsModal
        ) {

            appointmentDetailsModal.style.display =
                "none";

        }

    }
);



window.updateStatus =
async function (id, status) {

    try {

        const response =
            await fetch(
                `${API_URL}/api/appointments/${encodeURIComponent(id)}`,
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        status: status
                    })
                }
            );


        if (!response.ok) {

            throw new Error(
                "Status update failed"
            );

        }


        await loadAppointments();


    } catch (error) {

        console.error(error);

        alert(
            "Could not update appointment."
        );

    }

};


window.deleteAppointment =
async function (id) {

    if (
        !confirm(
            "Delete this appointment permanently?"
        )
    ) {

        return;

    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/appointments/${encodeURIComponent(id)}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Delete failed"
            );

        }


        await loadAppointments();


    } catch (error) {

        console.error(error);

        alert(
            "Could not delete appointment."
        );

    }

};



searchAppointments.addEventListener(
    "input",
    renderAppointments
);


statusFilter.addEventListener(
    "change",
    renderAppointments
);



refreshAppointments.addEventListener(
    "click",
    loadAppointments
);


setInterval(
    function () {

        if (
            sessionStorage.getItem(
                "skAdminLoggedIn"
            ) === "true"
        ) {

            loadAppointments();

        }

    },
    10000
);



function normalizeStatus(status) {

    if (!status) {

        return "Pending";

    }


    const value =
        String(status).toLowerCase();


    if (value === "confirmed") {

        return "Confirmed";

    }


    if (value === "cancelled") {

        return "Cancelled";

    }


    return "Pending";

}


function escapeHTML(value) {

    return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");

}


function escapeJS(value) {

    return String(value ?? "")
        .replaceAll("\\", "\\\\")
        .replaceAll("'", "\\'");

}