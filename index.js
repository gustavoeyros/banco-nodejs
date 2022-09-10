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
            consultarSaldo()
        }
        else if(action == 'Depositar'){
            depositar()
        }
        else if(action == 'Sacar'){

        }
        else if(action == 'Sair'){
            console.log(chalk.bgBlue('Obrigado por usar o nosso banco, até mais!'))
            process.exit()
        }
    }).catch(err=> console.log(err)) //vai pegar o erro e mostrar
}


//Criação da conta
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
        fs.writeFileSync(`contas/${nomeConta}.json`, '{"saldo": 0}', function err(){ //vai criar a conta
            console.log(err)
        })
        console.log(chalk.green("Parabéns, sua conta foi criada com sucesso!"))
        operacoes() //volta para a tela inicial após criar a conta
    }).catch(err => console.log(err))
}

//Depositar valor na conta
function depositar(){
    inquirer.prompt([{
        name: 'nomeConta',
        message: 'Qual o nome da sua conta? '
    }]).then(resposta => {
        const nomeConta = resposta['nomeConta']
        //verificar se a conta existe
        if(!verificarConta(nomeConta)){
            return depositar() //se a conta não existir, ela vai retornar para o depósito 
        }
        inquirer.prompt([{
            name: 'valor',
            message: 'Quanto você deseja depositar?'
        }]).then(resposta => {
            const valor = resposta['valor']
            //adicionar valor
            adicionarValor(nomeConta, valor)
        }).catch(err => console.log(err))
    }).catch(err => console.log(err))
}

//Adicionar valor
function adicionarValor(nomeConta, valor){
    const conta = pegarConta(nomeConta)
    if(!valor){
        console.log(chalk.bgRed.black("Ocorreu um erro, tente novamente!"))
        return depositar()
    }
    conta.saldo = parseFloat(valor) + parseFloat(conta.saldo)

//salvar as infos no bd
fs.writeFileSync(`contas/${nomeConta}.json`,
JSON.stringify(conta),
function(err)
{
    console.log(err)
})
console.log(chalk.green(`Foi depositado o valor de R$${valor} na sua conta`))
operacoes()
}

//Consultar saldo
function consultarSaldo(){
    inquirer.prompt([{
        name: 'nomeConta',
        message: 'Qual o nome da sua conta? '
    }]).then(resposta => {
        const nomeConta = resposta['nomeConta']
        if(!verificarConta(nomeConta)){
            console.log(chalk.bgRed.black("Essa conta não existe! Tenta novamente"))
            return consultarSaldo()
        }
        const conta = pegarConta(nomeConta)
        console.log(chalk.bgBlue(`Olá! O saldo atual da sua conta é R$${conta.saldo}`))
        operacoes()

    }).catch(err => console.log(err))
}





//Verificar se a conta existe
function verificarConta(nomeConta){
    if(!fs.existsSync(`contas/${nomeConta}.json`)){
        console.log(chalk.bgRed.black("Essa conta não existe, escolha outro nome!"))
        return false
    }
    return true
}
//Pegar conta
function pegarConta(nomeConta){
    const contaJSON = fs.readFileSync(`contas/${nomeConta}.json`, {
        encoding: 'utf-8',
        flag: 'r'
    })
    return JSON.parse(contaJSON)
}
