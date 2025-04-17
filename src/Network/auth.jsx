// import { handleApiErrors } from "../ErrorHandling/handleApiErrors";

const LoginSchoolAdmin = async ({ authorization, body }) => {
    const response = await fetch(
        `${process.env.REACT_APP_API_HOST}/schooladmin-auth/register`,
        {
            credentials: "include",
            method: "POST",
            withCredentials: true,
            body: JSON.stringify({ body }),
            headers: {
                "Content-Type": "application/json",
                authorization: `Bearer ${authorization}`,
            },
        }
    );
    if (!response.ok) {
        return Error
    }
    return await response.json();
};


export { LoginSchoolAdmin }