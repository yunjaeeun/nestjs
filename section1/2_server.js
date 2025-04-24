const express = require('express')

const app = express();

app.get('/', (req, res) => {
    res.send("<h1>Home Page</h1>")
});

app.get('/post', (req, res) => {
    res.send("<h1>Post Page</h1>")
});

app.use((req, res) => {
    res.status(404)
    res.send("<h1>ERROR 404</h1>")
});

app.listen(3000, () => {
    console.log("Server Running On");
});