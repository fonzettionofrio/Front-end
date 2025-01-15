import React, { useEffect, useState } from "react";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

// Consente agli utenti di fare login
function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [token, setToken] = useState("");
    const [utente, setUtente] = useState({ role: "", infoUtente: {} });
    const navigate = useNavigate();

    // Effetto per ottenere i dati dell'utente dopo aver impostato il token
    useEffect(() => {
        if (token) {
            const decoded = jwtDecode(token);
            const id = decoded.id;
            // Ritorna il ruolo dell'utente
            fetch(`http://localhost:1337/api/users/${id}?populate=role`)
                .then((response) => response.json())
                .then((response) => {
                    const role = response.role.name;
                    // In base al ruolo, fa delle fetch nelle rispettive tabelle ed aggiorna lo stato "utente"
                    switch (role) {
                        case "Palestra":
                            fetch(`http://localhost:1337/api/palestras?populate=*&filters[users_permissions_user][id][$eq]=${id}`)
                                .then((response) => response.json())
                                .then((response) => {
                                    const infoUtente = response.data[0];
                                    setUtente({ role, infoUtente });
                                });
                            break;

                        case "Cliente":
                            fetch(`http://localhost:1337/api/clientes?populate=*&filters[users_permissions_user][id][$eq]=${id}&filters[palestra_rimozione][$null]=null`)
                                .then((response) => response.json())
                                .then((response) => {
                                    const infoUtente = response.data[0];
                                    setUtente({ role, infoUtente });
                                });
                            break;

                        case "Personal Trainer":
                            fetch(`http://localhost:1337/api/personal-trainers?populate=*&filters[users_permissions_user][id][$eq]=${id}&filters[palestra_rimozione][$null]=null`)
                                .then((response) => response.json())
                                .then((response) => {
                                    const infoUtente = response.data[0];
                                    setUtente({ role, infoUtente });
                                });
                            break;

                        default:
                            setError("Ruolo utente non riconosciuto");
                    }
                });
        }
    }, [token]);

    // Effetto per salvare i dati nel localStorage quando `utente` viene aggiornato
    useEffect(() => {
        if (token && utente.role) {
            localStorage.setItem("jwt", token);
            localStorage.setItem("user", JSON.stringify(utente));
            handleNavigate("/infoUser");
        }
    }, [token, utente]);

    // Funzione per navigare in una pagina
    function handleNavigate(percorso) {
        navigate(percorso);
    }

    // Funzione che fa il login e salva il token nello stato, eventualmente mostra un errore
    function handleSubmit(e) {
        e.preventDefault();

        fetch("http://localhost:1337/api/auth/local", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                identifier: email,
                password: password,
            }),
        })
            .then((response) => response.json())
            .then((response) => {
                if (response.jwt) {
                    setToken(response.jwt);
                    setError("");
                } else {
                    setError("Email o password errati");
                }
            })
            .catch(() => {
                setError("Errore di rete durante il login");
            });
    }

    return (
        <>
            <NavBar />
            <div className="d-flex justify-content-center align-items-center">
                <div className="p-3 text-center text-light rounded">
                    <h2 className="mb-4">Login</h2>
                    <hr />
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control w-100"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input
                                type="password"
                                className="form-control w-100"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        <button type="submit" className="btn btn-warning w-100">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-door-open" viewBox="0 0 16 16">
                                <path d="M8.5 10c-.276 0-.5-.448-.5-1s.224-1 .5-1 .5.448.5 1-.224 1-.5 1" />
                                <path d="M10.828.122A.5.5 0 0 1 11 .5V1h.5A1.5 1.5 0 0 1 13 2.5V15h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3V1.5a.5.5 0 0 1 .43-.495l7-1a.5.5 0 0 1 .398.117M11.5 2H11v13h1V2.5a.5.5 0 0 0-.5-.5M4 1.934V15h6V1.077z" />
                            </svg> Login
                        </button>
                    </form>
                    {error && <p className="text-danger mt-3">{error}</p>}
                </div>
            </div>
        </>
    );
}

export default LoginPage;
