import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from '../../components/NavBar';
import { useState, useEffect } from 'react';

// Componente che permette di registrare un nuovo Cliente
function RegistraCliente() {

    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null
    let id_palestra = user.infoUtente.id;
    // Stato per la password randomica
    const [randomPassword, setRandomPassword] = useState("");
    // Stato che dice se la password randomica può essere visualizzata (alla fine del compilamento del form)
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    // Alert che avvisa se l'email è già stata utilizzata
    const [alertEmailDuplicata, setAlertEmailDuplicata] = useState(false)

    const [cliente, setCliente] = useState({
        nome: "",
        cognome: "",
        email: "",
        personalTrainer: false,
        dataNascita: "",
        luogoNascita: "",
        peso: "",
        altezza: "",
        idUser: "",
        selectedPersonalTrainer: ""
    });

    // Registra gli input del form in uno stato (cliente)
    function handleChange(e) {
        setCliente({
            ...cliente,
            [e.target.name]: e.target.value
        });
    }

    // Restituisce l'elenco dei personal trainer che finirà nel menu a tendina
    const [personalTrainers, setPersonalTrainers] = useState([]);
    useEffect(() => {
        fetch(`http://localhost:1337/api/personal-trainers?populate=*?filters[palestra][id][$eq]=${user.infoUtente.id}&filters[palestra_rimozione][$null]=null`)
            .then(response => response.json())
            .then(data => {
                setPersonalTrainers(data.data);
            })
            .catch(error => {
                console.error('Error fetching personal trainers:', error);
            });
    }, []);

    // funzione che gestisce la registrazione del Cliente nel database
    function handleSubmit(e) {
        // Crea la password randomica e la inserisce nello stato (randomPassword)
        const random = Math.random().toString(36).slice(-8)
        setRandomPassword(`${random}`);
        setIsPasswordVisible(false)
        e.preventDefault();
        console.log(user);

        // Registra il cliente nel content-type User (tabella creata di default da strapi, viene utilizzata per l'autenticazione)
        fetch('http://localhost:1337/api/auth/local/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: cliente.email,
                email: cliente.email,
                password: random
            })
        })
            .then(response => response.json())
            .then(data => {
                console.log('User registered:', data);
                try {
                    let id = data.user.id;
                    // Aggiunge il ruolo "Cliente"
                    fetch(`http://localhost:1337/api/users/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            role: 3
                        })
                    })

                    // Registra il cliente nel content-type Cliente
                    setCliente({
                        ...cliente,
                        idUser: id
                    });
                    fetch('http://localhost:1337/api/clientes', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            data: {
                                Nome: cliente.nome,
                                Cognome: cliente.cognome,
                                Personal_trainer: cliente.personalTrainer,
                                Data_di_nascita: cliente.dataNascita,
                                Luogo_di_nascita: cliente.luogoNascita,
                                Peso: cliente.peso,
                                Altezza: cliente.altezza,
                                Email: cliente.email,
                                password_abbonamento: random,
                                users_permissions_user: id,
                                palestra: id_palestra
                            }
                        })
                    })
                        .then(response => response.json())
                        .then(data => {
                            console.log('Cliente registrato:', data);
                            setIsPasswordVisible(true);
                            // Associa il cliente ad un eventuale personal trainer, registrandolo nel content-type Personal trainer / Cliente
                            if (cliente.personalTrainer == "true")
                                fetch('http://localhost:1337/api/personal-trainer-clientes', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        data: {
                                            Giorno: null,
                                            cliente: data.data.id,
                                            personal_trainer: cliente.selectedPersonalTrainer,
                                            Orario_inizio: null,
                                            Orario_fine: null
                                        }
                                    })
                                })
                                    .then(response => response.json())
                                    .then(data => {
                                        console.log('associazione fatta: ', data)
                                    })
                        })
                } catch (error) {
                    setAlertEmailDuplicata(true)
                    setIsPasswordVisible(false)
                }
            })
            .catch(error => {
                console.error('Error registering user:', error);
            });
    }

    return (
        <>
            <NavBar />

            <div className="container mt-4 w-50 mb-3 text-light rounded">
                <center>
                    <h1 className='p-2 text-light'>Registra un nuovo cliente</h1>
                </center>
                <form onSubmit={(e) => handleSubmit(e)} className='p-3'>
                    <div className='row mb-3'>
                        <div className='col'>
                            <label className="form-label">Nome:</label>
                            <input type="text" className="form-control" name="nome" required onChange={handleChange} />
                        </div>
                        <div className='col'>
                            <label className="form-label">Cognome:</label>
                            <input type="text" className="form-control" name="cognome" required onChange={handleChange} />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Email:</label>
                        <input type="email" className="form-control" name="email" required onChange={handleChange} />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Hai un personal trainer?</label>
                        <div className="form-check">
                            <input type="radio" className="form-check-input" name="personalTrainer" value={true} onClick={handleChange} />
                            <label className="form-check-label">Sì</label>
                        </div>
                        <div className="form-check">
                            <input type="radio" className="form-check-input" name="personalTrainer" value={false} onClick={handleChange} />
                            <label className="form-check-label">No</label>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Seleziona Personal Trainer:</label>
                        <select className="form-select" name="selectedPersonalTrainer" onChange={handleChange} disabled={cliente.personalTrainer == 'false'}>
                            {cliente.personalTrainer == 'true' &&
                                <>
                                    <option value="" disabled={cliente.selectedPersonalTrainer != ""}>Ecco i nostri personal trainer</option>
                                    {personalTrainers.map(trainer => (
                                        <option key={trainer.id} value={`${trainer.id}`}>
                                            {trainer.Nome} {trainer.Cognome}
                                        </option>
                                    ))}
                                </>
                            }
                        </select>
                    </div>
                    <div className='row mb-3'>
                        <div className='col'>
                            <label className="form-label">Data di nascita:</label>
                            <input type="date" className="form-control" name="dataNascita" max={new Date().toISOString().split("T")[0]} required onChange={handleChange} />
                        </div>
                        <div className='col'>
                            <label className="form-label">Luogo di nascita:</label>
                            <input type="text" className="form-control" name="luogoNascita" required onChange={handleChange} />
                        </div>
                    </div>
                    <div className='row mb-3'>
                        <div className='col'>
                            <label className="form-label">Peso (kg):</label>
                            <input type="number" className="form-control" name="peso" required onChange={handleChange} />
                        </div>
                        <div className='col'>
                            <label className="form-label">Altezza (cm):</label>
                            <input type="number" className="form-control" name="altezza" required onChange={handleChange} />
                        </div>
                    </div>
                    {randomPassword && isPasswordVisible &&
                        <>
                            <div className="alert alert-success" role="alert">
                                La password generata per il nuovo cliente è: {randomPassword}
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
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
                            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z" />
                        </svg>  Registra</button>
                </form>
            </div>
        </>
    );
}

export default RegistraCliente;
