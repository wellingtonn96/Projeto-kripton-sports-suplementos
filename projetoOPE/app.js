let app = require('./config/server');
let port = 3000

app.listen(port, function(){
	console.log("servidor funcionando na porta => https//localhost:"+port);
});