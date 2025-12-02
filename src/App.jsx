import { Route, Routes } from 'react-router-dom'
import AppLayout from './layout/AppLayout.jsx'
import Home from './pages/Home.jsx'
import Places from './pages/Places.jsx'
import Place from './pages/Place.jsx'
import People from './pages/People.jsx'
import Person from './pages/Person.jsx'
import Chat from './pages/Chat.jsx'

const App = () => {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/places" element={<Places />} />
        <Route path="/places/:slug" element={<Place />} />
        <Route path="/people" element={<People />} />
        <Route path="/people/:slug" element={<Person />} />
        <Route path="/chat" element={<Chat />} />
      </Routes>
    </AppLayout>
  )
}

export default App
