import Hero from './pages/Hero'
import Navbar from './Components/Navbar'
import Story from './pages/Story'
import Philosophy from './pages/Philosophy'

function App(){
  return(
    <div className="w-full h-full bg-slate-900 text-white px-7 ">
      <Navbar />
      <Hero />
      <Story />
      <Philosophy />
    </div>
  );
}

export default App