#elabel

Testes para desenvolvimento de app com electron

Finalidade acessar base de dados remota com MySQL, obter dados referentes a uma Ordem de Produção, complementar com informações como pesos, salvar em uma tabela de controle no banco de dados e imprimir uma etiqueta com codigo de barras em impressora zebra local.  


Em caso de erro quando instalar o serialport

Para corrigir use :

Install the package with --save-dev:

npm install --save-dev electron-rebuild
Then, whenever you install a new npm package, rerun electron-rebuild:

./node_modules/.bin/electron-rebuild