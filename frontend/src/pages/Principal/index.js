import React from 'react';
import './styles.css';
import CadastroTarefa from '../CadastroTarefa';
import Listagem from '../Listagem'; //para escolha da tarefa
import {Dropdown} from 'primereact/dropdown';
//import {Dropdown} from 'primereact/components/dropdown';
import api from '../../services/api'; //pegar os dados do banco


export default function Principal() {
    const data = api.get('/manage_tasks');
    
    return(
        <div /*className="styles.container"*/>
            <div className="header">
                <div>
                    <h1 className="title">CONTROL TIME</h1>
                </div>
                <div>
                    <button onClick={CadastroTarefa} className="button_header" type="submit">NOVA TAREFA</button>
                    <button onClick={Listagem} className="button_header" type="submit">LISTA TAREFA</button>
                </div>
            </div>
            <div className="body">
                <h1>GERENCIAMENTO DE TAREFA</h1>
                <p>TAREFA:</p>
                <Dropdown
                    value={data.name}
                    options={data}
                    onChange={(e) => {this.setState({city: e.value})}}
                    placeholder="Select a City"
                />

            </div>
        </div>
    );
}