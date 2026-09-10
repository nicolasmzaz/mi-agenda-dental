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
            Number(
                patientsInput.value || 0
            );

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


        if (!start || !end) {

            alert(
                "Introduce la hora de inicio y finalización."
            );

            return;

        }


        if (end <= start) {

            alert(
                "La hora de finalización debe ser posterior a la de inicio."
            );

            return;

        }


        const clinic =
            clinics.find(
                c =>
                    String(c.id) ===
                    String(clinicId)
            );


        if (!clinic) {

            alert(
                "La clínica seleccionada no existe."
            );

            return;

        }


        /* EDITAR */

        if (editingJourneyId) {

            const index =
                journeys.findIndex(
                    journey =>
                        journey.id ===
                        editingJourneyId
                );


            if (index !== -1) {

                journeys[index] = {

                    ...journeys[index],

                    date,

                    clinicId,

                    clinic:
                        clinic.name,

                    start,

                    end,

                    patients,

                    notes

                };

            }


            saveJourneys();

            closeJourneyModalFunction();

            loadToday();

            renderCalendar();

            selectCalendarDay(
                selectedCalendarDate
            );

            return;

        }


        /* NUEVA JORNADA */

        const repeatType =
            repeatSelect.value;


        if (
            repeatType ===
            "weekly"
        ) {

            createWeeklyJourneys(
                date,
                clinic,
                start,
                end,
                patients,
                notes
            );

        } else {

            const journey = {

                id:
                    Date.now(),

                date,

                clinicId,

                clinic:
                    clinic.name,

                start,

                end,

                patients,

                notes

            };


            journeys.push(
                journey
            );

        }


        saveJourneys();

        closeJourneyModalFunction();

        loadToday();

        renderCalendar();

        selectCalendarDay(
            selectedCalendarDate
        );

    }
);


/* =========================================
   JORNADAS SEMANALES
========================================= */

