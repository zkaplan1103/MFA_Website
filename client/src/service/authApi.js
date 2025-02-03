import api from "./api";

export const register = async (username, password, email) => {
    return await api.post("/auth/register", {
        username,
        password,
        email,
    });
}

export const login = async (identifier, password) => {
    return await api.post("/auth/login", 
        {
        identifier,
        password,
        },
        {
            withCredentials: true,
        }
    );
}
export const authStatus = async (identifier, password) => {
    return await api.post("/auth/status", 
        {
        identifier,
        password,
        },
        {
            withCredentials: true,
        }
    );
}