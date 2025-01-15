import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { useEffect } from 'react';

// Componente ChatBoxAI che comunica con il cliente fornendogli informazioni e supporto (realizzato con Botpress)
function ChatBoxAI() {
    return (
        <div className="webchat" style={{ height: '90%', width: '20%', position: 'fixed', bottom: '0', right: '0', marginRight: '10px', marginBottom: '10px', }}>
            <iframe
                style={{ height: '100%', width: '100%', border: 'none' }}
                srcDoc={`<!doctype html>
        <html lang="en">
            <head></head>
            <body>
            <script src="https://cdn.botpress.cloud/webchat/v2.2/inject.js"></script>
            <script defer>
            window.botpress.init({
            "botId": "29ec8e69-92a8-4ce1-9e7b-87f4f368f201",
            "configuration": {
                "botName": "FlexiFitBot",
                "botDescription": "Benvenuto, sono il Chatbox AI di FlexiFit, come posso aiutarti 💪🏻💪🏻💪🏻💪🏻 ? (Digitare e inviare un carattere per attivare il bot)",
                "website": {},
                "email": {},
                "phone": {},
                "termsOfService": {},
                "privacyPolicy": {},
                "color": "#FFA500",
                "variant": "solid",
                "themeMode": "dark",
                "fontFamily": "inter",
                "radius": 4,
                "enableOpenOnLoad": true,
                "allowFileUpload": true
                },
             "clientId": "3557fc7d-4691-4e39-9d5d-f2c94763c9a7"
    });
                </script>
            </body>
        </html>`}
            />
        </div >
    )

}

export default ChatBoxAI;
