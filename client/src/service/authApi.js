import api from "./api";

export const register = async (username, password, email) => {
    return await api.post("/auth/register", {
        username,
        password,
        email,
    },
    {
        withCredentials: true,
    }
);
};
export const loginUser = async (identifier, password) => {
    return await api.post("/auth/login", {
        identifier,
        password,
    },
    {
        withCredentials: true,
    }
);
};
export const authStatus = async () => {
    return await api.get("/auth/status", {
        withCredentials: true,
    }
    );
};
export const logoutUser = async () => {
    return await api.post("/auth/logout", { 
        withCredentials: true,
    });
};
export const setup2FA = async () => {
    return await api.post("/auth/2fa/setup", 
    {},
    {
        withCredentials: true,
    }
);
};
export const verify2FA = async () => {
    return await api.post("/auth/2fa/verify", 
    {token},
    {
        withCredentials: true,
    }
);
};
export const reset2FA = async () => {
    return await api.post("/auth/2fa/reset", 
    {},
    {
        withCredentials: true,
    }
);
};