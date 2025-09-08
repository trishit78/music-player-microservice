import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import { useUserData } from "./context/UserContext";
//import Loading from "./components/Loading";
import Register from "./pages/Register";
import Album from "./pages/Album";

const App = () => {

  const {isAuth} = useUserData();

  return (
    <>
    {/* {
      loading ?(<Loading/>):( */}

        
        <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/album/:id" element={<Album />} />
        <Route path="/login" element={ isAuth ? <Home />:<Login />} />
        <Route path="/register" element={ isAuth ? <Home />:<Register />} />
      </Routes>
      </BrowserRouter>
      
    </>
  );
};

export default App;
