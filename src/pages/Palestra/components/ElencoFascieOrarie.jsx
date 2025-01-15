import { useEffect } from "react"
import { useState } from "react";
import EliminaFascieOrarie from "./EliminaFascieOrarie";

// Componente che mostra l'elenco delle fascie orarie giorno per giorno
function ElencoFascieOrarie({ giorno, user }) {

    const [fascieOrarie, setFascieOrarie] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:1337/api/orarios?populate=*&filters[palestra_aggiunta][id][$eq]=${user.infoUtente.id}&filters[Giorno][$eq]=${giorno}&filters[palestra_rimozione][$null]=null`)
            .then(response => response.json())
            .then(data => {
                setFascieOrarie(data.data)
            })
            .catch(error => console.error("Errore nel fetch:", error));
    }, [giorno, user.infoUtente.id]);

    function formatTime(timeString) {
        const options = { hour: '2-digit', minute: '2-digit' };
        return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('it-IT', options);
    };

    return (
        <>
            {fascieOrarie
                // Ordina le fascie orarie per ora d'inizio
                .sort((a, b) => new Date(`1970-01-01T${a.Orario_inizio}`) - new Date(`1970-01-01T${b.Orario_inizio}`))
                .map((fasciaOraria) => (
                    <div className="row mb-4" key={fasciaOraria.id}>
                        <div className="col">
                            <h5 className="mb-0 mt-1">{formatTime(fasciaOraria.Orario_inizio)} - {formatTime(fasciaOraria.Orario_fine)}</h5>
                        </div>
                        <div className="col text-end">
                            <button className="btn btn-danger" type="button" data-bs-toggle="modal" data-bs-target={`#deleteModal-${fasciaOraria.id}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                </svg>
                            </button>
                        </div>
                        {/* Finestra per la conferma di eliminazione */}
                        <div className="modal fade" id={`deleteModal-${fasciaOraria.id}`} tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
                            <EliminaFascieOrarie user={user} fasciaOraria={fasciaOraria} />
                        </div>
                    </div>
                ))}
        </>
    );
}

export default ElencoFascieOrarie