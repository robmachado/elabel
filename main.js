
//estabelece classes principais
const { app, BrowserWindow, ipcMain } = require('electron');
//classe para tratamento de paths
const path = require('path');
//classe para tratamento de urls
const url = require('url');

//cria a janela principal 
function createWindow() {
    mainWindow = new BrowserWindow({ width: 680, height: 520, titleBarStyle: 'hidden' });
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    //abre o devtools do browser, em produção isso deve estar comentado
    mainWindow.webContents.openDevTools();
    //ao acionar o fechamento da janela executar
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    //chamada de metodo ao finalizar o carregamento da janela
    mainWindow.webContents.on('did-finish-load', () => {
        //disparar a ação estabelecida em render ao terminar o carregamento
        mainWindow.webContents.send('did-finish-load');
    });
}

//executa ao submeter
function handleSubmission() {
    ipcMain.on('did-submit-form', (event, argument) => {
        
        /*
        const { source, destination, name, fps } = argument;
        generator(source, destination, name, fps).then(
            success => {
                console.log(success);
                event.sender.send('processing-did-succeed', /^(.*?.html)/m.exec(success)[1]);
            },
            error => {
                console.log(error);
                event.sender.send('processing-did-fail', error);
            }
        );
        */
    });
}

//Evento de termino do carregamento do Electron
//Ao terminar a inicialização e estiver pronto para criar a janela do browser
//Algumas APIs somente podem ser usadas após a ocorrencia desse evento
app.on('ready', () => {
    createWindow();
    handleSubmission();
});

//Evento de fechamento da janela
app.on('window-all-closed', () => {
    //No OS X é commum para aplicações e suas barras de menus
    //permaneçam ativas até que o usuário saia explicitamente com CMD + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

//Evento de ativação da janela 
app.on('activate', () => {
    //No OS X é comum a recriação da janela do aplicativo quando o
    //icone da doca é clicado e não existem outras janelas abertas.
    if (mainWindow === null) {
        createWindow();
    }
});
