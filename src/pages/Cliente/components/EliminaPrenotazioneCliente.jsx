
// Componente che permette di "eliminare" le prenotazioni di un cliente
function EliminaPrenotazioneCliente({ user, prenotazione }) {

    // Aggiunge al campo cliente_rimozione l'id del cliente che vuole eliminare la prenotazione
    function handleDelete() {
        window.location.reload()
        fetch(`http://localhost:1337/api/prenotaziones/${prenotazione.documentId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                data: {
                    cliente_rimozione: user.infoUtente.id,
                },
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log("Fatto: ", data)
            })
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
                        Sei sicuro di voler eliminare questa prenotazione?
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

export default EliminaPrenotazioneCliente