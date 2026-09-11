/* =========================================
   MI AGENDA DENTAL
========================================= */


/* =========================================
   DATOS
========================================= */

let journeys = JSON.parse(
    localStorage.getItem("jornadas") || "[]"
);

let clinics = JSON.parse(
    localStorage.getItem("clinics") || "[]"
);

let userName =
    localStorage.getItem("userName") || "";

let editingJourneyId = null;
let editingClinicId = null;

let calendarDate = new Date();

let selectedCalendarDate =
    getTodayString();


/* =========================================
   ELEMENTOS
========================================= */

const welcomeScreen =
    document.getElementById("welcomeScreen");

const appScreen =
    document.getElementById("appScreen");

const nameInput =
    document.getElementById("nameInput");

const startButton =
    document.getElementById("startButton");

const greeting =
    document.getElementById("greeting");

const dateText =
    document.getElementById("dateText");

const todayJourneys =
    document.getElementById("todayJourneys");

const todayPatients =
    document.getElementById("todayPatients");

const addTodayButton =
    document.getElementById("addTodayButton");


/* MODAL JORNADA */

const journeyModal =
    document.getElementById("journeyModal");

const closeJourneyModal =
    document.getElementById("closeJourneyModal");

const journeyModalTitle =
    document.getElementById("journeyModalTitle");

const journeyDate =
    document.getElementById("journeyDate");

const clinicSelect =
    document.getElementById("clinicSelect");

const startTime =
    document.getElementById("startTime");

const endTime =
    document.getElementById("endTime");

const patientsInput =
    document.getElementById("patientsInput");

const notesInput =
    document.getElementById("notesInput");

const saveJourneyButton =
    document.getElementById("saveJourneyButton");

const repeatSelect =
    document.getElementById("repeatSelect");

const repeatOptions =
    document.getElementById("repeatOptions");

const repeatEndDate =
    document.getElementById("repeatEndDate");

const repeatSection =
    document.getElementById("repeatSection");


/* MODAL CLÍNICA */

const clinicModal =
    document.getElementById("clinicModal");

const closeClinicModal =
    document.getElementById("closeClinicModal");

const clinicModalTitle =
    document.getElementById("clinicModalTitle");

const clinicName =
    document.getElementById("clinicName");

const clinicAddress =
    document.getElementById("clinicAddress");

const clinicNotes =
    document.getElementById("clinicNotes");

const saveClinicButton =
    document.getElementById("saveClinicButton");

const addClinicButton =
    document.getElementById("addClinicButton");

const clinicsList =
    document.getElementById("clinicsList");


/* AJUSTES */

const settingsName =
    document.getElementById("settingsName");

const saveNameButton =
    document.getElementById("saveNameButton");

const notificationsToggle =
    document.getElementById(
        "notificationsToggle"
    );

const notificationTime =
    document.getElementById(
        "notificationTime"
    );

const reminderMinutes =
    document.getElementById(
        "reminderMinutes"
    );


/* CALENDARIO */

const calendarMonth =
    document.getElementById(
        "calendarMonth"
    );

const calendarDays =
    document.getElementById(
        "calendarDays"
    );

const prevMonth =
    document.getElementById(
        "prevMonth"
    );

const nextMonth =
    document.getElementById(
        "nextMonth"
    );

const selectedDateTitle =
    document.getElementById(
        "selectedDateTitle"
    );

const calendarJourneys =
    document.getElementById(
        "calendarJourneys"
    );

const addCalendarJourney =
    document.getElementById(
        "addCalendarJourney"
    );


/* =========================================
   INICIO
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (userName) {

            showApp();

        } else {

            welcomeScreen.classList.remove(
                "hidden"
            );

            appScreen.classList.add(
                "hidden"
            );

        }


        loadSettings();

        updateHeader();

        loadToday();

        loadClinics();

        renderCalendar();

    }
);


/* =========================================
   BIENVENIDA
========================================= */

startButton.addEventListener(
    "click",
    () => {

        const name =
            nameInput.value.trim();


        if (!name) {

            alert(
                "Por favor, escribe tu nombre."
            );

            return;

        }


        userName = name;


        localStorage.setItem(
            "userName",
            userName
        );


        showApp();

    }
);


