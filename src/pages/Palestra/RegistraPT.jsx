import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from '../../components/NavBar';
import { useState, useEffect } from 'react';

// Componente che permette di registrare un nuovo personal trainer
function RegistraPT() {

    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null
    let id_palestra = user.infoUtente.id;

    // Stato per la password randomica
    const [randomPassword, setRandomPassword] = useState("");
    // Stato che dice se la password randomica può essere visualizzata (alla fine del compilamento del form)
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    // Alert che avvisa se l'email è già stata utilizzata
    const [alertEmailDuplicata, setAlertEmailDuplicata] = useState(false)

    const [pt, setPt] = useState({
        nome: "",
        cognome: "",
        email: "",
        dataNascita: "",
        luogoNascita: "",
        LinkWhatsapp: "",
        idUser: ""
    });

    // Registra gli input del form in uno stato (pt)
    function handleChange(e) {
        if (e.target.name == "LinkWhatsapp")
            setPt({
                ...pt,
                [e.target.name]: `https://wa.me/${e.target.value}`
            });
        else
            setPt({
                ...pt,
                [e.target.name]: e.target.value
            });
    }


    // funzione che gestisce la registrazione del PT nel database
    function handleSubmit(e) {
        // Crea la password randomica e la inserisce nello stato (randomPassword)
        const random = Math.random().toString(36).slice(-8)
        setRandomPassword(`${random}`)
        e.preventDefault()
        setIsPasswordVisible(false)

        // Registra il PT nel content-type User (tabella creata di default da strapi, viene utilizzata per l'autenticazione)
        fetch('http://localhost:1337/api/auth/local/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: pt.email,
                email: pt.email,
                password: random
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log('User registered:', data);
                try {
                    let id = data.user.id;
                    // Aggiunge il ruolo "PT"
                    fetch(`http://localhost:1337/api/users/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            role: 5
                        })
                    })

                    // Registra il pt nel content-type Personal Trainer
                    setPt({
                        ...pt,
                        idUser: id
                    });
                    fetch('http://localhost:1337/api/personal-trainers', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            data: {
                                Nome: pt.nome,
                                Cognome: pt.cognome,
                                Data_di_nascita: pt.dataNascita,
                                Luogo_di_nascita: pt.luogoNascita,
                                Email: pt.email,
                                Link_whatsapp: pt.LinkWhatsapp,
                                Password: random,
                                users_permissions_user: id,
                                palestra: id_palestra
                            }
                        })
                    })
                        .then(response => response.json())
                        .then(data => {
                            console.log('PT registrato:', data);
                            setIsPasswordVisible(true);
                            setAlertEmailDuplicata(false)
                        })
                } catch (error) {
                    setAlertEmailDuplicata(true)
                    setIsPasswordVisible(false)
                }
            })

    }

    return (
        <>
            <NavBar />
            <div className="container mt-4 w-50 mb-3 text-light rounded">
                <center>
                    <h1 className='p-2 text-light'>Registra un nuovo personal trainer</h1>
                </center>
                <form onSubmit={(e) => handleSubmit(e)} className='p-3'>
                    <div className="mb-3">
                        <label className="form-label">Nome:</label>
                        <input type="text" className="form-control" name="nome" required onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Cognome:</label>
                        <input type="text" className="form-control" name="cognome" required onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email:</label>
                        <input type="email" className="form-control" name="email" required onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Data di nascita:</label>
                        {/* Imposta come data di nascita massima la data di oggi */}
                        <input type="date" className="form-control" name="dataNascita" max={new Date().toISOString().split("T")[0]} required onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Luogo di nascita:</label>
                        <input type="text" className="form-control" name="luogoNascita" required onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Link di Whatsapp:</label>
                        <div class="input-group mb-3">
                            <span class="input-group-text" id="basic-addon1">https://wa.me/</span>
                            <input type="text" className="form-control" name="LinkWhatsapp" required onChange={handleChange} placeholder="numero telefonico" />
                        </div>
                    </div>
                    {/* Mostra gli alert */}
                    {randomPassword && isPasswordVisible &&
                        <>
                            <div className="alert alert-success" role="alert">
                                La password generata per il nuovo PT è: {randomPassword}
                            </div>
                        </>
                    }
                    {
                        alertEmailDuplicata &&
                        <>
                            <div className="alert alert-warning" role="alert">
                                Email già utilizzata.
                            </div>
                        </>
                    }
                    <button type="submit" className="btn btn-warning max_dim" >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path fillRule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                        </svg>  Registra</button>
                </form>
            </div>
        </>
    );
}

export default RegistraPT;
