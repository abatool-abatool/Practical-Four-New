var express = require("express")
var app = express()
var cors = require('cors')
let projectCollection;

const MongoClient = require('mongoDb').MongoClient;

//database connection...
const uri = 'mongodb+srv://abatoo:admin@cluster0.k20uelk.mongodb.net/?retryWrites=true&w=majority'
const client =  new MongoClient(uri,{ useNewUrlParser: true })

app.use(express.static(__dirname+'/public'))
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors())

const createColllection = (collectionName) => {
    client.connect((err,db) => {
        projectCollection = client.db().collection(collectionName);
        if(!err) {
            console.log('MongoDB Connected')
        }
        else {
            console.log("DB Error: ", err);
            process.exit(1);
        }
    })
}

// insert project...
const insertProjects = (project,callback) => {
    projectCollection.insert(project,callback);
}

// get project...
const getProjects = (callback) => {
    projectCollection.find({}).toArray(callback);
}

const cardList = [
    {
        title: "Kitten 2",
        image: "images/kitten1.jpg",
        link: "About Kitten 1",
        desciption: "Demo desciption about kitten 2"
    },
    {
        title: "Kitten 3",
        image: "images/kitten2.jpg",
        link: "About Kitten 2",
        desciption: "Demo desciption about kitten 3"
    }
]

app.get('/api/projects',(req,res) => {
    getProjects((err,result) => {
        if(err) {
            res.json({statusCode: 400, message: err})
        }
        else {
            res.json({statusCode: 200, message:"Success", data: result})
        }
    })
})

// post api....
app.post('/api/projects',(req,res) => {
    console.log("New Project added", req.body)
    var newProject = req.body;
    insertProjects(newProject,(err,result) => {
        if(err) {
            res.json({statusCode: 400, message: err})
        }
        else {
            res.json({statusCode: 200, message:"Project Successfully added", data: result})
        }
    })
})

var port = process.env.port || 3000;

app.listen(port,()=>{
    console.log("App listening to: "+port)
    createColllection("pets")
})