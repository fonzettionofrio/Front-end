import NavBar from "../components/NavBar";
import useVerifyToken from "../hooks/useVerifyToken";
import { Link } from 'react-router-dom';
import Calendar from "./Cliente/components/Calendar";
import ChatBoxAI from "./Cliente/ChatBoxAI";
import ListaAppuntamenti from "./PT/ListaAppuntamenti";
import ListaPrenotazioniCliente from "./Cliente/components/ListaPrenotazioniCliente";

// Componente per l'area personale di ogni utente

function InfoUser() {
    // Prende le informazioni dell'utente dal local storage
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null
    console.log(user);
    useVerifyToken();

    // Componente per le card che mostrano le funzionalità di una palestra
    function CardFunzionalità({ titolo, descrizione, percorso }) {
        return (
            <>
                <div className="col">
                    <div className="card h-100">
                        <div className="card-body">
                            <h3 class="card-title">{titolo}</h3>
                            <p class="card-text">{descrizione}</p>
                        </div>
                        <div class="card-footer mb-2">
                            <center>
                                <div class="d-grid gap-2 mt-2">
                                    <Link className="btn btn-warning w-auto" to={percorso}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-play-circle-fill" viewBox="0 0 16 16">
                                            <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M6.79 5.093A.5.5 0 0 0 6 5.5v5a.5.5 0 0 0 .79.407l3.5-2.5a.5.5 0 0 0 0-.814z" />
                                        </svg>
                                    </Link>
                                </div>
                            </center>
                        </div>
                    </div>
                </div>
            </>
        )
    }

    // Componente che ritorna le informazioni del cliente
    function InfoCliente() {
        return (
            <div className="container d-flex justify-content-center">
                <ul className="list-group w-75">
                    <li className="list-group-item">Nome: {user.infoUtente.Nome}</li>
                    <li className="list-group-item">Cognome: {user.infoUtente.Cognome}</li>
                    <li className="list-group-item">Email: {user.infoUtente.Email}</li>
                    <li className="list-group-item">Data di nascita: {user.infoUtente.Data_di_nascita}</li>
                    <li className="list-group-item">Luogo di nascita: {user.infoUtente.Luogo_di_nascita}</li>
                    <li className="list-group-item">
                        <p className="mt-1">Peso: {user.infoUtente.Peso} kg</p>
                    </li>
                    <li className="list-group-item">
                        <p className="mt-1">Altezza: {user.infoUtente.Altezza} cm</p>
                    </li>
                </ul>
            </div>
        )
    }

    return (
        <>
            <NavBar />
            {/* In base al ruolo mostra diversi blocchi HTML */}
            {user.role === "Palestra" ?
                <>
                    <div className="container-fluid mt-3">
                        <center className="mb-4">
                            <h1 className="mt-3 p-2 text-light">Benvenuto nella tua Area Personale!</h1>
                            <h4 className="text-light">Cosa vuoi fare?</h4>
                        </center>
                        <div className="cards-container">
                            <div className="row">
                                <CardFunzionalità titolo="Registra un cliente" descrizione="Ti permette di registrare comodamente nel database ogni persona che vuole sottoscrivere un abbonamento" percorso="/registraCliente" />
                                <CardFunzionalità titolo="Registra un Personal Trainer" descrizione="Ti permette di registrare comodamente nel database ogni personal trainer che vuole lavorare ed aiutare i clienti nel raggiungimento dei loro obiettivi" percorso="/registraPT" />
                                <CardFunzionalità titolo="Visualizza Elenco Clienti" descrizione="Ti permette di visualizzare l'elenco dei clienti della palestra" percorso="/elencoClienti" />
                            </div>
                            <div className="row">
                                <CardFunzionalità titolo="Visualizza Elenco Peronal Trainer" descrizione="Ti permette di visualizzare l'elenco dei Peronal Trainer della palestra" percorso="/elencoPT" />
                                <CardFunzionalità titolo="Visualizza le Prenotazioni" descrizione="Ti permette di visualizzare le prenotazioni ordinate per data e per fascia oraria" percorso="/listaPrenotazioniPalestra" />
                                <CardFunzionalità titolo="Gestisci Fasce Orarie" descrizione="Ti permette di gestire (inserire, eliminare) fasce orarie della palestra" percorso="/gestioneFascieOrarie" />

                            </div>

                        </div>
                    </div>
                </>
                : user.role === "Cliente" ?
                    <>
                        <center className="mb-2">
                            <h1 className="mt-3 p-2 text-light">Benvenuto nella tua Area Personale!</h1>
                        </center>
                        <br></br><br></br>
                        <div className="container-fluid h-100 p-4">
                            <div className="row mb-3">
                                <div className="col-9">
                                    <div className="row mb-3">
                                        <div className="col-8">
                                            <center>
                                                <h3 className="mb-3 text-light">Prenota il tuo turno</h3>
                                            </center>
                                            <Calendar />
                                        </div>
                                        <div className="col-4 text-light">
                                            <center>
                                                <h3 className="mb-3">Informazioni personali</h3>
                                            </center>
                                            <InfoCliente />
                                        </div>
                                    </div>
                                    <div className="row mb-3 text-light">
                                        <ListaPrenotazioniCliente user={user} />
                                    </div>
                                </div>
                                <div className="col-2">
                                    <ChatBoxAI />
                                </div>



                            </div>
                        </div>


                    </>
                    : user.role === "Personal Trainer" ?
                        <>
                            <center className="mb-2">
                                <h1 className="mt-3 p-2 text-light">Benvenuto nella tua Area Personale!</h1>
                            </center>
                            <ListaAppuntamenti />
                        </>
                        : null}
        </>
    )
}

export default InfoUser;