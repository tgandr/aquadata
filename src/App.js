import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Prof. Thiago Andrade da Silva <br />
          M.Sc. in Fishing Engineering <br />
          Instituto Federal de Educação, Ciência e Tecnologia do Ceará
        </p>
        <a
          className="App-link"
          href="https://aquiculturanoceara.blogspot.com.br"
          target="_blank"
          rel="noopener noreferrer"
        >
          Blog Aquicultura no Ceará
        </a>
      </header>
    </div>
  );
}

export default App;
