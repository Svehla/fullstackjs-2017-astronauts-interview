import { ApolloClient, ApolloProvider, createNetworkInterface  } from 'react-apollo'
import React, { Component } from 'react'
import { Route, Redirect  } from 'react-router'
import ShowAll from './showAll/index'
import ShowSuperPower from './superPower/index'
import CreateAstronaut from './CreateAstronaut'
import ShowAstronaut from './showAstronaut/index'
import { BrowserRouter } from 'react-router-dom'
import { IntlProvider } from 'react-intl'
import 'react-toastify/dist/ReactToastify.min.css'
import { ToastContainer } from 'react-toastify';
import Menu from './Menu'
import './index.css';
const { addLocaleData } = require('react-intl');
const cs = require('react-intl/locale-data/cs');
addLocaleData(cs)


const networkInterface = createNetworkInterface({
  uri: 'http://localhost:1337/graphql'
});

const client = new ApolloClient({
  networkInterface: networkInterface,
  dataIdFromObject: o => o.id
});


class App extends Component {
  render() {
    return (
      <div>
        <IntlProvider locale='cs'>
          <BrowserRouter>
            <ApolloProvider client={client}>
              <div>
                <Menu />
                <ToastContainer
                  position="top-right"
                  type="default"
                  autoClose={5000}
                  hideProgressBar={false}
                  newestOnTop={false}
                  closeOnClick
                  pauseOnHover
                />
                <Route path="/" component={ (props) => (
                   props.location.pathname === '/'
                     ? <Redirect to="/allAstronauts"/> : false
                 )} />

                <Route path="/createAstronaut" component={ CreateAstronaut } />
                <Route path="/allAstronauts" component={ ShowAll } />
                <Route path="/updateAstronaut/:idAstronaut" component={ () => (<p>'update'</p>) } />

                <Route path="/showSuperPower/:idSuperPower" component={ ShowSuperPower } />
                <Route path="/showAstronaut/:idAstronaut" component={ ShowAstronaut } />

              </div>
            </ApolloProvider>
          </BrowserRouter>
        </IntlProvider>
      </div>
    );
  }
}

export default App;
