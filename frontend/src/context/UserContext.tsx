import axios from "axios";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

import toast, { Toaster } from "react-hot-toast";

const server = "http://localhost:3000"


export interface User{
    _id:string,
    name:string,
    email:string,
    role:string,
    playlist:string[]
}



interface UserProviderProps{
    children:ReactNode
}
interface UserContextType{
    user:User| null;
    isAuth:boolean;
    loading:boolean;
    btnLoading:boolean;
    loginUser:(
        email:string,
        password:string,
        navigate:(path:string)=>void
    )=>Promise<void>
}

const UserContext = createContext<UserContextType | undefined>(undefined);




export const UserProvider:React.FC<UserProviderProps> = ({children}) =>{
    
    const [user,setUser] = useState<User | null>(null);
    const [loading,setLoading] = useState(true);
    const [isAuth,setIsAuth] = useState(false);
    const [btnLoading,setBtnLoading] = useState(false);
    async function loginUser(email:string,password:string,navigate:(path:string)=>void){
        setBtnLoading(true);
        try {
            const {data} = await axios.post(`{server}/api/v1/user/login`,{
                email,password
            })
            toast.success(data.message);
            localStorage.setItem("token",data.token);
            setUser(data.user);
            setIsAuth(true);
            setBtnLoading(false);
            navigate("/");
        } catch (error) {
           console.log(error);
           setBtnLoading(false);
        }
    }

    async function fetchUser() {
        try {
            const {data} = await axios.get(`${server}/api/v1/user/me`,{
                headers:{
                    token:localStorage.getItem("token")
                }
            });

            setUser(data);
            setIsAuth(true);
            setLoading(false);
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(()=>{
        fetchUser()
    },[])


    return <UserContext.Provider   value={{user,isAuth,loading,btnLoading,loginUser}}>{children}   <Toaster /> </UserContext.Provider>
}


export const useUserData = ():UserContextType=>{
    const context = useContext(UserContext);

    if(!context){
        throw new Error("useUserData must be used within a UserProvider");

    }
    return context;
}


