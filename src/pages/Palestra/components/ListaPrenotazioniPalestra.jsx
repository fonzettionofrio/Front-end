import NavBar from "../../../components/NavBar";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useState, useEffect } from 'react';

// Componente che mostra la lista di prenotazioni alla palestra che la richiede
function ListaPrenotazioniPalestra() {
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null
    const [listaPrenotazioni, setListaPrenotazioni] = useState([])

    // Ritorna la lista di prenotazioni
    useEffect(() => {
        fetch(`http://localhost:1337/api/prenotaziones?populate=*`)
            .then((response) => response.json())
            .then(prenotazioni => {
                let tempListaPrenotazioni = []
                for (let prenotazione of prenotazioni.data) {
                    // Per ogni prenotazione, vede il cliente che l'ha aggiunta e di quale palestra fa parte
                    fetch(`http://localhost:1337/api/clientes/${prenotazione.cliente_aggiunta.documentId}?populate=*`)
                        .then((response) => response.json())
                        .then(cliente => {
                            if (cliente.data.palestra.id === user.infoUtente.id && prenotazione.palestra_rimozione == null && prenotazione.cliente_rimozione == null && cliente.data.palestra_rimozione == null) {
                                tempListaPrenotazioni = [
                                    ...tempListaPrenotazioni,
                                    prenotazione
                                ]
                                setListaPrenotazioni(tempListaPrenotazioni)
                            }
                        })
                }
            })
    }, [])

    // Raggruppa le prenotazioni per data. Restituisce un oggetto dove ogni chiave rappresenta una data, e il valore è un array con le prenotazioni associate a quella data.
    const groupedPrenotazioni = listaPrenotazioni.reduce((groups, prenotazione) => {
        const dataPrenotazione = new Date(prenotazione.Data).toISOString().split('T')[0]; // Solo la data in formato YYYY-MM-DD
        if (!groups[dataPrenotazione]) {
            groups[dataPrenotazione] = [];
        }
        groups[dataPrenotazione].push(prenotazione);
        return groups;
    }, {});

    // Ordina le date in ordine crescente
    const sortedDates = Object.keys(groupedPrenotazioni).sort((a, b) => new Date(a) - new Date(b));

    function formatTime(timeString) {
        const options = { hour: '2-digit', minute: '2-digit' };
        return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('it-IT', options);
    };

    return (
        <>
            <NavBar />
            <div className="space">
                <h1 className="mb-4 text-light">Elenco Prenotazioni</h1>
            </div>
            <div className="container-fluid w-75">
                {
                    sortedDates.map((date) => (
                        <div key={date} className="mb-4">
                            {/* Intestazione per ogni gruppo (Data) */}
                            <center className="mb-4">
                                <h3 className="text-light">{new Date(date).toLocaleDateString('it-IT')}</h3>
                            </center>
                            <div className="row justify-content-center">
                                {/* Ordina le prenotazioni (che hanno come chiave la data corrispondente) per ora d'inizio */}
                                {groupedPrenotazioni[date]
                                    .sort((a, b) => new Date(`1970-01-01T${a.orario.Orario_inizio}`) - new Date(`1970-01-01T${b.orario.Orario_inizio}`))
                                    .map((prenotazione, index) => (
                                        <div className="col-3 mb-4" key={prenotazione.id}>
                                            <div className="card">
                                                <div className='card-header bg-warning'>
                                                    <h5 className="card-title">{index + 1}: {prenotazione.cliente_aggiunta.Cognome} {prenotazione.cliente_aggiunta.Nome}</h5>

                                                </div>
                                                <div className="card-body">
                                                    <p>Orario inizio: <b>{formatTime(prenotazione.orario.Orario_inizio)}</b></p>
                                                    <p>Orario fine: <b>{formatTime(prenotazione.orario.Orario_fine)}</b></p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    )
}

export default ListaPrenotazioniPalestra;
