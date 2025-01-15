import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import GetFascieOrarieFromCalendar from "./GetFascieOrarieFromCalendar";

// Comoponente che mostra un calendario utile per le prenotazioni
const Calendar = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [giornoSelezionato, setGiornoSelezionato] = useState({ giornoDellaSettimana: "", data: "" })

    const daysOfWeek = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];
    const months = [
        "Gennaio",
        "Febbraio",
        "Marzo",
        "Aprile",
        "Maggio",
        "Giugno",
        "Luglio",
        "Agosto",
        "Settembre",
        "Ottobre",
        "Novembre",
        "Dicembre",
    ];

    // Restituisce il numero di giorni in un mese
    function getDaysInMonth(year, month) {
        return new Date(year, month + 1, 0).getDate();
    };

    function renderDays() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();
        const daysInMonth = getDaysInMonth(year, month);

        // Calcolo del giorno iniziale, adattato per partire da Monday
        const firstDayIndex = (new Date(year, month, 1).getDay() + 6) % 7;

        const days = [];

        // Aggiungi celle vuote per il padding dei giorni
        for (let i = 0; i < firstDayIndex; i++) {
            days.push(<div key={`empty-${i}`} className="empty-cell"></div>);
        }

        // Aggiungi i giorni del mese
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day); //Giorno della settimana associato al numero(day)
            const isSunday = date.getDay() === 0;
            const isPast = date < new Date().setHours(0, 0, 0, 0);
            days.push(
                <>
                    {
                        !isSunday ?
                            (
                                <>
                                    <div key={day} className={isPast ? 'sunday-cell' : `day-cell`} >
                                        <button className={isPast ? "btn_past" : "btn_day"} disabled={isPast} type="button" data-bs-toggle="modal" data-bs-target={`#modalGetFascieOrarie`}
                                            onClick={() => {
                                                handleDayClick(date)
                                            }}>{day}</button>
                                    </div>
                                    <GetFascieOrarieFromCalendar giorno={giornoSelezionato} />
                                </>
                            )
                            :
                            (
                                <div key={day} className={`sunday-cell`}>
                                    <button className="btn_sun" disabled>{day}</button>
                                </div>
                            )
                    }
                </>
            );
        }

        // Riempie lo stato giornoSelezionato con giorno della settimana e data associata
        function handleDayClick(date) {
            let dayOfWeek = date.toLocaleDateString('it-IT', { weekday: 'long' });
            dayOfWeek = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1);
            setGiornoSelezionato({ giornoDellaSettimana: `${dayOfWeek}`, data: date.toLocaleDateString('it-IT') })
        }

        // Suddividi i giorni in righe da 7 colonne ciascuna
        return days.map((day, index) => (
            <div key={index} style={{ gridColumn: ((index % 7) + 1) }}>
                {day}
            </div>
        ));
    };

    // Va avanti di un mese quando si clicca su ->
    function handlePrevMonth() {
        const prevMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() - 1,
            1
        );
        setCurrentDate(prevMonth);
    };

    // Va indietro di un mese quando si clicca su <-
    function handleNextMonth() {
        const nextMonth = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth() + 1,
            1
        );
        setCurrentDate(nextMonth);
    };

    return (
        <div className="calendar">
            {/* Intestazione del calendario */}
            <div className="calendar-header">
                <button onClick={handlePrevMonth} type="button" className="btn btn-warning">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-left" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8" />
                    </svg>
                </button>
                <h4>
                    {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h4>
                <button onClick={handleNextMonth} type="button" className="btn btn-warning">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-right" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8" />
                    </svg>
                </button>
            </div>

            {/* Giorni della settimana */}
            <div className="calendar-days-header">
                {daysOfWeek.map((day) => (
                    <div key={day} className="days-header-cell">
                        {day}
                    </div>
                ))}
            </div>

            {/* Giorni del mese */}
            <div className="calendar-days">{renderDays()}</div>
        </div >
    );
};

export default Calendar;
