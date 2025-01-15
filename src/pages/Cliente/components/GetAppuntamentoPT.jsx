import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useState, useEffect } from 'react';

// Componente che restituisce il prossimo appuntamento con un eventuale personal  trainer
function GetAppuntamentoPT({ user, className }) {
    const [GetAppuntamento, setGetAppuntamento] = useState({
        Giorno: "",
        Orario_inizio: "",
        Orario_fine: "",
        NomePT: "",
        CognomePT: "",
        LinkWhatsApp: ""
    })

    const idCliente = user.infoUtente.id;
    useEffect(() => {
        if (user.role == "Cliente" && user.infoUtente.Personal_trainer == true) {
            fetch(`http://localhost:1337/api/personal-trainer-clientes?populate=*&filters[cliente][id][$eq]=${idCliente}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    setGetAppuntamento({
                        Giorno: data.data[0].Giorno,
                        Orario_inizio: data.data[0].Orario_inizio,
                        Orario_fine: data.data[0].Orario_fine,
                        NomePT: data.data[0].personal_trainer.Nome,
                        CognomePT: data.data[0].personal_trainer.Cognome,
                        LinkWhatsApp: data.data[0].personal_trainer.Link_whatsapp
                    })
                })
                .catch((error) => {
                    console.error('Errore durante il fetch:', error);
                });
        }
    }, [idCliente])

    function formatDate(dateString) {
        const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('it-IT', options);
    };

    function formatTime(timeString) {
        const options = { hour: '2-digit', minute: '2-digit' };
        return new Date(`1970-01-01T${timeString}`).toLocaleTimeString('it-IT', options);
    };

    return (
        <>
            <li className="nav-item">
                <button className={className} type="submit" data-bs-toggle="modal" data-bs-target="#modalGetAppuntamento">Appuntamento con il PT</button>
            </li>

            <div className="modal fade text-dark" id="modalGetAppuntamento" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header bg-warning">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Appuntamento con {GetAppuntamento.CognomePT} {GetAppuntamento.NomePT}</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div>
                                <p><strong>Giorno:</strong> {GetAppuntamento.Giorno ? formatDate(GetAppuntamento.Giorno) : "Non disponibile"}</p>
                                <p><strong>Orario Inizio:</strong> {GetAppuntamento.Orario_inizio ? formatTime(GetAppuntamento.Orario_inizio) : "Non disponibile"}</p>
                                <p><strong>Orario Fine:</strong> {GetAppuntamento.Orario_fine ? formatTime(GetAppuntamento.Orario_fine) : "Non disponibile"}</p>
                                <a href={GetAppuntamento.LinkWhatsApp} className='btn btn-success w-100' target="_blank"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-whatsapp" viewBox="0 0 16 16">
                                    <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
                                </svg> Contatta il PT su WhatsApp</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default GetAppuntamentoPT