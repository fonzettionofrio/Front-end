

// Comoponente che elimina la fascia oraria selezionata se confermato
function EliminaFascieOrarie({ user, fasciaOraria }) {

    // Funzione che gestisce l'eliminazione della fascia oraria
    function handleDelete() {
        // Viene aggiornato il content-type Orario e viene inserito nel campo "palestra_rimozione" l'id della palestra
        fetch(`http://localhost:1337/api/orarios/${fasciaOraria.documentId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                data: {
                    palestra_rimozione: user.infoUtente.id,
                },
            }),
        })
            .then(response => response.json())
            .then(data => {
                console.log("Fatto: ", data)
                // Nel caso in cui ci sia qualche cliente prenotato per quella fascia oraria, vengono aggiornate le prenotazioni e viene aggiunto l'id della palestra nel campo "palestra_rimozione"
                fetch(`http://localhost:1337/api/prenotaziones?populate=*&filters[orario][id][$eq]=${fasciaOraria.documentId}&filters[cliente_rimozione][$null]=null&filters[palestra_rimozione][$null]=null`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        data: {
                            palestra_rimozione: user.infoUtente.id,
                        }
                    }),
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log("Prenotazioni aggiornate: ", data);
                    })
                    .catch(error => console.error("Errore nell'aggiornamento delle prenotazioni:", error));
            })
            .catch(error => console.error("Errore nella cancellazione:", error));
    }

    return (
        <>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header bg-danger">
                        <h5 className="modal-title text-light" id="deleteModalLabel">Conferma Eliminazione</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        Sei sicuro di voler eliminare questa fascia oraria?
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Annulla</button>
                        <button type="submit" className="btn btn-danger" onClick={() => handleDelete()}>Elimina</button>
                    </div>
                </div>
            </div>
        </>
    )

}

export default EliminaFascieOrarie