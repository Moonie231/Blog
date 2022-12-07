import express, {Request,Response} from 'express';
import {AppDataSource} from "./src/data-source";
import bodyParser from "body-parser";
import {Blog} from "./src/entity/Blog";
import multer from 'multer';

const app = express()
const update = multer()

AppDataSource
    .initialize()
    .then(() => {
        console.log('Data Source has been initialized!')
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    })

app.set('view engine', 'ejs');
app.set('views', './src/views')
app.use(bodyParser.json())
app.use(express.json())

app.get('/', async (req: Request, res:Response) => {
    let blogs =  await AppDataSource.getRepository(Blog).find()
    res.render('list', {blogs: blogs})
})

app.get('/add',(req: Request, res:Response) => {
    res.render('create')
})

app.post('/add',async (req: any, res:any) => {

       let blog = new Blog();
       blog.title = req.body.title
        blog.content = req.body.content
       const blogRepo = AppDataSource.getRepository(Blog)
    console.log(req.body)
       await blogRepo.save(blog)

       res.redirect('/')

})

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/public/upload')
    },
    filename: function (req, file, cb) {
        console.log(file)
        cb(null, file.originalname)
    }
})

app.get('/blog')

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})