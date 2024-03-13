import { useEffect } from "react";

export function useKey(key, action){

    useEffect(function () {
        function callBack(e) {
            console.log(e);
            if (e.code.toLowerCase() !== key.toLowerCase()) return;
            action();
            console.log("close");
        }
        
        document.addEventListener("keydown", callBack);
        
        return function () {
            document.removeEventListener("keydown", callBack);
        };
    }, [key, action]);
}