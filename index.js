//REQUIRED VARIABLES 
const fs = require('fs');
const http = require('http');
const url = require('url');
//PORT SERVER IS RUNNING
const PORT = 5000;

//BINDING JSON DATA TO PLACEHOLDERS
const replaceInfo = (temp, user) => {
    let output = temp.replace(/{%ID%}/g, user.id);
    output = output.replace(/{%NAME%}/g, user.name);
    output = output.replace(/{%ADDRESS%}/g, user.address);
    output = output.replace(/{%EMAIL%}/g, user.email);
    output = output.replace(/{%PICTURE%}/g, user.picture);
    output = output.replace(/{%AGE%}/g, user.age);
    output = output.replace(/{%EYECOLOR%}/g, user.eyeColor);
    return output;
}

//READING HTML PAGES TO VARIABLE 
const viewOverview = fs.readFileSync(`${__dirname}/views/view-overview.html`, 'utf-8');
const viewUser = fs.readFileSync(`${__dirname}/views/view-user.html`, 'utf-8');
const viewUsertable = fs.readFileSync(`${__dirname}/views/view-usertable.html`, 'utf-8');
//READING JSON FILE 
const data = fs.readFileSync(`${__dirname}/Data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
//SERVER
const server = http.createServer((req, res) => {

    const {query, pathname} = url.parse(req.url, true);
//ROUTES 
    if (pathname === '/'|| pathname === '/overview') {
//DISPLAYING HTML IN THE BROWESER        
        res.writeHead(200, {'Content-type': 'text/html'});
//LOOPING DATA TO TABLE
        const trInfo = dataObj.map(el => replaceInfo (viewUsertable, el)).join('');
        const output = viewOverview.replace('{%USER_TABLE%}', trInfo);
//SENDING TABLE TO THE BROWSER
        res.end(output);
    } 
//CREATING USER ROUTE    
    else if (pathname === '/user') {
//DISPLAYING HTML IN THE BROWESER 
        res.writeHead(200, {'Content-type': 'text/html'});
//QUERYING THE USER BY ID AND ADDING THAT INFO TO A VARIABLE
        const user = dataObj[query.id];
        const output = replaceInfo(viewUser, user);
//SENDING TABLE TO THE BROWSER
        res.end(output);
    } 
//CREATING AN API ROUTE 
    else if (pathname === '/api'){
//DISPLAYING JSON FILE AS HTML IN BROWSER
        res.writeHead(200, { 'Content-type': 'application/json'});
        res.end(data);
    } 
//PAGE NOT FOUND ERROR    
    else {
        res.writeHead(400, {
            'Content-type': 'text/html'
        });
        res.end('<h1>Page not found</h1>');
    }

});

//SERVER PORT AND LOCAL IP ADDRESS
server.listen (PORT, '127.0.0.1', () => {
    console.log('Server has been started on '+PORT);
});