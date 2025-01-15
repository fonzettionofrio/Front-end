import { useEffect } from "react";
import { useNavigate } from "react-router-dom";


// Hook per verificare se il token è presente
function useVerifyToken() {
    const navigate = useNavigate();
    const token = localStorage.getItem("jwt");

    function handleNavigate() {
        navigate("/login");
    }

    useEffect(() => {
        if (!token) {
            handleNavigate();
        }
    });

}

export default useVerifyToken;