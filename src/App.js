import logo from './logo.svg';
import './App.css';
import MainProduct from './product/main';

function App() {
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <div>
          <MainProduct />
        </div>
      </header>
    </div>
  );
}

export default App;