function showApp() {

    welcomeScreen.classList.add(
        "hidden"
    );

    appScreen.classList.remove(
        "hidden"
    );


    updateHeader();

    loadToday();

    loadClinics();

    renderCalendar();

}


/* =========================================
   CABECERA
========================================= */

function updateHeader() {

    const today =
        new Date();


    const formattedDate =
        today.toLocaleDateString(
            "es-ES",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );


    dateText.textContent =
        formattedDate;


    if (userName) {

        greeting.textContent =
            `Buenos días, ${userName} ☀️`;

    }

}


/* =========================================
   FECHAS
========================================= */

function getTodayString() {

    const today =
        new Date();

    return formatDate(today);

}


function formatDate(date) {

    const year =
        date.getFullYear();

    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");

    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;

}


function formatDateReadable(
    dateString
) {

    const date =
        new Date(
            dateString +
            "T00:00:00"
        );


    return date.toLocaleDateString(
        "es-ES",
        {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

}


/* =========================================
   GUARDAR JORNADAS
========================================= */

function saveJourneys() {

    localStorage.setItem(
        "jornadas",
        JSON.stringify(journeys)
    );

}


/* =========================================
   HOY
========================================= */

function loadToday() {

    const today =
        getTodayString();


    const todayList =
        journeys
            .filter(
                journey =>
                    journey.date === today
            )
            .sort(
                (a, b) =>
                    a.start.localeCompare(
                        b.start
                    )
            );


    todayJourneys.innerHTML =
        "";


    let totalPatients = 0;


    todayList.forEach(
        journey => {

            totalPatients +=
                Number(
                    journey.patients || 0
                );


            todayJourneys.insertAdjacentHTML(
                "beforeend",
                journeyHTML(journey)
            );

        }
    );


    todayPatients.textContent =
        `${totalPatients} pacientes`;


    if (todayList.length === 0) {

        todayJourneys.innerHTML = `

            <div class="empty-state">

                <div
                    style="font-size:40px;"
                >
                    🦷
                </div>

                <h3>
                    No tienes jornadas hoy
                </h3>

                <p>
                    Disfruta del día o añade una nueva jornada.
                </p>

            </div>

        `;

    }


    attachJourneyButtons();

}


/* =========================================
   HTML JORNADA
========================================= */

function journeyHTML(journey) {

    const clinicName =
        journey.clinic ||
        getClinicName(
            journey.clinicId
        ) ||
        "Clínica";


    return `

        <div class="journey-card">

            <div class="journey-top">

                <div>

                    <div class="journey-clinic">

                        🏥
                        ${escapeHTML(
                            clinicName
                        )}

                    </div>


                    <div class="journey-time">

                        ${journey.start}
                        —
                        ${journey.end}

                    </div>

                </div>

            </div>


            <div class="journey-info">

                <span class="info-pill">

                    👥
                    ${journey.patients || 0}
                    pacientes

                </span>


                ${
                    journey.recurring
                        ? `
                            <span class="info-pill">
                                🔄 Recurrente
                            </span>
                        `
                        : ""
                }

            </div>


            ${
                journey.notes
                    ? `
                        <div class="journey-notes">

                            📝
                            ${escapeHTML(
                                journey.notes
                            )}

                        </div>
                    `
                    : ""
            }


            <div class="journey-actions">


                <button
                    class="edit-button"
                    data-edit-journey="${journey.id}"
                >
                    ✏️ Editar
                </button>


                <button
                    class="delete-button"
                    data-delete-journey="${journey.id}"
                >
                    🗑️ Eliminar
                </button>


            </div>

        </div>

    `;

}


/* =========================================
   BOTONES JORNADAS
========================================= */

function attachJourneyButtons() {

    document
        .querySelectorAll(
            "[data-edit-journey]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        openJourneyModal(
                            Number(
                                button.dataset
                                    .editJourney
                            )
                        );

                    }
                );

            }
        );


    document
        .querySelectorAll(
            "[data-delete-journey]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        deleteJourney(
                            Number(
                                button.dataset
                                    .deleteJourney
                            )
                        );

                    }
                );

            }
        );

}


/* =========================================
   ABRIR JORNADA
========================================= */

addTodayButton.addEventListener(
    "click",
    () => {

        openJourneyModal(
            null,
            getTodayString()
        );

    }
);