function createWeeklyJourneys(
    startDateString,
    clinic,
    start,
    end,
    patients,
    notes
) {

    const selectedDays =
        Array.from(
            document.querySelectorAll(
                ".repeat-day:checked"
            )
        ).map(
            checkbox =>
                Number(
                    checkbox.value
                )
        );


    if (
        selectedDays.length === 0
    ) {

        alert(
            "Selecciona al menos un día de la semana."
        );

        return;

    }


    const endDateString =
        repeatEndDate.value;


    if (!endDateString) {

        alert(
            "Selecciona hasta qué fecha quieres repetir."
        );

        return;

    }


    if (
        endDateString <
        startDateString
    ) {

        alert(
            "La fecha final debe ser posterior a la fecha inicial."
        );

        return;

    }


    const seriesId =
        Date.now();


    const current =
        new Date(
            startDateString +
            "T00:00:00"
        );


    const finalDate =
        new Date(
            endDateString +
            "T00:00:00"
        );


    while (
        current <=
        finalDate
    ) {

        const day =
            current.getDay();


        if (
            selectedDays.includes(
                day
            )
        ) {

            journeys.push({

                id:
                    Date.now() +
                    Math.random(),

                seriesId,

                recurring:
                    true,

                date:
                    formatDate(
                        current
                    ),

                clinicId:
                    clinic.id,

                clinic:
                    clinic.name,

                start,

                end,

                patients,

                notes

            });

        }


        current.setDate(
            current.getDate() + 1
        );

    }

}


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


    if (
        !confirm(
            "¿Seguro que quieres eliminar esta jornada?"
        )
    ) {

        return;

    }


    journeys =
        journeys.filter(
            j =>
                j.id !== id
        );


    saveJourneys();

    loadToday();

    renderCalendar();

    selectCalendarDay(
        selectedCalendarDate
    );

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
                    Añade tu primera clínica para poder crear jornadas.
                </p>

            </div>

        `;

        return;

    }


    clinics.forEach(
        clinic => {

            clinicsList.insertAdjacentHTML(
                "beforeend",
                clinicHTML(clinic)
            );

        }
    );


    attachClinicButtons();

}


/* =========================================
   HTML CLÍNICA
========================================= */

function clinicHTML(clinic) {

    return `

        <div class="clinic-card">

            <div class="clinic-header">

                <div class="clinic-icon">
                    🏥
                </div>


                <div class="clinic-main">

                    <h3>
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

                </div>

            </div>


            ${
                clinic.notes
                    ? `
                        <div class="clinic-notes">

                            📝
                            ${escapeHTML(
                                clinic.notes
                            )}

                        </div>
                    `
                    : ""
            }


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

    `;

}


/* =========================================
   BOTONES CLÍNICAS
========================================= */

function attachClinicButtons() {

    document
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


    document
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

}


/* =========================================
   AÑADIR CLÍNICA
========================================= */

addClinicButton.addEventListener(
    "click",
    () => {

        openClinicModal();

    }
);


/* =========================================
   ABRIR MODAL CLÍNICA
========================================= */

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


/* =========================================
   CERRAR MODAL CLÍNICA
========================================= */

closeClinicModal.addEventListener(
    "click",
    () => {

        clinicModal.classList.add(
            "hidden"
        );

    }
);


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
                "Escribe el nombre de la clínica."
            );

            return;

        }


        /* EDITAR */

        if (editingClinicId) {

            const index =
                clinics.findIndex(
                    clinic =>
                        clinic.id ===
                        editingClinicId
                );


            if (index !== -1) {

                clinics[index] = {

                    ...clinics[index],

                    name,

                    address,

                    notes

                };


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


                            return journey;

                        }
                    );

            }


        } else {

            /* NUEVA CLÍNICA */

            const newClinic = {

                id:
                    Date.now(),

                name,

                address,

                notes

            };


            clinics.push(
                newClinic
            );

        }


        localStorage.setItem(
            "clinics",
            JSON.stringify(
                clinics
            )
        );


        saveJourneys();


        clinicModal.classList.add(
            "hidden"
        );


        loadClinics();

        loadToday();

        renderCalendar();

    }
);


/* =========================================
   ELIMINAR CLÍNICA
========================================= */

function deleteClinic(id) {

    const clinic =
        clinics.find(
            c =>
                c.id === id
        );


    if (!clinic) return;


    if (
        !confirm(
            `¿Seguro que quieres eliminar la clínica "${clinic.name}"?`
        )
    ) {

        return;

    }


    /*
       IMPORTANTE:
       Al eliminar una clínica NO
       eliminamos sus jornadas.
    */

    clinics =
        clinics.filter(
            c =>
                c.id !== id
        );


    localStorage.setItem(
        "clinics",
        JSON.stringify(
            clinics
        )
    );


    loadClinics();

}


/* =========================================
   CALENDARIO
========================================= */

function renderCalendar() {

    const year =
        calendarDate.getFullYear();

    const month =
        calendarDate.getMonth();


    const monthName =
        calendarDate.toLocaleDateString(
            "es-ES",
            {
                month: "long",
                year: "numeric"
            }
        );


    calendarMonth.textContent =
        monthName.charAt(0).toUpperCase() +
        monthName.slice(1);


    calendarDays.innerHTML = "";


    /*
       Día de la semana del primer día.
       JS usa domingo = 0.
       Lo convertimos para que lunes sea 0.
    */

    const firstDay =
        new Date(
            year,
            month,
            1
        ).getDay();


    const mondayFirst =
        firstDay === 0
            ? 6
            : firstDay - 1;


    const daysInMonth =
        new Date(
            year,
            month + 1,
            0
        ).getDate();


    /*
       Días del mes anterior
    */

    const previousMonthDays =
        new Date(
            year,
            month,
            0
        ).getDate();


    for (
        let i = mondayFirst - 1;
        i >= 0;
        i--
    ) {

        const day =
            previousMonthDays -
            i;


        const cell =
            document.createElement(
                "div"
            );


        cell.className =
            "calendar-day other-month";


        cell.innerHTML = `
            <span>
                ${day}
            </span>
        `;


        calendarDays.appendChild(
            cell
        );

    }


    /*
       Días del mes actual
    */

    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const cell =
            document.createElement(
                "div"
            );


        cell.className =
            "calendar-day";


        const dateString =
            `${year}-${String(
                month + 1
            ).padStart(2, "0")}-${String(
                day
            ).padStart(2, "0")}`;


        if (
            dateString ===
            getTodayString()
        ) {

            cell.classList.add(
                "today"
            );

        }


        if (
            dateString ===
            selectedCalendarDate
        ) {

            cell.classList.add(
                "selected"
            );

        }


        const hasJourneys =
            journeys.some(
                journey =>
                    journey.date ===
                    dateString
            );


        cell.innerHTML = `

            <span>
                ${day}
            </span>

            ${
                hasJourneys
                    ? `
                        <div class="calendar-dot"></div>
                    `
                    : ""
            }

        `;


        cell.addEventListener(
            "click",
            () => {

                selectCalendarDay(
                    dateString
                );

            }
        );


        calendarDays.appendChild(
            cell
        );

    }


    /*
       Rellenar las últimas casillas
       para completar semanas.
    */

    const totalCells =
        mondayFirst +
        daysInMonth;


    const remaining =
        totalCells % 7 === 0
            ? 0
            : 7 -
              (totalCells % 7);


    for (
        let day = 1;
        day <= remaining;
        day++
    ) {

        const cell =
            document.createElement(
                "div"
            );


        cell.className =
            "calendar-day other-month";


        cell.innerHTML = `
            <span>
                ${day}
            </span>
        `;


        calendarDays.appendChild(
            cell
        );

    }


    selectCalendarDay(
        selectedCalendarDate
    );

}


/* =========================================
   SELECCIONAR DÍA CALENDARIO
========================================= */

function selectCalendarDay(
    dateString
) {

    selectedCalendarDate =
        dateString;


    selectedDateTitle.textContent =
        formatDateReadable(
            dateString
        );


    const list =
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


    calendarJourneys.innerHTML =
        "";


    if (list.length === 0) {

        calendarJourneys.innerHTML = `

            <div class="empty-state">

                <div
                    style="font-size:36px;"
                >
                    📅
                </div>

                <h3>
                    No hay jornadas
                </h3>

                <p>
                    No tienes ninguna jornada programada para este día.
                </p>

            </div>

        `;

    } else {

        list.forEach(
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


    /*
       Actualizamos la selección
       visual del calendario.
    */

    document
        .querySelectorAll(
            ".calendar-day"
        )
        .forEach(
            cell => {

                cell.classList.remove(
                    "selected"
                );

            }
        );


    /*
       Volvemos a renderizar únicamente
       si estamos en el mes mostrado.
    */

    const year =
        calendarDate.getFullYear();

    const month =
        calendarDate.getMonth();


    const selected =
        new Date(
            dateString +
            "T00:00:00"
        );


    if (
        selected.getFullYear() ===
            year &&
        selected.getMonth() ===
            month
    ) {

        const day =
            selected.getDate();


        const dayCells =
            document.querySelectorAll(
                ".calendar-day:not(.other-month)"
            );


        dayCells.forEach(
            cell => {

                const span =
                    cell.querySelector(
                        "span"
                    );


                if (
                    span &&
                    Number(
                        span.textContent
                    ) === day
                ) {

                    cell.classList.add(
                        "selected"
                    );

                }

            }
        );

    }

}


/* =========================================
   CAMBIAR MES
========================================= */

prevMonth.addEventListener(
    "click",
    () => {

        calendarDate.setMonth(
            calendarDate.getMonth() - 1
        );


        renderCalendar();

    }
);


nextMonth.addEventListener(
    "click",
    () => {

        calendarDate.setMonth(
            calendarDate.getMonth() + 1
        );


        renderCalendar();

    }
);
 /* =========================================
   AJUSTES
========================================= */

function loadSettings() {

    if (settingsName) {

        settingsName.value =
            localStorage.getItem(
                "userName"
            ) || "";

    }


    if (notificationsToggle) {

        notificationsToggle.checked =
            localStorage.getItem(
                "notificationsEnabled"
            ) === "true";

    }


    if (notificationTime) {

        notificationTime.value =
            localStorage.getItem(
                "notificationTime"
            ) || "06:00";

    }


    if (reminderMinutes) {

        reminderMinutes.value =
            localStorage.getItem(
                "reminderMinutes"
            ) || "0";

    }

}


/* =========================================
   GUARDAR NOMBRE
========================================= */

if (saveNameButton) {

    saveNameButton.addEventListener(
        "click",
        () => {

            const newName =
                settingsName.value.trim();


            if (!newName) {

                alert(
                    "Escribe un nombre."
                );

                return;

            }


            userName =
                newName;


            localStorage.setItem(
                "userName",
                userName
            );


            updateHeader();


            alert(
                "Nombre actualizado correctamente."
            );

        }
    );

}


/* =========================================
   PREFERENCIAS DE NOTIFICACIONES
========================================= */

if (notificationTime) {

    notificationTime.addEventListener(
        "change",
        () => {

            localStorage.setItem(
                "notificationTime",
                notificationTime.value
            );

        }
    );

}


if (reminderMinutes) {

    reminderMinutes.addEventListener(
        "change",
        () => {

            localStorage.setItem(
                "reminderMinutes",
                reminderMinutes.value
            );

        }
    );

}


/* =========================================
   NOTIFICACIONES PUSH
========================================= */

const VAPID_PUBLIC_KEY =
    "BH-Zp9xbaHf9Iqxx2tBtgXnBZDYOyZEXuWIyJgjLj4Pr3HJjRIo4Mc0CLdjE6JCAa9Gi_EUe7gXBRXO6GtOFY4k";


function urlBase64ToUint8Array(
    base64String
) {

    const padding =
        "=".repeat(
            (4 -
                base64String.length % 4) %
                4
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
        !("serviceWorker" in navigator)
    ) {

        throw new Error(
            "Este dispositivo no admite Service Worker."
        );

    }


    if (
        !("PushManager" in window)
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


    return subscription;

}


/* =========================================
   ACTIVAR / DESACTIVAR NOTIFICACIONES
========================================= */

if (notificationsToggle) {

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

                        notificationsToggle.checked =
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

                    notificationsToggle.checked =
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


                    notificationsToggle.checked =
                        false;


                    localStorage.setItem(
                        "notificationsEnabled",
                        "false"
                    );


                    alert(
                        "No se ha podido activar el sistema de notificaciones. Comprueba que Mi Agenda Dental está instalada en la pantalla de inicio y vuelve a intentarlo."
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

}


/* =========================================
   NAVEGACIÓN
========================================= */

const navButtons =
    document.querySelectorAll(
        ".nav-button"
    );


const pages =
    document.querySelectorAll(
        ".page"
    );


navButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                const pageName =
                    button.dataset.page;


                navButtons.forEach(
                    navButton => {

                        navButton.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                pages.forEach(
                    page => {

                        page.classList.remove(
                            "active"
                        );

                    }
                );


                const targetPage =
                    document.getElementById(
                        `page-${pageName}`
                    );


                if (targetPage) {

                    targetPage.classList.add(
                        "active"
                    );

                }


                if (
                    pageName ===
                    "hoy"
                ) {

                    loadToday();

                }


                if (
                    pageName ===
                    "calendario"
                ) {

                    renderCalendar();

                }


                if (
                    pageName ===
                    "clinicas"
                ) {

                    loadClinics();

                }


                if (
                    pageName ===
                    "ajustes"
                ) {

                    loadSettings();

                }

            }
        );

    }
);


/* =========================================
   CERRAR MODALES AL PULSAR FUERA
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

                clinicModal.classList.add(
                    "hidden"
                );

            }

        }
    );

}


/* =========================================
   ESCAPE
========================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Escape"
        ) {

            if (
                journeyModal &&
                !journeyModal.classList.contains(
                    "hidden"
                )
            ) {

                closeJourneyModalFunction();

            }


            if (
                clinicModal &&
                !clinicModal.classList.contains(
                    "hidden"
                )
            ) {

                clinicModal.classList.add(
                    "hidden"
                );

            }

        }

    }
);


/* =========================================
   ESCAPAR HTML
========================================= */

function escapeHTML(
    value
) {

    return String(
        value ?? ""
    )
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


/* =========================================
   UTILIDADES
========================================= */

function getClinicName(
    clinicId
) {

    const clinic =
        clinics.find(
            c =>
                String(c.id) ===
                String(clinicId)
        );


    return clinic
        ? clinic.name
        : "";

}


/* =========================================
   ACTUALIZAR JORNADAS AL CAMBIAR CLÍNICA
========================================= */

function refreshJourneyClinicNames() {

    let changed =
        false;


    journeys =
        journeys.map(
            journey => {

                const clinic =
                    clinics.find(
                        c =>
                            String(c.id) ===
                            String(
                                journey.clinicId
                            )
                    );


                if (
                    clinic &&
                    journey.clinic !==
                        clinic.name
                ) {

                    changed =
                        true;


                    return {

                        ...journey,

                        clinic:
                            clinic.name

                    };

                }


                return journey;

            }
        );


    if (changed) {

        saveJourneys();

    }

}


/* =========================================
   VISIBILIDAD DE LA APP
========================================= */

document.addEventListener(
    "visibilitychange",
    () => {

        if (
            !document.hidden
        ) {

            refreshJourneyClinicNames();

            loadToday();

            loadClinics();

        }

    }
);


/* =========================================
   INICIALIZACIÓN EXTRA
========================================= */

refreshJourneyClinicNames();

loadSettings();

updateHeader();

loadToday();

loadClinics();

renderCalendar();


/* =========================================
   SERVICE WORKER
========================================= */

if (
    "serviceWorker" in navigator
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
                            "Mi Agenda Dental: Service Worker registrado",
                            registration.scope
                        );

                    }
                )
                .catch(
                    error => {

                        console.error(
                            "Error registrando Service Worker:",
                            error
                        );

                    }
                );

        }
    );

}
 /* =========================================
   NAVEGACIÓN
========================================= */

document
    .querySelectorAll(
        ".nav-button"
    )
    .forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    const page =
                        button.dataset
                            .page;


                    document
                        .querySelectorAll(
                            ".nav-button"
                        )
                        .forEach(
                            btn => {

                                btn.classList.remove(
                                    "active"
                                );

                            }
                        );


                    button.classList.add(
                        "active"
                    );


                    document
                        .querySelectorAll(
                            ".page"
                        )
                        .forEach(
                            section => {

                                section.classList.remove(
                                    "active"
                                );

                            }
                        );


                    const target =
                        document.getElementById(
                            `page-${page}`
                        );


                    if (target) {

                        target.classList.add(
                            "active"
                        );

                    }


                    if (
                        page ===
                        "hoy"
                    ) {

                        loadToday();

                    }


                    if (
                        page ===
                        "calendario"
                    ) {

                        renderCalendar();

                        selectCalendarDay(
                            selectedCalendarDate
                        );

                    }


                    if (
                        page ===
                        "clinicas"
                    ) {

                        loadClinics();

                    }


                    if (
                        page ===
                        "ajustes"
                    ) {

                        loadSettings();

                    }

                }
            );

        }
    );


/* =========================================
   PWA
========================================= */

if (
    "serviceWorker" in
    navigator
) {

    window.addEventListener(
        "load",
        () => {

            navigator.serviceWorker
                .register("./sw.js")
                .then(
                    () => {

                        console.log(
                            "Mi Agenda Dental: Service Worker activo"
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

function getClinicName(id) {

    const clinic =
        clinics.find(
            c =>
                String(c.id) ===
                String(id)
        );


    return clinic
        ? clinic.name
        : "";

}


function escapeHTML(text) {

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