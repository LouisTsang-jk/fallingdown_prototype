import { Game } from './components/Game';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Ball Race Game</h1>
        <Game />
      </div>
    </div>
  );
}

export default App;