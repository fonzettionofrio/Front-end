import NavBar from "../../components/NavBar"
import useVerifyToken from "../../hooks/useVerifyToken"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import ElencoFascieOrarie from "./components/ElencoFascieOrarie";
import AggiungiFascieOrarie from "./components/AggiungiFascieOrarie";
import { useState } from "react";

// Componente per la gestione delle fascie orarie in una palestra
function GestioneFascieOrarie() {
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null
    useVerifyToken()
    const [giorni, setGiorni] = useState(["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato"])
    const [giornoSelezionato, setGironoSelezionato] = useState("")
    return (
        <>
            <NavBar />
            <center className="mt-3">
                <h1 className="text-light">Gestione Fascie Orarie</h1>
            </center>
            <div className="row mt-4 me-3 ms-3">
                {giorni.map((giorno, index) => (
                    <div className="col-md-4" key={giorno}>
                        <div className="card mb-4 w-auto">
                            <div className="card-header bg-warning">
                                <h5 className="card-title mt-2">{giorno}</h5>
                            </div>
                            <div className="card-body">
                                <ElencoFascieOrarie giorno={giorno} user={user} />
                                <button className="btn btn-secondary w-100" type="button" data-bs-toggle="modal" data-bs-target="#modalAddFascie"
                                    onClick={() => setGironoSelezionato(giorno)}
                                ><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil" viewBox="0 0 16 16">
                                        <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                                    </svg>  Aggiungi
                                </button>

                                <div className="modal fade" id="modalAddFascie" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <AggiungiFascieOrarie giorno={giornoSelezionato} user={user} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )

}

export default GestioneFascieOrarie