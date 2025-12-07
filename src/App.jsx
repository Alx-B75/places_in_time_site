import { Route, Routes } from 'react-router-dom'
import AppLayout from './layout/AppLayout.jsx'
import Home from './pages/Home.tsx'
import Places from './pages/Places.tsx'
import Place from './pages/Place.tsx'
import People from './pages/People.tsx'
import Person from './pages/Person.tsx'
import Chat from './pages/Chat.jsx'
import Shop from './pages/Shop.jsx'
import News from './pages/News.jsx'

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
        <Route path="/shop" element={<Shop />} />
        <Route path="/news" element={<News />} />
      </Routes>
    </AppLayout>
  )
}

export default App
