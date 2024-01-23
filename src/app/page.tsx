import Image from "next/image";
import { Home } from "./components/Components";
import { HashRouter as Router, Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <main className="flex bg-primary_dark min-h-screen flex-col items-center justify-between p-24">
      
      <AppRouter />


    </main>
  );
}

const AppRouter = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </Router>

    </div>
  )
}
