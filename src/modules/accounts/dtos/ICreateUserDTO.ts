interface ICreateUserDTO {
    name: string;
    password: string;
    email: string;
    driver_license: string;
    id?: string; 
    avatar?: string;
    isAdmin?: boolean
}

export default ICreateUserDTO