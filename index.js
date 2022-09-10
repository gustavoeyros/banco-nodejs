//exportar os modulos externos
const inquirer = require('inquirer')
const chalk = require('chalk')

//modulos internos (core modules)
const fs = require('fs')

//auto invocar as opções do sistema
operacoes()

//opções do sistema
function operacoes(){
    inquirer.prompt([{
        type: 'list',
        name: 'action',
        message: 'Bem-vindo! O que você deseja fazer?',
        choices: [
            'Criar conta',
            'Consultar saldo',
            'Depositar',
            'Sacar',
            'Sair'
        ]
    }]).then(resposta => {
        const action = resposta['action']
        if(action == 'Criar conta'){
            criarConta()
        }
        else if(action == 'Consultar saldo'){

        }
        else if(action == 'Depositar'){

        }
        else if(action == 'Sacar'){

        }
        else if(action == 'Sair'){
            console.log(chalk.bgBlue('Obrigado por usar o nosso banco, até mais!'))
            process.exit()
        }
    }).catch(err=> console.log(err)) //vai pegar o erro e mostrar
}


function criarConta(){
    console.log(chalk.bgGreen.black("Obrigado por escolher o nosso banco!"))
    console.log(chalk.green("Defina as opções da sua conta a seguir"))
    montarConta()
}
function montarConta(){
    inquirer.prompt([{
        name: 'nomeConta',
        message: 'Digite um nome de usuário para sua conta: '
    }]).then(resposta => {
        const nomeConta = resposta['nomeConta']
        if(!fs.existsSync('contas')){ //verifica se não há nenhuma pasta 'contas' existente
            fs.mkdirSync('contas') //vai criar a contas que é o bd em json
        }
        if(fs.existsSync(`contas/${nomeConta}.json`)){
            console.log(chalk.bgRed.black("Essa conta já existe, escolha outro nome!"))
            montarConta()
            return //caso já existir essa conta, ele irá retornar para a tela de criação novamente
        }
        fs.writeFileSync(`contas/${nomeConta}.json`, '{saldo: 0}', function err(){ //vai criar a conta
            console.log(err)
        })
        console.log(chalk.green("Parabéns, sua conta foi criada com sucesso!"))
        operacoes() //volta para a tela inicial após criar a conta
    }).catch(err => console.log(err))
}