addCalendarJourney.addEventListener(
    "click",
    () => {

        openJourneyModal(
            null,
            selectedCalendarDate
        );

    }
);


function openJourneyModal(
    journeyId = null,
    date = null
) {

    editingJourneyId =
        journeyId;


    journeyModal.classList.remove(
        "hidden"
    );


    loadClinicOptions();


    if (journeyId) {

        const journey =
            journeys.find(
                j =>
                    j.id ===
                    journeyId
            );


        if (!journey) return;


        journeyModalTitle.textContent =
            "Editar jornada";


        journeyDate.value =
            journey.date;


        clinicSelect.value =
            journey.clinicId;


        startTime.value =
            journey.start;


        endTime.value =
            journey.end;


        patientsInput.value =
            journey.patients || "";


        notesInput.value =
            journey.notes || "";


        repeatSection.classList.add(
            "hidden"
        );


    } else {

        journeyModalTitle.textContent =
            "Añadir jornada";


        journeyDate.value =
            date ||
            getTodayString();


        clinicSelect.value =
            "";


        startTime.value =
            "";


        endTime.value =
            "";


        patientsInput.value =
            "";


        notesInput.value =
            "";


        repeatSelect.value =
            "none";


        repeatOptions.classList.add(
            "hidden"
        );


        repeatSection.classList.remove(
            "hidden"
        );


        document
            .querySelectorAll(
                ".repeat-day"
            )
            .forEach(
                checkbox => {

                    checkbox.checked =
                        false;

                }
            );


        repeatEndDate.value =
            "";

    }

}


/* =========================================
   CERRAR MODAL
========================================= */

closeJourneyModal.addEventListener(
    "click",
    closeJourneyModalFunction
);


function closeJourneyModalFunction() {

    journeyModal.classList.add(
        "hidden"
    );

}


/* =========================================
   CLÍNICAS SELECT
========================================= */

function loadClinicOptions() {

    clinicSelect.innerHTML = `

        <option value="">
            Selecciona una clínica
        </option>

    `;


    clinics.forEach(
        clinic => {

            clinicSelect.insertAdjacentHTML(
                "beforeend",
                `
                    <option
                        value="${clinic.id}"
                    >
                        ${escapeHTML(
                            clinic.name
                        )}
                    </option>
                `
            );

        }
    );

}


/* =========================================
   REPETICIÓN
========================================= */

repeatSelect.addEventListener(
    "change",
    () => {

        if (
            repeatSelect.value ===
            "weekly"
        ) {

            repeatOptions.classList.remove(
                "hidden"
            );

        } else {

            repeatOptions.classList.add(
                "hidden"
            );

        }

    }
);


/* =========================================
   GUARDAR JORNADA
========================================= */

