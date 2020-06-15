import React from 'react';
import './styles.css';
//import Listagem from '../Listagem'; //para escolha da tarefa
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
//import api from '../../services/api'; //pegar os dados do banco
//import {useHistory} from 'react-router-dom';
import '../../routes'

export default function Principal() {
    //api.get('/manage_tasks').then(response => { console.log(response); });
    let options = [];
    const defaultOption = options[0];
    function printOpcaoSelecionada(tarefa_selecionada){
        console.log(tarefa_selecionada);
    }
    //console.log(data);

    return(
        <div /*className="styles.container"*/>
            <div className="header">
                <div>
                    <h1 className="title">CONTROL TIME</h1>
                </div>
                <div>
                    
                    <button  className="button_header" type="submit">NOVA TAREFA</button>
                    
                    <button className="button_header" type="submit">LISTA TAREFA</button>
                </div>
            </div>
            <div className="body">
                <h1 className="titulo_principal">GERENCIAMENTO DE TAREFA</h1>
                <div className="class_dropdown">
                    <p>TAREFA:</p>
                    <Dropdown
                        options={options}
                        onChange={printOpcaoSelecionada}
                        value={defaultOption}
                        placeholder="Select an option"
                    />
                    <button className="button">OK</button>
                </div>
                <h1 className="titulo_principal">00:00:00</h1>
                <div className="botoes">
                    <button className="escolha_botoes">INICIAR</button>
                    <button className="escolha_botoes">PAUSAR</button>
                    <button className="escolha_botoes">CONCLUIR</button>
                </div>

            </div>
        </div>
    );
}