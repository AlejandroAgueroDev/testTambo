import NavBar from "../../common/NavBar";
import DataHome from "./components/DataHome";

const Home = () => {
  return (
    <div className="flex h-screen scrollbar overflow-hidden">
      <NavBar section="HOME" />
      <div className="bg-white-bg2 grow m-2 mt-3 sm:mt-5 sm:m-5 p-5 pl-10 xl:ml-5 scrollbar overflow-y-auto max-h-screen">
        <DataHome />
      </div>
    </div>
  );
};

export default Home;
