import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from '../components/NavBar';
import allenamento from '../img/allenamento.png'

function HomePage({ user }) {

    return (
        <>
            <NavBar />
            <div id="root"></div>
            <div className="centered-div "></div>
            <div className="container_home">

                <div className="left_home">
                    <div className="logo">
                        <span className="outline">FLEXI</span>
                        <span className="solid">FIT</span>
                    </div>
                    <h4 className="text-light h-20">
                        <em>"La palestra non è solo un luogo dove costruisci muscoli, ma dove forgia la tua forza mentale, la tua disciplina
                            e
                            il
                            tuo coraggio.<br />
                            Ogni goccia di sudore racconta la tua storia, ogni sacrificio è un investimento in te stesso. Non
                            smettere mai di credere in ciò che puoi diventare."
                        </em></h4>
                </div>
                <div className="right_home">
                    {<img className="imm" src={allenamento} alt="header" />}
                </div>

            </div>


        </>
    )
}

export default HomePage;