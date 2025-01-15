// Componente che mostra le informazioni del PT in finestra

function InformazioniPersonaliPT({ user }) {
    return (
        <>
            <li className="nav-item">
                <a className='link-offset-2 link-offset-3-hover link-underline link-underline-opacity-0 link-underline-opacity-75-hover link-light'>
                    <button className="nav-link text-light" data-bs-toggle="modal" data-bs-target="#modalGetInfoPersonali">Informazioni personali</button>
                </a>
            </li>
            <div className="modal fade text-dark" id="modalGetInfoPersonali" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header bg-warning">
                            <h1 className="modal-title fs-5" id="exampleModalLabel">Informazioni personali</h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <ul className="list p-2">
                                <li className="list-group-item mb-1">Nome: {user.infoUtente.Nome}</li>
                                <li className="list-group-item mb-1">Cognome: {user.infoUtente.Cognome}</li>
                                <li className="list-group-item mb-1">Email: {user.infoUtente.Email}</li>
                                <li className="list-group-item mb-1">Data di nascita: {user.infoUtente.Data_di_nascita}</li>
                                <li className="list-group-item mb-1">Luogo di nascita: {user.infoUtente.Luogo_di_nascita}</li>
                                <li className="list-group-item mb-1">Link Whatsapp: {user.infoUtente.Link_whatsapp}</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default InformazioniPersonaliPT