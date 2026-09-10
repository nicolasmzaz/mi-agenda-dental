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


/* =========================================
   MODAL JORNADA
========================================= */

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


/* =========================================
   MODAL CLÍNICA
========================================= */

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


/* =========================================
   AJUSTES
========================================= */

const settingsName =
    document.getElementById("settingsName");

const saveNameButton =
    document.getElementById("saveNameButton");

const notificationsToggle =
    document.getElementById("notificationsToggle");

const notificationTime =
    document.getElementById("notificationTime");

const reminderMinutes =
    document.getElementById("reminderMinutes");


/* =========================================
   INICIO
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (userName) {

            showApp();

        } else {

            welcomeScreen.style.display =
                "flex";

            appScreen.style.display =
                "none";
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
                "Por favor, introduce tu nombre."
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

    welcomeScreen.style.display =
        "none";

    appScreen.style.display =
        "block";

    updateHeader();
    loadToday();
    loadClinics();
    renderCalendar();
}


/* =========================================
   CABECERA
========================================= */

function updateHeader() {

    if (!greeting || !dateText) {
        return;
    }

    const now =
        new Date();

    const hour =
        now.getHours();

    let greetingText =
        "Buenos días";

    if (hour >= 14 && hour < 20) {

        greetingText =
            "Buenas tardes";

    } else if (hour >= 20) {

        greetingText =
            "Buenas noches";
    }

    greeting.textContent =
        `${greetingText}, ${userName || ""}`;

    dateText.textContent =
        now.toLocaleDateString(
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
   FECHAS
========================================= */

function getTodayString() {

    const date =
        new Date();

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


function formatDate(dateString) {

    if (!dateString) {
        return "";
    }

    const parts =
        dateString.split("-");

    if (parts.length !== 3) {
        return dateString;
    }

    return `${parts[2]}/${parts[1]}/${parts[0]}`;
}


function formatDateReadable(dateString) {

    if (!dateString) {
        return "";
    }

    const date =
        new Date(
            `${dateString}T12:00:00`
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

    if (!todayJourneys) {
        return;
    }

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
                    (a.start || "")
                        .localeCompare(
                            b.start || ""
                        )
            );

    let totalPatients = 0;

    todayList.forEach(
        journey => {

            totalPatients +=
                Number(
                    journey.patients || 0
                );
        }
    );

    if (todayPatients) {

        todayPatients.textContent =
            totalPatients;
    }

    if (!todayList.length) {

        todayJourneys.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📅</div>
                <p>No tienes jornadas para hoy.</p>
            </div>
        `;

        return;
    }

    todayJourneys.innerHTML =
        todayList
            .map(
                journey =>
                    journeyHTML(journey)
            )
            .join("");

    attachJourneyButtons(
        todayJourneys
    );
}


/* =========================================
   HTML JORNADA
========================================= */

function journeyHTML(journey) {

    const clinic =
        journey.clinic ||
        getClinicName(
            journey.clinicId
        ) ||
        "Clínica";

    const patients =
        Number(
            journey.patients || 0
        );

    return `
        <div class="journey-card">

            <div class="journey-card-header">

                <div>

                    <h3>
                        ${escapeHTML(clinic)}
                    </h3>

                    <div class="journey-time">
                        ${escapeHTML(journey.start || "")}
                        -
                        ${escapeHTML(journey.end || "")}
                    </div>

                </div>

                <div class="journey-patients">
                    ${patients}
                </div>

            </div>

            ${
                journey.recurring
                    ? `
                        <div class="recurring-pill">
                            Jornada recurrente
                        </div>
                    `
                    : ""
            }

            ${
                journey.notes
                    ? `
                        <div class="journey-notes">
                            ${escapeHTML(
                                journey.notes
                            )}
                        </div>
                    `
                    : ""
            }

            <div class="journey-actions">

                <button
                    class="secondary-button"
                    data-edit-journey="${journey.id}"
                >
                    Editar
                </button>

                <button
                    class="danger-button"
                    data-delete-journey="${journey.id}"
                >
                    Eliminar
                </button>

            </div>

        </div>
    `;
}


/* =========================================
   BOTONES JORNADAS
========================================= */

function attachJourneyButtons(
    container
) {

    container
        .querySelectorAll(
            "[data-edit-journey]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        openJourneyModal(
                            button.dataset
                                .editJourney
                        );
                    }
                );
            }
        );


    container
        .querySelectorAll(
            "[data-delete-journey]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        deleteJourney(
                            button.dataset
                                .deleteJourney
                        );
                    }
                );
            }
        );
}


/* =========================================
   AÑADIR JORNADA DESDE HOY
========================================= */

if (addTodayButton) {

    addTodayButton.addEventListener(
        "click",
        () => {

            openJourneyModal(
                null,
                getTodayString()
            );
        }
    );
}


/* =========================================
   MODAL JORNADA
========================================= */

function openJourneyModal(
    journeyId = null,
    date = null
) {

    editingJourneyId =
        journeyId;

    if (journeyId) {

        const journey =
            journeys.find(
                item =>
                    String(item.id) ===
                    String(journeyId)
            );

        if (!journey) {
            return;
        }

        journeyModalTitle.textContent =
            "Editar jornada";

        journeyDate.value =
            journey.date || "";

        loadClinicOptions();

        clinicSelect.value =
            journey.clinicId || "";

        startTime.value =
            journey.start || "";

        endTime.value =
            journey.end || "";

        patientsInput.value =
            journey.patients || "";

        notesInput.value =
            journey.notes || "";

        repeatSection.style.display =
            "none";

    } else {

        journeyModalTitle.textContent =
            "Nueva jornada";

        journeyDate.value =
            date || getTodayString();

        loadClinicOptions();

        startTime.value = "";
        endTime.value = "";
        patientsInput.value = "";
        notesInput.value = "";

        repeatSelect.value =
            "none";

        repeatOptions.style.display =
            "none";

        repeatEndDate.value =
            "";

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

        repeatSection.style.display =
            "block";
    }

    journeyModal.style.display =
        "flex";
}


function closeJourneyModalFunction() {

    journeyModal.style.display =
        "none";

    editingJourneyId =
        null;
}


closeJourneyModal.addEventListener(
    "click",
    closeJourneyModalFunction
);


/* =========================================
   CLÍNICAS EN SELECT
========================================= */

function loadClinicOptions() {

    if (!clinicSelect) {
        return;
    }

    clinicSelect.innerHTML = `
        <option value="">
            Selecciona una clínica
        </option>
    `;

    clinics.forEach(
        clinic => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                clinic.id;

            option.textContent =
                clinic.name;

            clinicSelect.appendChild(
                option
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

            repeatOptions.style.display =
                "block";

        } else {

            repeatOptions.style.display =
                "none";
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


        if (
            !date ||
            !clinicId ||
            !start ||
            !end
        ) {

            alert(
                "Completa la fecha, clínica, hora de inicio y hora de finalización."
            );

            return;
        }


        const clinic =
            clinics.find(
                item =>
                    String(item.id) ===
                    String(clinicId)
            );


        if (!clinic) {

            alert(
                "No se ha encontrado la clínica."
            );

            return;
        }


        /* =================================
           EDITAR
        ================================= */

        if (editingJourneyId) {

            const index =
                journeys.findIndex(
                    item =>
                        String(item.id) ===
                        String(
                            editingJourneyId
                        )
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


        /* =================================
           NUEVA JORNADA
        ================================= */

        const repeat =
            repeatSelect.value;


        if (repeat !== "weekly") {

            journeys.push({

                id:
                    Date.now().toString(),

                date,

                clinicId,

                clinic:
                    clinic.name,

                start,

                end,

                patients,

                notes
            });


        } else {

            /* =============================
               JORNADA SEMANAL
            ============================= */

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


            if (!selectedDays.length) {

                alert(
                    "Selecciona al menos un día de la semana."
                );

                return;
            }


            if (!repeatEndDate.value) {

                alert(
                    "Selecciona la fecha de finalización de la repetición."
                );

                return;
            }


            const endDate =
                new Date(
                    `${repeatEndDate.value}T12:00:00`
                );

            const firstDate =
                new Date(
                    `${date}T12:00:00`
                );


            if (
                endDate <
                firstDate
            ) {

                alert(
                    "La fecha de finalización debe ser posterior a la fecha inicial."
                );

                return;
            }


            const seriesId =
                Date.now().toString();


            const current =
                new Date(firstDate);


            while (
                current <= endDate
            ) {

                const weekday =
                    current.getDay();


                if (
                    selectedDays.includes(
                        weekday
                    )
                ) {

                    const year =
                        current.getFullYear();

                    const month =
                        String(
                            current.getMonth() + 1
                        ).padStart(
                            2,
                            "0"
                        );

                    const day =
                        String(
                            current.getDate()
                        ).padStart(
                            2,
                            "0"
                        );


                    journeys.push({

                        id:
                            `${seriesId}-${year}${month}${day}`,

                        seriesId,

                        recurring:
                            true,

                        date:
                            `${year}-${month}-${day}`,

                        clinicId,

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
   ELIMINAR JORNADA
========================================= */

function deleteJourney(
    journeyId
) {

    const confirmed =
        confirm(
            "¿Seguro que quieres eliminar esta jornada?"
        );

    if (!confirmed) {
        return;
    }


    journeys =
        journeys.filter(
            journey =>
                String(journey.id) !==
                String(journeyId)
        );


    saveJourneys();

    loadToday();

    renderCalendar();

    selectCalendarDay(
        selectedCalendarDate
    );
}


/* =========================================
   CALENDARIO
========================================= */

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
   RENDER CALENDARIO
========================================= */

function renderCalendar() {

    if (
        !calendarMonth ||
        !calendarDays
    ) {
        return;
    }


    const year =
        calendarDate.getFullYear();

    const month =
        calendarDate.getMonth();


    const monthName =
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


    calendarMonth.textContent =
        monthName.charAt(0).toUpperCase() +
        monthName.slice(1);


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


    /*
       JavaScript:
       domingo = 0
       lunes = 1

       Queremos:
       lunes = 0
       domingo = 6
    */

    const offset =
        firstDay === 0
            ? 6
            : firstDay - 1;


    for (
        let i = 0;
        i < offset;
        i++
    ) {

        const empty =
            document.createElement(
                "div"
            );

        empty.className =
            "calendar-day empty";

        calendarDays.appendChild(
            empty
        );
    }


    const today =
        getTodayString();


    for (
        let day = 1;
        day <= daysInMonth;
        day++
    ) {

        const dateString =
            `${year}-${String(
                month + 1
            ).padStart(2, "0")}-${String(
                day
            ).padStart(2, "0")}`;


        const dayElement =
            document.createElement(
                "button"
            );


        dayElement.className =
            "calendar-day";


        if (
            dateString === today
        ) {

            dayElement.classList.add(
                "today"
            );
        }


        if (
            dateString ===
            selectedCalendarDate
        ) {

            dayElement.classList.add(
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

            dayElement.classList.add(
                "has-journey"
            );
        }


        dayElement.innerHTML = `
            <span>
                ${day}
            </span>

            ${
                hasJourney
                    ? `<span class="calendar-dot"></span>`
                    : ""
            }
        `;


        dayElement.addEventListener(
            "click",
            () => {

                selectCalendarDay(
                    dateString
                );
            }
        );


        calendarDays.appendChild(
            dayElement
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


    if (selectedDateTitle) {

        selectedDateTitle.textContent =
            formatDateReadable(
                dateString
            );
    }


    if (!calendarJourneys) {
        return;
    }


    const selectedJourneys =
        journeys
            .filter(
                journey =>
                    journey.date ===
                    dateString
            )
            .sort(
                (a, b) =>
                    (a.start || "")
                        .localeCompare(
                            b.start || ""
                        )
            );


    if (!selectedJourneys.length) {

        calendarJourneys.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📅</div>
                <p>No hay jornadas este día.</p>
            </div>
        `;

    } else {

        calendarJourneys.innerHTML =
            selectedJourneys
                .map(
                    journey =>
                        journeyHTML(
                            journey
                        )
                )
                .join("");

        attachJourneyButtons(
            calendarJourneys
        );
    }


    renderCalendarSelection();
}


function renderCalendarSelection() {

    if (!calendarDays) {
        return;
    }


    calendarDays
        .querySelectorAll(
            ".calendar-day"
        )
        .forEach(
            day => {

                day.classList.remove(
                    "selected"
                );
            }
        );


    const buttons =
        calendarDays
            .querySelectorAll(
                ".calendar-day"
            );


    buttons.forEach(
        button => {

            const span =
                button.querySelector(
                    "span"
                );

            if (!span) {
                return;
            }

            /*
               Se vuelve a comprobar
               por posición/calendario
               mediante renderCalendar()
            */
        }
    );


    renderCalendar();
}


if (addCalendarJourney) {

    addCalendarJourney.addEventListener(
        "click",
        () => {

            openJourneyModal(
                null,
                selectedCalendarDate
            );
        }
    );
}
/* =========================================
   CLÍNICAS
========================================= */

function loadClinics() {

    if (!clinicsList) {
        return;
    }

    clinicsList.innerHTML = "";

    if (!clinics.length) {

        clinicsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">🏥</div>
                <p>No tienes clínicas añadidas.</p>
            </div>
        `;

        loadClinicOptions();

        return;
    }


    clinicsList.innerHTML =
        clinics
            .map(
                clinic => `
                    <div class="clinic-card">

                        <div class="clinic-card-content">

                            <h3>
                                ${escapeHTML(
                                    clinic.name
                                )}
                            </h3>

                            ${
                                clinic.address
                                    ? `
                                        <div class="clinic-address">
                                            📍
                                            ${escapeHTML(
                                                clinic.address
                                            )}
                                        </div>
                                    `
                                    : ""
                            }

                            ${
                                clinic.notes
                                    ? `
                                        <div class="clinic-notes">
                                            ${escapeHTML(
                                                clinic.notes
                                            )}
                                        </div>
                                    `
                                    : ""
                            }

                        </div>

                        <div class="clinic-actions">

                            <button
                                class="secondary-button"
                                data-edit-clinic="${clinic.id}"
                            >
                                Editar
                            </button>

                            <button
                                class="danger-button"
                                data-delete-clinic="${clinic.id}"
                            >
                                Eliminar
                            </button>

                        </div>

                    </div>
                `
            )
            .join("");


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
                            button.dataset
                                .editClinic
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
                            button.dataset
                                .deleteClinic
                        );
                    }
                );
            }
        );


    loadClinicOptions();
}


/* =========================================
   ABRIR MODAL CLÍNICA
========================================= */

function openClinicModal(
    clinicId = null
) {

    editingClinicId =
        clinicId;


    if (clinicId) {

        const clinic =
            clinics.find(
                item =>
                    String(item.id) ===
                    String(clinicId)
            );


        if (!clinic) {
            return;
        }


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
            "Nueva clínica";


        clinicName.value =
            "";

        clinicAddress.value =
            "";

        clinicNotes.value =
            "";
    }


    clinicModal.style.display =
        "flex";
}


/* =========================================
   CERRAR MODAL CLÍNICA
========================================= */

function closeClinicModalFunction() {

    clinicModal.style.display =
        "none";

    editingClinicId =
        null;
}


closeClinicModal.addEventListener(
    "click",
    closeClinicModalFunction
);


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


        /* =============================
           EDITAR CLÍNICA
        ============================= */

        if (editingClinicId) {

            const index =
                clinics.findIndex(
                    clinic =>
                        String(clinic.id) ===
                        String(
                            editingClinicId
                        )
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
                   Actualizamos también
                   el nombre de la clínica
                   en las jornadas existentes.
                */

                journeys =
                    journeys.map(
                        journey => {

                            if (
                                String(
                                    journey.clinicId
                                ) ===
                                String(
                                    editingClinicId
                                )
                            ) {

                                return {

                                    ...journey,

                                    clinic: name
                                };
                            }


                            /*
                               Compatibilidad con
                               jornadas antiguas
                               que solo guardasen
                               el nombre.
                            */

                            if (
                                !journey.clinicId &&
                                journey.clinic ===
                                    oldName
                            ) {

                                return {

                                    ...journey,

                                    clinic: name
                                };
                            }


                            return journey;
                        }
                    );


                saveJourneys();
            }


        } else {

            /* =============================
               NUEVA CLÍNICA
            ============================= */

            clinics.push({

                id:
                    Date.now().toString(),

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

        selectCalendarDay(
            selectedCalendarDate
        );
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
            item =>
                String(item.id) ===
                String(clinicId)
        );


    if (!clinic) {
        return;
    }


    const confirmed =
        confirm(
            `¿Quieres eliminar la clínica "${clinic.name}"?`
        );


    if (!confirmed) {
        return;
    }


    /*
       IMPORTANTE:
       Eliminar la clínica NO elimina
       las jornadas que ya existen.
    */

    clinics =
        clinics.filter(
            item =>
                String(item.id) !==
                String(clinicId)
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

    selectCalendarDay(
        selectedCalendarDate
    );
}


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

        const notifications =
            localStorage.getItem(
                "notificationsEnabled"
            );


        notificationsToggle.checked =
            notifications === null
                ? true
                : notifications === "true";
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
            ) || "30";
    }
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
   GUARDAR SUSCRIPCIÓN EN SUPABASE
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
   ACTIVAR / DESACTIVAR NOTIFICACIONES
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

                const target =
                    button.dataset.page;


                navButtons.forEach(
                    item => {

                        item.classList.remove(
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
                        target
                    );


                if (targetPage) {

                    targetPage.classList.add(
                        "active"
                    );
                }


                if (target === "hoy") {

                    updateHeader();

                    loadToday();
                }


                if (
                    target ===
                    "calendario"
                ) {

                    renderCalendar();

                    selectCalendarDay(
                        selectedCalendarDate
                    );
                }


                if (
                    target ===
                    "clinicas"
                ) {

                    loadClinics();
                }


                if (
                    target ===
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
            item =>
                String(item.id) ===
                String(clinicId)
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