saveJourneyButton.addEventListener(
    "click",
    () => {

        const date =
            journeyDate.value;

        const clinicId =
            clinicSelect.value;

        const start =
            startTime.value;

        const end =
            endTime.value;

        const patients =
            patientsInput.value;

        const notes =
            notesInput.value.trim();


        if (!date) {

            alert(
                "Selecciona una fecha."
            );

            return;

        }


        if (!clinicId) {

            alert(
                "Selecciona una clínica."
            );

            return;

        }


        if (!start) {

            alert(
                "Selecciona la hora de inicio."
            );

            return;

        }


        if (!end) {

            alert(
                "Selecciona la hora de finalización."
            );

            return;

        }


        const clinic =
            clinics.find(
                c =>
                    c.id ===
                    Number(clinicId)
            );


        if (!clinic) {

            alert(
                "No se ha encontrado la clínica."
            );

            return;

        }


        if (editingJourneyId) {

            const index =
                journeys.findIndex(
                    j =>
                        j.id ===
                        editingJourneyId
                );


            if (index !== -1) {

                journeys[index] = {

                    ...journeys[index],

                    date,

                    clinicId:
                        Number(
                            clinicId
                        ),

                    clinic:
                        clinic.name,

                    start,

                    end,

                    patients,

                    notes

                };

            }


        } else {

            if (
                repeatSelect.value ===
                "none"
            ) {

                journeys.push({

                    id:
                        Date.now(),

                    date,

                    clinicId:
                        Number(
                            clinicId
                        ),

                    clinic:
                        clinic.name,

                    start,

                    end,

                    patients,

                    notes

                });


            } else {

                const selectedDays =
                    Array.from(
                        document.querySelectorAll(
                            ".repeat-day:checked"
                        )
                    )
                    .map(
                        checkbox =>
                            Number(
                                checkbox.value
                            )
                    );


                if (
                    selectedDays.length ===
                    0
                ) {

                    alert(
                        "Selecciona al menos un día de la semana."
                    );

                    return;

                }


                if (
                    !repeatEndDate.value
                ) {

                    alert(
                        "Selecciona la fecha de finalización."
                    );

                    return;

                }


                const startDate =
                    new Date(
                        date +
                        "T00:00:00"
                    );


                const endDate =
                    new Date(
                        repeatEndDate.value +
                        "T00:00:00"
                    );


                if (
                    endDate <
                    startDate
                ) {

                    alert(
                        "La fecha final debe ser posterior a la fecha inicial."
                    );

                    return;

                }


                const seriesId =
                    Date.now();


                let current =
                    new Date(
                        startDate
                    );


                let occurrence =
                    0;


                while (
                    current <=
                    endDate
                ) {

                    const weekday =
                        current.getDay();


                    if (
                        selectedDays.includes(
                            weekday
                        )
                    ) {

                        journeys.push({

                            id:
                                Date.now() +
                                occurrence,

                            seriesId,

                            recurring:
                                true,

                            date:
                                formatDate(
                                    current
                                ),

                            clinicId:
                                Number(
                                    clinicId
                                ),

                            clinic:
                                clinic.name,

                            start,

                            end,

                            patients,

                            notes

                        });


                        occurrence++;

                    }


                    current.setDate(
                        current.getDate() +
                        1
                    );

                }

            }

        }


        saveJourneys();


        closeJourneyModalFunction();


        loadToday();

        renderCalendar();


        if (
            document
                .getElementById(
                    "page-calendario"
                )
                .classList
                .contains(
                    "active"
                )
        ) {

            selectCalendarDay(
                selectedCalendarDate
            );

        }

    }
);


/* =========================================
   ELIMINAR JORNADA
========================================= */

function deleteJourney(id) {

    const journey =
        journeys.find(
            j =>
                j.id === id
        );


    if (!journey) return;


    const confirmed =
        confirm(
            "¿Seguro que quieres eliminar esta jornada?"
        );


    if (!confirmed) return;


    journeys =
        journeys.filter(
            j =>
                j.id !== id
        );


    saveJourneys();


    loadToday();

    renderCalendar();


    if (
        document
            .getElementById(
                "page-calendario"
            )
            .classList
            .contains(
                "active"
            )
    ) {

        selectCalendarDay(
            selectedCalendarDate
        );

    }

}


/* =========================================
   CALENDARIO
========================================= */

prevMonth.addEventListener(
    "click",
    () => {

        calendarDate.setMonth(
            calendarDate.getMonth() -
            1
        );

        renderCalendar();

    }
);


nextMonth.addEventListener(
    "click",
    () => {

        calendarDate.setMonth(
            calendarDate.getMonth() +
            1
        );

        renderCalendar();

    }
);


function renderCalendar() {

    const year =
        calendarDate.getFullYear();

    const month =
        calendarDate.getMonth();


    calendarMonth.textContent =
        new Date(
            year,
            month,
            1
        ).toLocaleDateString(
            "es-ES",
            {
                month: "long",
                year: "numeric"
            }
        );


    calendarDays.innerHTML =
        "";


    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    const mondayFirst =
        firstDay === 0
            ? 6
            : firstDay - 1;


    for (
        let i = 0;
        i < mondayFirst;
        i++
    ) {

        const empty =
            document.createElement(
                "div"
            );


        calendarDays.appendChild(
            empty
        );

    }


    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const button =
            document.createElement(
                "button"
            );


        button.className =
            "calendar-day";


        const dateString =
            `${year}-${String(
                month + 1
            ).padStart(
                2,
                "0"
            )}-${String(
                day
            ).padStart(
                2,
                "0"
            )}`;


        if (
            dateString ===
            getTodayString()
        ) {

            button.classList.add(
                "today"
            );

        }


        if (
            dateString ===
            selectedCalendarDate
        ) {

            button.classList.add(
                "selected"
            );

        }


        const hasJourney =
            journeys.some(
                journey =>
                    journey.date ===
                    dateString
            );


        if (hasJourney) {

            button.classList.add(
                "has-journey"
            );

        }


        button.innerHTML = `

            <span>
                ${day}
            </span>

            ${
                hasJourney
                    ? `
                        <span
                            class="calendar-dot"
                        ></span>
                    `
                    : ""
            }

        `;


        button.addEventListener(
            "click",
            () => {

                selectCalendarDay(
                    dateString
                );

            }
        );


        calendarDays.appendChild(
            button
        );

    }


    selectCalendarDay(
        selectedCalendarDate
    );

}


