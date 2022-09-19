import express from "express";
import fs from "fs";
import path from "path";

const rawConfig = fs.readFileSync('./config.json')
const config = JSON.parse(rawConfig)

const app = express();
const port = config.port

app.set('view engine', 'ejs')

app.use(express.static('public'))

const coffeChoser = function() {
   let coffees = fs.readdirSync('./public/coffee')
   let chosenCoffee = coffees[Math.floor(Math.random() * coffees.length)]
   return chosenCoffee  
}


app.get('/', (req, res) => {
    let coffees = fs.readdirSync('./public/coffee')
    res.render('index', {
        imageCount: coffees.length,
        config
    })
})

app.get('/random', (req, res) => {
    let coffee = coffeChoser()
    res.sendFile(path.resolve() + `/public/coffee/${coffee}`)
})
app.get('/randomstatic', (req, res) => {
    let coffee = coffeChoser()
    res.redirect(`/coffee/${coffee}`)
})

app.get('/random.json', (req, res) => {
    let coffee = coffeChoser()
    res.json({"image": `${config.url}/coffee/${coffee}`})
})

app.get('*', (req, res) => (
    res.status(404).render('404')
))

app.listen(port, () => {
    console.log((`Application running on port: ${port}`))
})