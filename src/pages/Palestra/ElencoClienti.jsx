import React, { useEffect, useState } from 'react';
import NavBar from '../../components/NavBar';
import EliminaUsers from './components/EliminaUsers';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Componente che mostra l'elenco dei Personal Trainer
function ElencoClienti() {
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null
    const [Clienti, setClienti] = useState([]);

    // Chiamata che restituisce l'elenco
    useEffect(() => {
        fetch(`http://localhost:1337/api/clientes?populate=*&filters[palestra][id][$eq]=${user.infoUtente.id}&filters[palestra_rimozione][$null]=null`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                let tempClienti = []
                for (let cliente of data.data) {
                    // Controlla se il cliente ha un personal trainer
                    fetch(`http://localhost:1337/api/personal-trainer-clientes?populate=*&filters[cliente][id][$eq]=${cliente.id}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            if (data.data.length > 0) {
                                tempClienti = [
                                    ...tempClienti,
                                    {
                                        cliente: cliente,
                                        personal_trainer: data.data[0].personal_trainer
                                    }
                                ]
                            } else {
                                tempClienti = [
                                    ...tempClienti,
                                    {
                                        cliente: cliente,
                                        personal_trainer: null
                                    }
                                ]
                            }
                            setClienti(tempClienti)
                        })
                        .catch((error) => {
                            console.error('Errore durante il fetch2:', error);
                        });
                }
            })
            .catch((error) => {
                console.error('Errore durante il fetch1:', error);
            });
    }, []);

    function fetchPersonalTrainer(id) {

    };

    return (
        <>
            <NavBar />
            <div className="space">
                <h1 className="mb-4 text-light">Elenco Clienti</h1>
            </div>
            <div className='container-fluid w-75'>
                <div className="row p-3">
                    {Clienti.map((cl) => {
                        return (
                            <div className="col-4 mb-4" key={cl.cliente.id}>
                                <div className="card">
                                    <div class="card-header bg-warning">
                                        <div className='row'>
                                            <div className='col-10'>
                                                <h3>{cl.cliente.Nome} {cl.cliente.Cognome}</h3>
                                            </div>
                                            <div className='col-2 text-end'>
                                                <button className="btn btn-danger" type="button" data-bs-toggle="modal" data-bs-target={`#deleteClienteModal-${cl.cliente.id}`}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                        <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                                        <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <div className="modal fade" id={`deleteClienteModal-${cl.cliente.id}`} tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
                                                <EliminaUsers role='cliente' user={cl.cliente} palestra={user.infoUtente} />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-body">
                                        <p>Email: {cl.cliente.Email}</p>
                                        <p>Luogo di nascita: {cl.cliente.Luogo_di_nascita}</p>
                                        <p>Data di nascita: {cl.cliente.Data_di_nascita}</p>
                                        <p>Peso: {cl.cliente.Peso} kg</p>
                                        <p>Altezza: {cl.cliente.Altezza} cm</p>
                                        {
                                            cl.cliente.Personal_trainer ?
                                                cl.personal_trainer ?
                                                    <>
                                                        <p>Personal Trainer: {cl.personal_trainer.Nome} {cl.personal_trainer.Cognome}</p>
                                                    </>
                                                    :
                                                    <>
                                                        <p>Nessun personal trainer associato</p>
                                                        <button className='btn btn-secondary w-100'>Modifica Personal Trainer</button>
                                                    </>
                                                :
                                                <p>Iscrizione senza personal trainer</p>
                                        }
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div >
            </div>

        </>
    );
}


export default ElencoClienti;