/* =========================================
   DÍA SELECCIONADO
========================================= */

function selectCalendarDay(
    dateString
) {

    selectedCalendarDate =
        dateString;


    calendarDays
        .querySelectorAll(
            ".calendar-day"
        )
        .forEach(
            button => {

                button.classList.remove(
                    "selected"
                );

            }
        );


    const selectedButton =
        Array.from(
            calendarDays
                .querySelectorAll(
                    ".calendar-day"
                )
        )
        .find(
            button => {

                const span =
                    button.querySelector(
                        "span"
                    );


                if (!span) {
                    return false;
                }


                return (
                    Number(
                        span.textContent
                    ) ===
                    Number(
                        dateString
                            .split("-")[2]
                    )
                );

            }
        );


    if (selectedButton) {

        selectedButton.classList.add(
            "selected"
        );

    }


    selectedDateTitle.textContent =
        formatDateReadable(
            dateString
        );


    calendarJourneys.innerHTML =
        "";


    const dayJourneys =
        journeys
            .filter(
                journey =>
                    journey.date ===
                    dateString
            )
            .sort(
                (a, b) =>
                    a.start.localeCompare(
                        b.start
                    )
            );


    if (
        dayJourneys.length ===
        0
    ) {

        calendarJourneys.innerHTML = `

            <div class="empty-state">

                <div
                    style="font-size:40px;"
                >
                    🦷
                </div>

                <h3>
                    No hay jornadas este día
                </h3>

                <p>
                    Puedes añadir una jornada para este día.
                </p>

            </div>

        `;

    } else {

        dayJourneys.forEach(
            journey => {

                calendarJourneys.insertAdjacentHTML(
                    "beforeend",
                    journeyHTML(
                        journey
                    )
                );

            }
        );

    }


    attachJourneyButtons();

}
/* =========================================
   CLÍNICAS
========================================= */

function loadClinics() {

    clinicsList.innerHTML = "";

    if (clinics.length === 0) {

        clinicsList.innerHTML = `

            <div class="empty-state">

                <div
                    style="font-size:40px;"
                >
                    🏥
                </div>

                <h3>
                    No tienes clínicas
                </h3>

                <p>
                    Añade tu primera clínica para empezar.
                </p>

            </div>

        `;

        loadClinicOptions();

        return;
    }


    clinics.forEach(
        clinic => {

            clinicsList.insertAdjacentHTML(
                "beforeend",
                `

                    <div class="clinic-card">

                        <div class="clinic-info">

                            <h3>
                                🏥
                                ${escapeHTML(
                                    clinic.name
                                )}
                            </h3>


                            ${
                                clinic.address
                                    ? `
                                        <p>
                                            📍
                                            ${escapeHTML(
                                                clinic.address
                                            )}
                                        </p>
                                    `
                                    : ""
                            }


                            ${
                                clinic.notes
                                    ? `
                                        <p>
                                            📝
                                            ${escapeHTML(
                                                clinic.notes
                                            )}
                                        </p>
                                    `
                                    : ""
                            }

                        </div>


                        <div class="clinic-actions">

                            <button
                                class="edit-button"
                                data-edit-clinic="${clinic.id}"
                            >
                                ✏️ Editar
                            </button>


                            <button
                                class="delete-button"
                                data-delete-clinic="${clinic.id}"
                            >
                                🗑️ Eliminar
                            </button>

                        </div>

                    </div>

                `
            );

        }
    );


    clinicsList
        .querySelectorAll(
            "[data-edit-clinic]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        openClinicModal(
                            Number(
                                button.dataset
                                    .editClinic
                            )
                        );

                    }
                );

            }
        );


    clinicsList
        .querySelectorAll(
            "[data-delete-clinic]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        deleteClinic(
                            Number(
                                button.dataset
                                    .deleteClinic
                            )
                        );

                    }
                );

            }
        );


    loadClinicOptions();

}


