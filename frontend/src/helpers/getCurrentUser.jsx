export const getCurrentUser = () => {
    const raw = sessionStorage.getItem("currentUser");
    const currentUser = raw ? JSON.parse(raw) : null;
    const loading = !currentUser; 

    return { currentUser, loading };
};