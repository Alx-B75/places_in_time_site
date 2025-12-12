import { Route, Routes } from 'react-router-dom'
import AppLayout from './layout/AppLayout.jsx'
import Home from './pages/Home.tsx'
import Places from './pages/Places.tsx'
import Place from './pages/Place.tsx'
import People from './pages/People.tsx'
import Person from './pages/Person.tsx'
import ChatHub from './pages/Chat.jsx'
import RedirectPage from './pages/RedirectPage.jsx'
import FigureQuotha from './pages/FigureQuotha.jsx'
import Shop from './pages/Shop.jsx'
import News from './pages/News.tsx'
import About from './pages/About.tsx'
import PrivacyPolicy from './pages/PrivacyPolicy.tsx'
import TermsOfUse from './pages/TermsOfUse.tsx'
import Impressum from './pages/Impressum.tsx'
import CookieBanner from './components/CookieBanner.tsx'

const App = () => {
  return (
    <>
      <AppLayout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/places" element={<Places />} />
          <Route path="/places/:slug" element={<Place />} />
          <Route path="/people" element={<People />} />
          <Route path="/people/:slug" element={<Person />} />
          <Route path="/figures/quotha" element={<FigureQuotha />} />
          <Route path="/chat" element={<ChatHub />} />
          <Route
            path="/login"
            element={<RedirectPage to="https://places-in-time-history-chat-front.onrender.com/login" />}
          />
          <Route
            path="/register"
            element={<RedirectPage to="https://places-in-time-history-chat-front.onrender.com/register" />}
          />
          <Route
            path="/chat-app"
            element={<RedirectPage to="https://places-in-time-history-chat-front.onrender.com/" />}
          />
          <Route path="/shop" element={<Shop />} />
          <Route path="/news" element={<News />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy-policy-gdpr" element={<PrivacyPolicy />} />
          <Route path="/terms-of-use" element={<TermsOfUse />} />
          <Route path="/impressum" element={<Impressum />} />
        </Routes>
      </AppLayout>
      <CookieBanner />
    </>
  )
}

export default App