/* =========================================
   MODAL CLÍNICA
========================================= */

addClinicButton.addEventListener(
    "click",
    () => {

        openClinicModal();

    }
);


closeClinicModal.addEventListener(
    "click",
    closeClinicModalFunction
);


function openClinicModal(
    clinicId = null
) {

    editingClinicId =
        clinicId;


    clinicModal.classList.remove(
        "hidden"
    );


    if (clinicId) {

        const clinic =
            clinics.find(
                c =>
                    c.id ===
                    clinicId
            );


        if (!clinic) return;


        clinicModalTitle.textContent =
            "Editar clínica";


        clinicName.value =
            clinic.name || "";


        clinicAddress.value =
            clinic.address || "";


        clinicNotes.value =
            clinic.notes || "";


    } else {

        clinicModalTitle.textContent =
            "Añadir clínica";


        clinicName.value =
            "";


        clinicAddress.value =
            "";


        clinicNotes.value =
            "";

    }

}


function closeClinicModalFunction() {

    clinicModal.classList.add(
        "hidden"
    );


    editingClinicId =
        null;

}


/* =========================================
   GUARDAR CLÍNICA
========================================= */

saveClinicButton.addEventListener(
    "click",
    () => {

        const name =
            clinicName.value.trim();


        const address =
            clinicAddress.value.trim();


        const notes =
            clinicNotes.value.trim();


        if (!name) {

            alert(
                "Introduce el nombre de la clínica."
            );

            return;

        }


        if (editingClinicId) {

            const index =
                clinics.findIndex(
                    clinic =>
                        clinic.id ===
                        editingClinicId
                );


            if (index !== -1) {

                const oldName =
                    clinics[index].name;


                clinics[index] = {

                    ...clinics[index],

                    name,

                    address,

                    notes

                };


                /*
                   Actualizamos las jornadas
                   que pertenecen a esta clínica.
                */

                journeys =
                    journeys.map(
                        journey => {

                            if (
                                journey.clinicId ===
                                editingClinicId
                            ) {

                                return {

                                    ...journey,

                                    clinic:
                                        name

                                };

                            }


                            /*
                               Compatibilidad con
                               jornadas antiguas.
                            */

                            if (
                                !journey.clinicId &&
                                journey.clinic ===
                                    oldName
                            ) {

                                return {

                                    ...journey,

                                    clinic:
                                        name

                                };

                            }


                            return journey;

                        }
                    );


                saveJourneys();

            }


        } else {

            clinics.push({

                id:
                    Date.now(),

                name,

                address,

                notes

            });

        }


        localStorage.setItem(
            "clinics",
            JSON.stringify(
                clinics
            )
        );


        closeClinicModalFunction();


        loadClinics();

        loadToday();

        renderCalendar();

    }
);


/* =========================================
   ELIMINAR CLÍNICA
========================================= */

function deleteClinic(
    clinicId
) {

    const clinic =
        clinics.find(
            c =>
                c.id ===
                clinicId
        );


    if (!clinic) {
        return;
    }


    const confirmed =
        confirm(
            `¿Seguro que quieres eliminar "${clinic.name}"?`
        );


    if (!confirmed) {
        return;
    }


    /*
       IMPORTANTE:
       Las jornadas existentes NO se eliminan.
    */

    clinics =
        clinics.filter(
            clinic =>
                clinic.id !==
                clinicId
        );


    localStorage.setItem(
        "clinics",
        JSON.stringify(
            clinics
        )
    );


    loadClinics();

    loadToday();

    renderCalendar();

}


/* =========================================
   AJUSTES
========================================= */

function loadSettings() {

    settingsName.value =
        localStorage.getItem(
            "userName"
        ) || "";


    const notifications =
        localStorage.getItem(
            "notificationsEnabled"
        );


    notificationsToggle.checked =
        notifications === null
            ? true
            : notifications === "true";


    notificationTime.value =
        localStorage.getItem(
            "notificationTime"
        ) || "06:00";


    reminderMinutes.value =
        localStorage.getItem(
            "reminderMinutes"
        ) || "30";

}


/* =========================================
   GUARDAR NOMBRE
========================================= */

