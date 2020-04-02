import React from 'react';
import './styles.css';
import CadastroTarefa from '../CadastroTarefa';
import Listagem from '../Listagem'; //para escolha da tarefa
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import api from '../../services/api'; //pegar os dados do banco


export default function Principal() {
    //let data;
    const data = api.get('/manage_tasks').then(response => { console.log(response); });
    console.log(data);
    //api.get('/manage_tasks').then(response => { console.log(response); });
    let options = [];
    mountOptions(data);
    const defaultOption = options[0];
    function printOpcaoSelecionada(tarefa_selecionada){
        console.log(tarefa_selecionada);
    }
    console.log(data);
    function mountOptions(data){
        for(let i = 0; i < data.length; i++){
            console.log(data[i]);
            options.push({
                value: data[i].id,
                label: data[i].name
            });
        }
    }
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
                    options={options}
                    onChange={printOpcaoSelecionada}
                    value={defaultOption}
                    placeholder="Select an option"
                />

            </div>
        </div>
    );
}