"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const data_source_1 = require("./src/data-source");
const body_parser_1 = __importDefault(require("body-parser"));
const Blog_1 = require("./src/entity/Blog");
const multer_1 = __importDefault(require("multer"));
const app = (0, express_1.default)();
const update = (0, multer_1.default)();
data_source_1.AppDataSource
    .initialize()
    .then(() => {
    console.log('Data Source has been initialized!');
})
    .catch((err) => {
    console.error("Error during Data Source initialization:", err);
});
app.set('view engine', 'ejs');
app.set('views', './src/views');
app.use(express_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.get('/', async (req, res) => {
    let blogs = await data_source_1.AppDataSource.getRepository(Blog_1.Blog).find();
    res.render('list', { blogs: blogs });
});
app.get('/add', (req, res) => {
    res.render('create');
});
app.post('/add', async (req, res) => {
    let blog = {
        title: req.body.title,
        content: req.body.content
    };
    const blogRepo = data_source_1.AppDataSource.getRepository(Blog_1.Blog);
    console.log(blog);
    await blogRepo.save(blog);
    res.redirect('/');
});
app.get('/blog/:id', async (req, res) => {
    let id = req.params.id;
    let blog = await data_source_1.AppDataSource.getRepository(Blog_1.Blog).findOne({
        where: {
            id: id
        }
    });
    console.log(blog);
    res.render('blog', { blog: blog });
});
app.get('/delete/:id', async (req, res) => {
    let id = req.params.id;
    await data_source_1.AppDataSource
        .createQueryBuilder()
        .delete()
        .from(Blog_1.Blog)
        .where('id = :id', { id: id })
        .execute();
    res.redirect('/');
});
app.get('/edit/:id', async (req, res) => {
    let id = req.params.id;
    let blog = await data_source_1.AppDataSource.getRepository(Blog_1.Blog).findOne({
        where: {
            id: id
        }
    });
    res.render('edit', { blog: blog });
});
app.post('/edit/:id', async (req, res) => {
    let id = req.params.id;
    console.log(id);
    await data_source_1.AppDataSource
        .createQueryBuilder()
        .update(Blog_1.Blog)
        .set({
        title: req.body.title,
        content: req.body.content
    })
        .where('id = :id', { id: id })
        .execute();
    res.redirect('/');
});
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
//# sourceMappingURL=index.js.map