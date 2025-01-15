import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import GetAppuntamentoPT from '../pages/Cliente/components/GetAppuntamentoPT';
import '../../style/style.css';
import ChatBoxAI from '../pages/Cliente/ChatBoxAI.jsx'
import InformazioniPersonaliPT from '../pages/PT/InformazioniPersonaliPT.jsx';

function NavBar() {
    // Prende le informazioni dell'utente dal local storage
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null
    const navigate = useNavigate();

    // Funzioni per eseguire il logout
    function goToLoginPage() {
        navigate("/login");
    }

    function handleLogout() {
        localStorage.removeItem("jwt")
        localStorage.removeItem("user")
        goToLoginPage();
    }


    return (
        <>
            <nav className="navbar navbar-expand-lg p-3 navbarColore">
                <a className="link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover link-warning">
                    <Link className="navbar-brand text-warning " to="/"><b>FLEXIFIT</b></Link></a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        {/* In base al ruolo dell'utente (palestra. clinte o personal-trainer) mostra diverse opzioni */}
                        {user && localStorage.getItem("jwt") ?
                            user.role === "Palestra" ?
                                <>
                                    <li className="nav-item">
                                        <a className='link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover link-light'>
                                            <Link className="nav-link text-light" to="/infoUser">Area Personale</Link>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className='link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover link-light'>
                                            <Link className="nav-link text-light" to="/registraCliente">Registra Cliente</Link>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className='link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover link-light'>
                                            <Link className="nav-link text-light" to="/registraPT">Registra PT</Link>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className='link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover link-light'>
                                            <Link className="nav-link text-light" to="/elencoClienti">Elenco Clienti</Link>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className='link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover link-light'>
                                            <Link className="nav-link text-light" to="/elencoPT">Elenco PT</Link>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className='link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover link-light'>
                                            <Link className="nav-link text-light" to="/listaPrenotazioniPalestra">Elenco prenotazioni</Link>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className='link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover link-light'>
                                            <Link className="nav-link text-light" to="/gestioneFascieOrarie">Gestione fascie orarie</Link>
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className='link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover link-light'>
                                            <button className="nav-link text-light" type="button" onClick={() => handleLogout()}>Logout</button>
                                        </a>
                                    </li>


                                </>
                                :
                                user.role === "Cliente" ?
                                    <>
                                        <li className="nav-item">
                                            <a className='link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover link-light'>
                                                <Link className="nav-link text-light" to="/infoUser">Area Personale</Link>
                                            </a>
                                        </li>

                                        {
                                            user.infoUtente.Personal_trainer === true ?
                                                (
                                                    <>
                                                        <li className="nav-item">
                                                            <a className='link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover link-light'>
                                                                <GetAppuntamentoPT user={user} className={`nav-link text-light`} />
                                                            </a>
                                                        </li>
                                                    </>
                                                )
                                                : null
                                        }

                                        <li className="nav-item">
                                            <a className='link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover link-light'>
                                                <button className="nav-link text-light" type="button" onClick={() => handleLogout()}>Logout</button>
                                            </a>
                                        </li>
                                    </>
                                    :
                                    user.role === "Personal Trainer" ?
                                        <>
                                            <li className="nav-item">
                                                <a className='link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover link-light'>
                                                    <Link className="nav-link text-light" to="/infoUser">Area Personale</Link>
                                                </a>
                                            </li>
                                            <InformazioniPersonaliPT user={user} />
                                            <li className="nav-item">
                                                <a className='link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover link-light'>
                                                    <button className="nav-link text-light" type="button" onClick={() => handleLogout()}>Logout</button>
                                                </a>
                                            </li>

                                        </>
                                        :
                                        null
                            :
                            <>
                                <li className="nav-item">
                                    <a className='link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover link-light'>
                                        <Link className="nav-link text-light" to="/login">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-person" viewBox="0 0 16 16">
                                                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                                            </svg>  Login</Link>
                                    </a>
                                </li>
                            </>
                        }
                    </ul>
                </div>
            </nav>
        </>

    )
}

export default NavBar;