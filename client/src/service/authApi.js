import api from "./api";

export const register = async (username, password, email) => {
    return await api.post("/register", {
        username,
        password,
        email,
    },
    {
        withCredentials: true,
    }
);
};
export const authRegister = async (username, password, email) => {
    return await api.post("/authregister", {
        username,
        password,
        email,
    },
    {
        withCredentials: true,
    });
};
export const loginUser = async (identifier, password) => {
    return await api.post("/login", {
        identifier,
        password,
    },
    {
        withCredentials: true,
    }
);
};
export const authStatus = async () => {
    return await api.get("/status", {
        withCredentials: true,
    }
    );
};
export const logoutUser = async () => {
    return await api.post("/logout", { 
        withCredentials: true,
    });
};
export const setup2FA = async () => {
    return await api.post("/2fa/setup", 
    {},
    {
        withCredentials: true,
    }
);
};
export const verify2FA = async (token) => {
    return await api.post("/2fa/verify", 
    {token},
    {
        withCredentials: true,
    }
);
};
export const reset2FA = async () => {
    return await api.post("/2fa/reset", 
    {},
    {
        withCredentials: true,
    }
);
};