import React, { useEffect, useState } from 'react';
import useVerifyToken from "../../hooks/useVerifyToken";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Mostra la lista dei clienti con relativi appuntamenti
function Lista_appuntamenti() {
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null
    useVerifyToken();

    // Array che contiene le informazioni sul cliente e sul suo prossimo appuntamento
    const [AppuntamentiClienti, setAppuntamentiClienti] = useState([]);

    // Nuovo appuntamento registrato dal personal trainer
    const [NuovoAppuntamento, setNuovoAppuntamento] = useState({ Giorno: "", Orario_inizio: "", Orario_fine: "" })

    // Id dell'appuntamento che si vuole modificare
    const [IdAppuntamento, setIdAppuntamento] = useState(0);

    useEffect(() => {
        // Richiesta http che restituisce i clienti con i relatvi appuntamenti
        fetch(`http://localhost:1337/api/personal-trainer-clientes?populate=*&filters[personal_trainer][id][$eq]=${user.infoUtente.id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
                let tempAppuntamentiClienti = []
                // Cicla gli elementi contenuti nell'array data.data, contenitore della risposta http
                for (let appuntamento of data.data) {
                    // Controlla che il cliente non sia stato rimosso
                    console.log(appuntamento)
                    fetch(`http://localhost:1337/api/clientes?populate=*&filters[id][$eq]=${appuntamento.cliente.id}`)
                        .then((response) => response.json())
                        .then(data => {
                            if (data.data[0].palestra_rimozione == null)
                                tempAppuntamentiClienti = [
                                    ...tempAppuntamentiClienti,
                                    {
                                        cliente: appuntamento.cliente,
                                        appuntamento: {
                                            documentId: appuntamento.documentId,
                                            Giorno: appuntamento.Giorno,
                                            Orario_inizio: appuntamento.Orario_inizio,
                                            Orario_fine: appuntamento.Orario_fine
                                        }
                                    }
                                ]
                            setAppuntamentiClienti(tempAppuntamentiClienti)
                        })
                }
            })
            .catch((error) => {
                console.error('Errore durante il fetch:', error);
            });
    }, [])

    // Registra in uno stato (NuovoAppuntamento) gli input del form
    function handleChange(e) {
        setNuovoAppuntamento({
            ...NuovoAppuntamento,
            [e.target.name]: e.target.value
        })
    }

    // Registra l'appuntamento nel database (NuovoAppuntamento)
    function handleSubmit(e) {
        window.location.reload()
        const orarioInizioFormattato = formatTimeWithMilliseconds(NuovoAppuntamento.Orario_inizio)
        const orarioFineFormattato = formatTimeWithMilliseconds(NuovoAppuntamento.Orario_fine)

        fetch(`http://localhost:1337/api/personal-trainer-clientes/${IdAppuntamento}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                data: {
                    Giorno: NuovoAppuntamento.Giorno,
                    Orario_inizio: orarioInizioFormattato,
                    Orario_fine: orarioFineFormattato
                }
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data)
            })
            .catch((error) => {
                console.error('Errore durante la modifica:', error);
            });
    }

    // Resetta il form quando si chiude la finestra
    function resetForm() {
        setNuovoAppuntamento({ Giorno: "", Orario_inizio: "", Orario_fine: "" });
    }

    // Funzioni che formattano orario e data secondo le richieste di strapi
    function formatDate(dateString) {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('it-IT', options);
    };

    function formatTime(timeString) {
        const options = { hour: '2-digit', minute: '2-digit' };
        return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('it-IT', options);
    };

    function formatTimeWithMilliseconds(timeString) {
        const date = new Date(`1970-01-01T${timeString}`);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}:00.000`;
    }

    return (
        <>
            {
                AppuntamentiClienti ?
                    <div className="container-fluid w-75 p-3">
                        {/* Lista degli appuntamenti */}
                        <center><h1 className="mb-4 text-light">Lista appuntamenti:</h1></center>
                        <div className="row justify-content-center">
                            {AppuntamentiClienti.sort((a, b) => {
                                const dateA = new Date(`${a.appuntamento.Giorno}T${a.appuntamento.Orario_inizio}`);
                                const dateB = new Date(`${b.appuntamento.Giorno}T${b.appuntamento.Orario_inizio}`);
                                return dateA - dateB;
                            }).map((cl, index) => (
                                <div key={index} className="col-4">
                                    <div className="card mb-4">
                                        <div className='card-header bg-warning p-2'>
                                            <h2>{cl.cliente.Nome} {cl.cliente.Cognome}</h2>
                                        </div>
                                        <div className="card-body">
                                            <p>Email: {cl.cliente.Email}</p>
                                            <p>Luogo di nascita: {cl.cliente.Luogo_di_nascita || 'Non disponibile'}</p>
                                            <p>Data di nascita: {cl.cliente.Data_di_nascita ? formatDate(cl.cliente.Data_di_nascita) : 'Non disponibile'}</p>
                                            <p>Peso: {cl.cliente.Peso || 'Non disponibile'} kg</p>
                                            <p>Altezza: {cl.cliente.Altezza || 'Non disponibile'} cm</p>
                                            <h4>Prossimo appuntamento</h4>
                                            {cl.appuntamento.Giorno && cl.appuntamento.Orario_inizio && cl.appuntamento.Orario_fine ?
                                                `${formatDate(cl.appuntamento.Giorno)}, ${formatTime(cl.appuntamento.Orario_inizio)} - ${formatTime(cl.appuntamento.Orario_fine)}`
                                                :
                                                "Non disponibile"}
                                            <button
                                                type='submit'
                                                className='btn btn-secondary mt-3 w-100'
                                                data-bs-toggle="modal"
                                                data-bs-target="#modalGestioneAppuntamento"
                                                onClick={
                                                    // Memorizza l'id dell'appuntamento da modificare
                                                    () => setIdAppuntamento(cl.appuntamento.documentId)
                                                }
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil me-1" viewBox="0 0 16 16">
                                                    <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                                                </svg>
                                                Modifica Appuntamento
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    : <center><h1 className="mb-4 text-light">Non ci sono appuntamenti disponibili</h1></center>
            }


            {/* Finestra con form per la registrazione dell'appuntamento */}
            <div className="modal fade" id="modalGestioneAppuntamento" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">

                        <form onSubmit={(e) => handleSubmit(e)}>
                            <div className="modal-header bg-warning">
                                <h1 className="modal-title fs-5 " id="staticBackdropLabel">Modfica appuntamento</h1>
                                <button type="button" className="btn-close " data-bs-dismiss="modal" aria-label="Close"
                                    onClick={resetForm}>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor="date" className="form-label" >Data</label>
                                    <input
                                        type="date"
                                        className="form-control"
                                        name="Giorno"
                                        value={`${NuovoAppuntamento.Giorno}`}
                                        onChange={e => handleChange(e)}
                                        min={new Date().toISOString().split('T')[0]}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="startTime" className="form-label">Orario Inizio</label>
                                    <input
                                        type="time"
                                        className="form-control"
                                        name="Orario_inizio"
                                        value={`${NuovoAppuntamento.Orario_inizio}`}
                                        onChange={e => handleChange(e)}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="endTime" className="form-label">Orario Fine</label>
                                    <input
                                        type="time"
                                        className="form-control"
                                        name="Orario_fine"
                                        value={`${NuovoAppuntamento.Orario_fine}`}
                                        onChange={e => handleChange(e)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="submit" className="btn btn-secondary w-100" >Modifica</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </>
    );
}

export default Lista_appuntamenti;