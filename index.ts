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
// app.use(bodyParser.json())
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', async (req: Request, res:Response) => {
    let blogs =  await AppDataSource.getRepository(Blog).find()
    res.render('list', {blogs: blogs})
})

app.get('/add',(req: Request, res:Response) => {
    res.render('create')
})

app.post('/add',async (req: any, res:any) => {

       let blog = {
           title : req.body.title,
           content : req.body.content
       }

       const blogRepo = AppDataSource.getRepository(Blog)
    console.log(blog)
       await blogRepo.save(blog)

       res.redirect('/')

})

app.get('/blog/:id',async (req: any, res:any) => {
    let id = req.params.id;
    let blog =  await AppDataSource.getRepository(Blog).findOne({
        where:{
            id:id
        }
    })

    console.log(blog)
    res.render('blog', {blog: blog})

})

app.get('/delete/:id', async (req: Request, res:Response) => {
    let id = req.params.id;
    await AppDataSource
        .createQueryBuilder()
        .delete()
        .from(Blog)
        .where('id = :id', {id: id})
        .execute()
    res.redirect('/')
})

app.get('/edit/:id',async (req: any, res:any) => {
    let id = req.params.id;
    let blog =  await AppDataSource.getRepository(Blog).findOne({
        where:{
            id:id
        }
    })
    res.render('edit', {blog: blog})
})

app.post('/edit/:id', async (req: any, res:any) => {
    let id = req.params.id;
    console.log(id)
    await AppDataSource
        .createQueryBuilder()
        .update(Blog)
        .set({
            title: req.body.title,
            content: req.body.content
        })
        .where('id = :id', {id:id})
        .execute()

    res.redirect('/')
})

app.listen(3000, () => {
    console.log('Server is running on port 3000')
})