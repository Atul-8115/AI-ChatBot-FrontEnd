import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
  } from "react";
  import {
    checkAtuthStatus,
    logOutUser,
    // checkAuthStatus,
    loginUser,
    signupUser,
    // logoutUser,
    // signupUser,
  } from "../helpers/api-communicator";
  
  type User = {
    name: string;
    email: string;
  };
  type UserAuth = {
    isLoggedIn: boolean;
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    signup: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
  };

const AuthContext = createContext<UserAuth | null>(null);


export const AuthProvider = ({ children} : {children: ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn,setIsLoggedIn] = useState(false);

    useEffect(() => {
      // fetch if the user's cookies are valid then skip login
      async function checkSatus() {
        const data = await checkAtuthStatus();
        console.log("Printing data in checking auth status. -> ", data)
        if(data) {
          setUser({ email: data.email, name: data.name});
          setIsLoggedIn(true);
        }
      }
      checkSatus(); 
    }, []);
    const login = async (email:string,password:string) => {
        const data = await loginUser(email,password);
        if(data) {
            setUser({ email: data.email, name: data.name});
            setIsLoggedIn(true);
        }
    };
    const signup = async (name: string, email: string, password:string) => {
      const data = await signupUser(name, email,password);
        if(data) {
            setUser({ email: data.email, name: data.name});
            setIsLoggedIn(true);
        }
    };
    const logout = async () => {
      await logOutUser();
      setIsLoggedIn(false);
      setUser(null);
      window.location.reload();
    };

    const value = {
        user,
        isLoggedIn,
        login,
        logout,
        signup,
    };
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
};

export const useAuth = () => useContext(AuthContext);