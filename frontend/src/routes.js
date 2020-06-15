import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Principal from './pages/Principal';
import CadastroTarefa from './pages/CadastroTarefa';
import Listagem from './pages/Listagem';
import ReactDOM from 'react-dom';
import App from './App';

ReactDOM.render(
    (
        <Router>
            <App>
                <Switch>
                    <Route exact path="/" component={Principal}/>
                    <Route path="/cadastro_tarefa" component={CadastroTarefa}/>
                    <Route path="/listagem" component={Listagem}/>
                </Switch>
            </App>
        </Router>
    ),
    document.getElementById('root')
);