saveNameButton.addEventListener(
    "click",
    () => {

        const name =
            settingsName.value.trim();


        if (!name) {

            alert(
                "Introduce tu nombre."
            );

            return;

        }


        userName =
            name;


        localStorage.setItem(
            "userName",
            userName
        );


        updateHeader();


        alert(
            "Nombre guardado correctamente."
        );

    }
);


/* =========================================
   NOTIFICACIONES PUSH
========================================= */

const VAPID_PUBLIC_KEY =
    "BH-Zp9xbaHf9Iqxx2tBtgXnBZDYOyZEXuWIyJgjLj4Pr3HJjRIo4Mc0CLdjE6JCAa9Gi_EUe7gXBRXO6GtOFY4k";


const SUPABASE_URL =
    "https://yiapydjwwlonheegniex.supabase.co";


const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_HVicTB_DdpSPKx15AHB--Q_YrjW-feY";


function urlBase64ToUint8Array(
    base64String
) {

    const padding =
        "=".repeat(
            (
                4 -
                base64String.length % 4
            ) % 4
        );


    const base64 =
        (
            base64String +
            padding
        )
            .replace(
                /-/g,
                "+"
            )
            .replace(
                /_/g,
                "/"
            );


    const rawData =
        window.atob(
            base64
        );


    return Uint8Array.from(
        [...rawData].map(
            char =>
                char.charCodeAt(0)
        )
    );

}


async function subscribeToPush() {

    if (
        !(
            "serviceWorker" in
            navigator
        )
    ) {

        throw new Error(
            "Este dispositivo no admite Service Worker."
        );

    }


    if (
        !(
            "PushManager" in
            window
        )
    ) {

        throw new Error(
            "Este dispositivo no admite Web Push."
        );

    }


    const registration =
        await navigator
            .serviceWorker
            .ready;


    let subscription =
        await registration
            .pushManager
            .getSubscription();


    if (!subscription) {

        subscription =
            await registration
                .pushManager
                .subscribe({

                    userVisibleOnly:
                        true,

                    applicationServerKey:
                        urlBase64ToUint8Array(
                            VAPID_PUBLIC_KEY
                        )

                });

    }


    localStorage.setItem(
        "pushSubscription",
        JSON.stringify(
            subscription.toJSON()
        )
    );


    await savePushSubscriptionToSupabase(
        subscription
    );


    return subscription;

}


/* =========================================
   SUPABASE
========================================= */

async function savePushSubscriptionToSupabase(
    subscription
) {

    const subscriptionJSON =
        subscription.toJSON();


    if (
        !subscriptionJSON.endpoint
    ) {

        throw new Error(
            "La suscripción Push no tiene endpoint."
        );

    }


    const response =
        await fetch(
            `${SUPABASE_URL}/rest/v1/push_subscriptions`,
            {

                method:
                    "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                    "apikey":
                        SUPABASE_PUBLISHABLE_KEY,

                    "Authorization":
                        `Bearer ${SUPABASE_PUBLISHABLE_KEY}`,

                    "Prefer":
                        "resolution=merge-duplicates"

                },

                body:
                    JSON.stringify({

                        endpoint:
                            subscriptionJSON.endpoint,

                        subscription:
                            subscriptionJSON

                    })

            }
        );


    if (!response.ok) {

        const errorText =
            await response.text();


        throw new Error(
            `Supabase respondió ${response.status}: ${errorText}`
        );

    }


    console.log(
        "Mi Agenda Dental: suscripción guardada en Supabase"
    );

}


/* =========================================
   ACTIVAR NOTIFICACIONES
========================================= */

