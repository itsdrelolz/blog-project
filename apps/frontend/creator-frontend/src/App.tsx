import Header from '../../shared/components/Header'
import Footer from '../../shared/components/Footer'
import HomePage from '../../shared/Pages/HomePage'

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