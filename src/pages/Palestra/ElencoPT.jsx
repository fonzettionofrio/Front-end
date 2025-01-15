import React, { useEffect, useState } from 'react';
import NavBar from '../../components/NavBar';
import EliminaUsers from './components/EliminaUsers';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';

// Componente che mostra l'elenco dei Personal Trainer
function ElencoPT() {
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null
    const [personalTrainers, setPersonalTrainers] = useState([]);

    // Chiamata che restituisce l'elenco
    useEffect(() => {
        fetch(`http://localhost:1337/api/personal-trainers?populate=*&filters[palestra][id][$eq]=${user.infoUtente.id}&filters[palestra_rimozione][$null]=null`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                console.log(data);
                setPersonalTrainers(data.data);
            })
            .catch((error) => {
                console.error('Errore durante il fetch:', error);
            });
    }, []);

    return (
        <>
            <NavBar />
            <div className="space">
                <h1 className="mb-4 text-light">Elenco Personal Trainer</h1>
            </div>
            <div className="container-fluid w-75">
                <div className='row'>
                    {personalTrainers.map((pt, index) => (
                        <div className='col-4 mb-4' key={pt.id}>
                            <div className="card" >
                                <div className='card-header bg-warning'>
                                    <div className='row'>
                                        <div className='col-10'>
                                            <h3>{pt.Nome} {pt.Cognome}</h3>
                                        </div>
                                        <div className='col-2 text-end'>
                                            <button className="btn btn-danger" type="button" data-bs-toggle="modal" data-bs-target={`#deletePTModal-${pt.id}`}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-trash" viewBox="0 0 16 16">
                                                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="modal fade" id={`deletePTModal-${pt.id}`} tabIndex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
                                            <EliminaUsers role='personal-trainer' user={pt} palestra={user.infoUtente} />
                                        </div>
                                    </div>
                                </div>
                                <div className="card-body">
                                    <p>Email: {pt.Email}</p>
                                    <p>Luogo di nascita: {pt.Luogo_di_nascita}</p>
                                    <p>Data di nascita: {pt.Data_di_nascita}</p>
                                    <a href={pt.Link_whatsapp} className="btn btn-success w-100" target="_blank"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-whatsapp" viewBox="0 0 16 16">
                                        <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
                                    </svg>  Link Whatsapp
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div >
        </>
    );
}


export default ElencoPT;