notificationsToggle.addEventListener(
    "change",
    async () => {

        if (
            notificationsToggle.checked
        ) {

            if (
                "Notification" in
                window
            ) {

                const permission =
                    await Notification
                        .requestPermission();


                if (
                    permission !==
                    "granted"
                ) {

                    notificationsToggle
                        .checked =
                        false;


                    localStorage.setItem(
                        "notificationsEnabled",
                        "false"
                    );


                    alert(
                        "Para recibir notificaciones debes permitirlas en los ajustes del dispositivo."
                    );


                    return;

                }

            } else {

                notificationsToggle
                    .checked =
                    false;


                localStorage.setItem(
                    "notificationsEnabled",
                    "false"
                );


                alert(
                    "Este dispositivo no admite notificaciones web."
                );


                return;

            }


            try {

                await subscribeToPush();


                console.log(
                    "Mi Agenda Dental: suscripción Push creada"
                );


            } catch (error) {

                console.error(
                    "Error creando la suscripción Push:",
                    error
                );


                notificationsToggle
                    .checked =
                    false;


                localStorage.setItem(
                    "notificationsEnabled",
                    "false"
                );


                const errorMessage =
                    error &&
                    error.message
                        ? error.message
                        : String(error);


                alert(
                    "ERROR REAL DE NOTIFICACIONES:\n\n" +
                    errorMessage
                );


                return;

            }

        }


        localStorage.setItem(
            "notificationsEnabled",
            notificationsToggle.checked
        );

    }
);


/* =========================================
   HORA DE NOTIFICACIÓN
========================================= */

notificationTime.addEventListener(
    "change",
    () => {

        localStorage.setItem(
            "notificationTime",
            notificationTime.value
        );

    }
);


/* =========================================
   RECORDATORIO
========================================= */

reminderMinutes.addEventListener(
    "change",
    () => {

        localStorage.setItem(
            "reminderMinutes",
            reminderMinutes.value
        );

    }
);
//* =========================================
   NAVEGACIÓN
========================================= */

document
    .querySelectorAll(".nav-button")
    .forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const page =
                    button.dataset.page;


                /* BOTÓN ACTIVO */

                document
                    .querySelectorAll(
                        ".nav-button"
                    )
                    .forEach(btn => {

                        btn.classList.remove(
                            "active"
                        );

                    });


                button.classList.add(
                    "active"
                );


                /* OCULTAR TODAS LAS SECCIONES */

                const sections = {

                    hoy:
                        document.getElementById(
                            "todaySection"
                        ),

                    calendario:
                        document.getElementById(
                            "calendarSection"
                        ),

                    clinicas:
                        document.getElementById(
                            "clinicsSection"
                        ),

                    ajustes:
                        document.getElementById(
                            "settingsSection"
                        )

                };


                Object.values(
                    sections
                ).forEach(section => {

                    if (section) {

                        section.classList.add(
                            "hidden"
                        );

                    }

                });


                /* MOSTRAR LA SECCIÓN ELEGIDA */

                const target =
                    sections[page];


                if (target) {

                    target.classList.remove(
                        "hidden"
                    );

                }


                /* ACTUALIZAR CONTENIDO */

                if (
                    page === "hoy"
                ) {

                    updateHeader();

                    loadToday();

                }


                if (
                    page === "calendario"
                ) {

                    renderCalendar();

                    selectCalendarDay(
                        selectedCalendarDate
                    );

                }


                if (
                    page === "clinicas"
                ) {

                    loadClinics();

                }


                if (
                    page === "ajustes"
                ) {

                    loadSettings();

                }

            }
        );

    });

/* =========================================
   CERRAR MODALES
========================================= */

if (journeyModal) {

    journeyModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                journeyModal
            ) {

                closeJourneyModalFunction();

            }

        }
    );

}


if (clinicModal) {

    clinicModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                clinicModal
            ) {

                closeClinicModalFunction();

            }

        }
    );

}


/* =========================================
   SERVICE WORKER / PWA
========================================= */

if (
    "serviceWorker" in
    navigator
) {

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker
                .register(
                    "./sw.js"
                )
                .then(
                    registration => {

                        console.log(
                            "Mi Agenda Dental: Service Worker activo",
                            registration.scope
                        );

                    }
                )
                .catch(
                    error => {

                        console.log(
                            "Error registrando Service Worker:",
                            error
                        );

                    }
                );

        }
    );

}


/* =========================================
   UTILIDADES
========================================= */

function getClinicName(
    clinicId
) {

    if (!clinicId) {
        return "";
    }


    const clinic =
        clinics.find(
            clinic =>
                String(
                    clinic.id
                ) ===
                String(
                    clinicId
                )
        );


    return clinic
        ? clinic.name
        : "";

}


/* =========================================
   ESCAPAR HTML
========================================= */

function escapeHTML(
    text
) {

    if (
        text === null ||
        text === undefined
    ) {

        return "";
    }


    return String(text)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}