import Header from './components/Header'
import Footer from './components/Footer'
import HomePage from './pages/HomePage'
const App = () => {
        
  
        return (
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">
                  <HomePage />
                </main>
                <Footer />
              </div>
  
        );
      }
    
export default App;
