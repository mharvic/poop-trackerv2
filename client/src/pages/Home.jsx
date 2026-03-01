import reactLogo from "../assets/react.svg"
import "../App.css"

function Home() {
  return (
    <div className="home-container">
      <h1>Home</h1>
      <p>Welcome to the home page.</p>
      <img src={reactLogo} alt="React Logo" className="react-logo" />
    </div>
  )
}

export default Home