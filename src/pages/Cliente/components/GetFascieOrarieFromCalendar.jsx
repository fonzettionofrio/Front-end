import React from "react"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';


import { useEffect, useState } from "react";

// Componente che mostra le fascie orarie disponibili in un giorno, i posti rimanenti e permette di prenotarsi
function GetFascieOrarieFromCalendar({ giorno }) {
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null

    // Stato che contiene le fascia orarie del giorno
    const [orari, setOrari] = useState([]);

    // Stato che contiene la fascia oraria nel quale ci si vuole prenotare
    const [orarioSelezionato, setOrarioSelezionato] = useState("")
    const [alertErrore, setAlertErrore] = useState(false)
    const [alertSuccess, setAlertSuccess] = useState(false)
    const [alertPrenotazioneDuplicata, setAlertPrenotazioneDuplicata] = useState(false)
    const [alertPostiFiniti, setAlertPostiFiniti] = useState(false)
    // let strPostiDisponibili = document.getElementById("strPostiDisponibili")

    useEffect(() => {
        // Prende le fascie orarie per quel giorno
        if (user && user.infoUtente && user.infoUtente.palestra && giorno) {
            fetch(`http://localhost:1337/api/orarios?populate=*&filters[palestra_aggiunta][id][$eq]=${user.infoUtente.palestra.id}&filters[Giorno][$eq]=${giorno.giornoDellaSettimana}&filters[palestra_rimozione][$null]=null`)
                .then(response => response.json())
                .then(data => {
                    let tempOrari = []
                    // Per ogni fascia oraria, controlla quanti posti sono disponibili in base al limite di persone settato dalla palestra
                    for (let orario of data.data) {
                        fetch(`http://localhost:1337/api/prenotaziones?populate=*&filters[orario][id][$eq]=${orario.id}&filters[Data][$eq]=${formatDate(giorno.data)}&filters[palestra_rimozione][$null]=null&filters[cliente_rimozione][$null]=null`)
                            .then(response => response.json())
                            .then(data => {
                                tempOrari = [
                                    ...tempOrari,
                                    {
                                        orario: orario,
                                        postiDisponibili: user.infoUtente.palestra.Limite_persone - data.data.length
                                    }
                                ]
                                setOrari(tempOrari)
                            })
                    }

                })
                .catch(error => console.error("Error fetching orari:", error));
        }
    }, [giorno.data]);

    function handleSubmit(e) {
        e.preventDefault()
        // Controlla che sia stato selezionato un orario
        if (orarioSelezionato) {
            setAlertErrore(false)
            if (user && user.infoUtente && user.infoUtente.palestra && giorno) {
                // Controlla che la prenotazione non sia stata già presa dallo stesso utente
                fetch(`http://localhost:1337/api/prenotaziones?populate=*&filters[cliente_aggiunta][id][$eq]=${user.infoUtente.id}&filters[Data][$eq]=${formatDate(giorno.data)}&filters[orario][id][$eq]=${orarioSelezionato}&filters[palestra_rimozione][$null]=null&filters[cliente_rimozione][$null]=null`)
                    .then(response => response.json())
                    .then(data => {
                        if (data.data.length == 0) {
                            // Controlla quante prenotazioni ci sono per quella fascia oraria di quella data
                            fetch(`http://localhost:1337/api/prenotaziones?populate=*&filters[orario][id][$eq]=${orarioSelezionato}&filters[Data][$eq]=${formatDate(giorno.data)}&filters[palestra_rimozione][$null]=null&filters[cliente_rimozione][$null]=null`)
                                .then(response => response.json())
                                .then(data => {
                                    // Se ci sono ancora posti...
                                    if (data.data.length < user.infoUtente.palestra.Limite_persone) {
                                        // Registra la prenotazione
                                        setAlertPrenotazioneDuplicata(false)
                                        fetch('http://localhost:1337/api/prenotaziones', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({
                                                data: {
                                                    cliente_aggiunta: user.infoUtente.id,
                                                    orario: orarioSelezionato,
                                                    Data: formatDate(giorno.data)
                                                },
                                            }),
                                        })
                                            .then(response => response.json())
                                            .then(data => {
                                                console.log('Success:', data);
                                                setAlertSuccess(true)
                                            })
                                            .catch(error => {
                                                console.error('Error:', error);
                                            });
                                    } else setAlertPostiFiniti(true)
                                })
                        } else setAlertPrenotazioneDuplicata(true)
                    })

            }
        } else setAlertErrore(true)

    }

    // Aggiorna lo stato orarioSelezionato
    function handleOrarioSelezionato(e) {
        setOrarioSelezionato(`${e.target.value}`)
    }

    function formatDate(dateString) {
        const [day, month, year] = dateString.split('/');
        return `${year}-${month}-${day}`;
    };

    function formatTime(timeString) {
        const options = { hour: '2-digit', minute: '2-digit' };
        return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('it-IT', options);
    };

    // Gestisce la chiusura della finestra, resettando tutti gli stati
    function closeWindow() {
        setAlertErrore(false)
        setAlertPrenotazioneDuplicata(false)
        setAlertSuccess(false)
        setOrarioSelezionato("")
        setOrari([])
    }


    return (
        <>
            <div className="modal fade" id="modalGetFascieOrarie" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <form onSubmit={(e) => handleSubmit(e)}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header bg-warning">
                                <h1 className="modal-title fs-5" id="exampleModalLabel"><b>Fascie Orarie Disponibili per {giorno.giornoDellaSettimana}, {giorno.data}</b></h1>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeWindow}></button>
                            </div>
                            <div className="modal-body">
                                {
                                    alertErrore &&
                                    (
                                        <div className="alert alert-danger alert-dismissible fade show"
                                            role="alert">
                                            Seleziona una fascia oraria
                                        </div>
                                    )
                                }
                                {
                                    alertSuccess && !alertPrenotazioneDuplicata &&
                                    (
                                        <div className="alert alert-success alert-dismissible fade show" role="alert">
                                            Prenotazione completata.
                                        </div>
                                    )
                                }
                                {
                                    alertPrenotazioneDuplicata &&
                                    (
                                        <div className="alert alert-warning alert-dismissible fade show" role="alert">
                                            Ti sei già prenotato per questa fascia oraria
                                        </div>
                                    )
                                }
                                {
                                    alertPostiFiniti &&
                                    (
                                        <div className="alert alert-danger alert-dismissible fade show"
                                            role="alert">
                                            Posti finiti per questa fascia oraria
                                        </div>
                                    )
                                }
                                <div className="mt-2">
                                    {orari.length > 0 ?
                                        orari
                                            .sort((a, b) => a.orario.Orario_inizio.localeCompare(b.orario.Orario_inizio))
                                            .map(
                                                (fascia, index) => (
                                                    <div key={index} className="form-check">
                                                        <input
                                                            className="form-check-input"
                                                            type="radio"
                                                            name="orario"
                                                            value={fascia.orario.id}
                                                            onChange={(e) => handleOrarioSelezionato(e)}
                                                        />
                                                        <label className="form-check-label" htmlFor={`orario-${index}`}>
                                                            <b>{formatTime(fascia.orario.Orario_inizio)} - {formatTime(fascia.orario.Orario_fine)}</b> | Posti rimanenti:
                                                            <b className={fascia.postiDisponibili < 10 ? "text-danger" : ""}>
                                                                {fascia.postiDisponibili}
                                                            </b>
                                                        </label>
                                                    </div>
                                                )
                                            )
                                        :
                                        <b>Fascie orarie non disponibili</b>
                                    }
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-warning w-100">Prenota</button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </>
    )
}

export default GetFascieOrarieFromCalendar