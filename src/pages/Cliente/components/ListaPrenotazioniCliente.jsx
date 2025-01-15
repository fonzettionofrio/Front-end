import { useEffect, useState } from "react";
import EliminaPrenotazioneCliente from "./EliminaPrenotazioneCliente";

// Componente che mostra la lista di prenotazioni effettuate dal cliente
function ListaPrenotazioniCliente({ user }) {
    const [listaPrenotazioni, setListaPrenotazioni] = useState([]);

    // Restituisce le prenotazioni (ordinate per Data ed orario d'inizio) e riempie lo stato listaPrenotazioni
    useEffect(() => {
        fetch(`http://localhost:1337/api/prenotaziones?populate=*&filters[cliente_aggiunta][id][$eq]=${user.infoUtente.id}&filters[cliente_rimozione][$null]=null&filters[palestra_rimozione][$null]=null`)
            .then(response => response.json())
            .then(data => {
                const sortedData = data.data.sort((a, b) => {
                    const dateA = new Date(a.Data + 'T' + a.orario.Orario_inizio);
                    const dateB = new Date(b.Data + 'T' + b.orario.Orario_inizio);
                    return dateA - dateB;
                });
                setListaPrenotazioni(sortedData);
            });
    }, [user.infoUtente.id]);


    // Formatta ora e data
    function formatTime(timeString) {
        const options = { hour: '2-digit', minute: '2-digit' };
        return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('it-IT', options);
    };

    function formatDate(dateString) {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('it-IT', options);
    }

    return (
        <>
            <center className="mb-3"><h3>Elenco prenotazioni</h3></center>
            <div className="container-fluid">
                <div className="row justify-content-center">
                    {
                        listaPrenotazioni.map((prenotazione) => (
                            <div className="col-3 mb-4" key={prenotazione.id}>
                                <div className="card">
                                    <div className='card-header bg-warning'>
                                        <div className="row">
                                            <div className="col-10">
                                                <h5 className="card-title">Prenotazione di {prenotazione.orario.Giorno}, {formatDate(prenotazione.Data)}</h5>
                                            </div>
                                            <div className='col-2 text-end'>
                                                <button className="btn btn-danger" type="button" data-bs-toggle="modal" data-bs-target={`#deletePrenotazioneModal-${prenotazione.id}`}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="modal fade" id={`deletePrenotazioneModal-${prenotazione.id}`} tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
                                                <EliminaPrenotazioneCliente user={user} prenotazione={prenotazione} />
                                            </div>
                                        </div>

                                    </div>
                                    <div className="card-body">
                                        <p>Orario inizio: <b>{formatTime(prenotazione.orario.Orario_inizio)}</b></p>
                                        <p>Orario fine: <b>{formatTime(prenotazione.orario.Orario_fine)}</b></p>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>
            </div>
        </>

    );
}

export default ListaPrenotazioniCliente;
