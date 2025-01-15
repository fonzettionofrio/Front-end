import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Componente che permette alla palestra di rimuovere clienti e personal trainer
function EliminaUsers({ user, role, palestra }) {

    function handleDelete() {
        window.location.reload()
        if (role == "personal-trainer") {
            // "Elimina" il personal trainer aggiungendo nel campo "palestra rimozione" l'id della palestra
            fetch(`http://localhost:1337/api/personal-trainers/${user.documentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: {
                        palestra_rimozione: palestra.id,
                    },
                }),
            })
                .then(response => response.json())
                .then(data => {
                    console.log("Fatto: ", data)
                    fetch(`http://localhost:1337/api/personal-trainer-clientes?populate=*&filters[personal_trainer][id][$eq]=${data.data.id}`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    })
                        .then(response => response.json())
                        .then(data => {
                            // Elimina l'appuntamento con eventuali cliente
                            for (let appuntamento of data.data) {
                                fetch(`http://localhost:1337/api/personal-trainer-clientes/${appuntamento.documentId}`, {
                                    method: 'DELETE',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                })
                                    .then(response => {
                                        if (!response.ok) {
                                            console.log(`Errore DELETE appuntamento: ${response.status}`);
                                        }
                                        if (response.status === 204 || response.headers.get('Content-Length') === '0') {
                                            console.log('Appuntamento eliminato con successo');
                                            return null;
                                        }
                                        return response.json();
                                    })
                                    .then(data => {
                                        if (data) {
                                            console.log("Appuntamento eliminato: ", data);
                                        }
                                    })

                                    .catch(error => {
                                        console.error("Errore nell'eliminazione dell'appuntamento: ", error)
                                    });
                            }
                        })
                })
        } else {
            console.log(user)
            // "Elimina" il cliente aggiungendo nel campo "palestra rimozione" l'id della palestra
            fetch(`http://localhost:1337/api/clientes/${user.documentId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    data: {
                        palestra_rimozione: palestra.id,
                    },
                }),
            })
                .then(response => response.json())
                .then(data => {
                    // "Elimina" tutte le prenotazioni di quel cliente, agigungendo nel campo "palestra_rimozione" l'id della palestra
                    fetch(`http://localhost:1337/api/prenotaziones?populate=*&filters[cliente_aggiunta][id][$eq]=${user.cliente.id}&filters[cliente_rimozione][$null]=null&filters[palestra_rimozione][$null]=null`, {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                        }
                    })
                        .then(response => response.json())
                        .then(data => {
                            for (let prenotazione of data.data) {
                                fetch(`http://localhost:1337/api/prenotaziones/${prenotazione.documentId}`, {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({
                                        data: {
                                            palestra_rimozione: palestra.id,
                                        },
                                    }),
                                })
                                    .then(response => response.json())
                                    .then(data => {
                                        console.log(data)
                                    })
                            }
                        })
                })
        }
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
                        Sei sicuro di voler eliminare {
                            role == "personal-trainer" ?
                                ` ${user.Nome} ${user.Cognome} dai personal trainer?`
                                : role == "cliente" ?
                                    ` ${user.Nome} ${user.Cognome} dai clienti?`
                                    : null
                        }

                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Annulla</button>
                        <button type="submit" className="btn btn-danger" onClick={(e) => handleDelete(e)}>Elimina</button>
                    </div>
                </div>
            </div>
        </>
    )

}

export default EliminaUsers
