import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useState } from 'react';

// Componente che permette di aggiungere fascie orarie in un giorno tramite una finestra
function AggiungiFascieOrarie({ giorno, user }) {

    // Conta il numero di fascie che l'utente vuole inserire
    const [countFascie, setCountFascie] = useState(1)
    const [elencoFascie, setElencoFascie] = useState([{ orarioInizio: "", orarioFine: "" }]);
    const [alertInvalidTimeRange, setAlertInvalidTimeRange] = useState(false)
    const [alertSucces, setAlertSucces] = useState(false)
    const [alertFasciaDuplicata, setAlertFasciaDuplicata] = useState(false)

    // Riempie lo stato elencoFasice con le fascie inserite nel form
    function fillElencoFascieOrarie(e, index) {
        const { name, value } = e.target;

        setElencoFascie((prev) => {
            let newElenco = [...prev]; // Copia dell'array esistente
            if (!newElenco[index]) {
                // Inizializza l'oggetto se non esiste
                newElenco[index] = { orarioInizio: "", orarioFine: "" };
            }
            // Aggiorna il valore corrispondente (orarioInizio o orarioFine)
            newElenco[index][name] = value;
            return newElenco; // Restituisci il nuovo array aggiornato
        });
    }

    // Rimuove una fascia oraria da inserire (tasto rosso -)
    function removeFasciaFromArray() {
        if (countFascie > 1) {
            setElencoFascie((prev) => {
                if (prev[countFascie - 1]) {
                    let newElenco = [...prev]
                    newElenco.pop()
                    return newElenco
                } else return prev
            })
            setCountFascie(countFascie - 1)
        }
    }

    // Aggiunge una fascia oraria da inserire (tasto giallo +)
    function addFascia() {
        setCountFascie(countFascie + 1)
        setElencoFascie(prev => [
            ...prev,
            { orarioInizio: "", orarioFine: "" }
        ])
    }

    // Gestisce la chiusura della finestra, resettando tutti gli stati
    function closeForm() {
        setCountFascie(1)
        setElencoFascie([{ orarioInizio: "", orarioFine: "" }])
        setAlertInvalidTimeRange(false)
        setAlertFasciaDuplicata(false)
    }

    // Formatta gli orari come previsto da strapi
    function formatTimeWithMilliseconds(timeString) {
        const date = new Date(`1970-01-01T${timeString}`);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}:00.000`;
    }

    function handleSubmit(e) {
        e.preventDefault()
        // la funzione some() richiama la funzione passata come parametro su tutto l'array e vede se la condizione è valida per ogni elemento. Nel caso in cui qualche elemento non rispetti la condizione, ritorna true. Serve per controllare se le fascie orarie inserite hanno orario d'inizio < orario di fine
        const hasInvalidTimeRange = elencoFascie.some(fascia => fascia.orarioInizio > fascia.orarioFine);
        if (hasInvalidTimeRange) {
            setAlertInvalidTimeRange(true)
        } else {
            elencoFascie.forEach(fascia => {
                // Per ogni fascia oraria che si vuole inserire, si controlla che non sia stata già inserita. Nel caso si aggiorna lo stato alertFasciaDuplicata
                fetch(`http://localhost:1337/api/orarios?populate=*&filters[Giorno][$eq]=${giorno}&filters[Orario_inizio][$eq]=${formatTimeWithMilliseconds(fascia.orarioInizio)}&filters[Orario_fine][$eq]=${formatTimeWithMilliseconds(fascia.orarioFine)}&filters[palestra_aggiunta][id][$eq]=${user.infoUtente.id}&filters[palestra_rimozione][$null]=null`)
                    .then(response => response.json())
                    .then(data => {
                        console.log(data)
                        // Se la fetch restituisce un array vuoto (=> non ci sono fascie orarie duplicate), aggiunge al content-type Orario la fascia oraria
                        if (data.data.length === 0) {
                            setAlertSucces(true)
                            fetch(`http://localhost:1337/api/orarios`, {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    data: {
                                        Giorno: giorno,
                                        Orario_inizio: formatTimeWithMilliseconds(fascia.orarioInizio),
                                        Orario_fine: formatTimeWithMilliseconds(fascia.orarioFine),
                                        palestra_aggiunta: user.infoUtente.id
                                    }
                                }),
                            })
                                .then(response => response.json())
                                .then(data => {
                                    console.log('Success:', data);
                                })
                                .catch((error) => {
                                    console.error('Error:', error);
                                });
                        } else setAlertFasciaDuplicata(true)
                    })
                    .catch((error) => {
                        console.error('Error:', error);
                    });
            });

        }
    }

    return (
        <>
            <form onSubmit={(e) => handleSubmit(e)} onChange={() => {
                setAlertFasciaDuplicata(false)
                setAlertInvalidTimeRange(false)
                setAlertSucces(false)
            }}>
                <div className="modal-header bg-warning">
                    <h1 className="modal-title fs-5" id="staticBackdropLabel">Aggiungi fascie orarie</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeForm}>
                    </button>
                </div>
                <div className="modal-body">
                    <div className='mb-3'>
                        {
                            alertInvalidTimeRange && (
                                <div className="alert alert-danger" role="alert">
                                    Attenzione: L'orario di fine della fascia dev'essere più grande dell'orario d'inizio.
                                </div>
                            )
                        }
                        {
                            alertSucces && (
                                <div className="alert alert-success mb-3" role="alert">
                                    Fascie orarie registrate correttamente
                                </div>
                            )
                        }
                        {
                            alertFasciaDuplicata && (
                                <div className="alert alert-warning mb-3" role="alert">
                                    Attenzione: alcune delle fascie orarie che hai inserito sono già registrate, perciò non sono state aggiunte. Eventuali altre fascie non presenti sono state aggiunte correttamente.
                                </div>
                            )
                        }
                        {Array.from({ length: countFascie }, (_, index) => (
                            <div key={index}>
                                <h5>Fascia {index + 1}</h5>
                                <div className="mb-3">
                                    <label htmlFor='orarioInizio' className="form-label">
                                        Orario Inizio
                                    </label>
                                    <input
                                        type="time"
                                        className="form-control"
                                        name="orarioInizio"
                                        value={elencoFascie[index] ? elencoFascie[index]["orarioInizio"] : ""}
                                        onChange={(e) => fillElencoFascieOrarie(e, index)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor='orarioFine' className="form-label">
                                        Orario Fine
                                    </label>
                                    <input
                                        type="time"
                                        className="form-control"
                                        name="orarioFine"
                                        value={elencoFascie[index] ? elencoFascie[index]["orarioFine"] : ""}
                                        onChange={(e) => fillElencoFascieOrarie(e, index)}
                                        required
                                    />
                                </div>
                            </div>
                        ))}
                        <button type="button" className="btn btn-warning me-2" onClick={addFascia}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus" viewBox="0 0 16 16">
                                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                            </svg>
                        </button>
                        <button type="button" className="btn btn-danger" onClick={removeFasciaFromArray}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-dash" viewBox="0 0 16 16">
                                <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="modal-footer">
                    <button type="submit" className="btn btn-secondary w-100">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil me-1" viewBox="0 0 16 16">
                            <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                        </svg>
                        Aggiungi
                    </button>
                </div>
            </form>
        </>
    )
}

export default AggiungiFascieOrarie