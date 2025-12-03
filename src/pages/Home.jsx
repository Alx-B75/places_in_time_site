import { Link } from 'react-router-dom'
import ApiDebug from '../components/ApiDebug'

const Home = () => {
  return (
    <>
      <section className="home-hero">
        <p className="eyebrow">Welcome to Places in Time</p>
        <h1>Every landmark holds a living memory</h1>
        <p className="lead">
          Wander across islands, castles, and battlefields to discover how each
          corner of Britain echoes with layered stories and the people who shaped
          them.
        </p>
        <div className="button-row">
          <Link className="button primary" to="/places">
            Explore Places
          </Link>
          <Link className="button" to="/people">
            Meet the People
          </Link>
          <Link className="button" to="/chat">
            Talk to History
          </Link>
        </div>
      </section>
      <ApiDebug />
    </>
  )
}

export default Home
