import fastify from 'fastify';
import { PrismaClient } from '@prisma/client';



// --------------------------------------------------------------------
const app = fastify();
const prisma = new PrismaClient();

// app.register(require('@fastify/cors'), {
  
// })
// //* CORS(allowedHeaders options are IMPORTANT for Access-control-allow-origin)
app.register(require('@fastify/cors'), {
  origin: "*",
  allowedHeaders: [
    "Origin",
    "X-Request-With",
    "Accept",
    "Content-Type",
  ],
  methods: ["GET", "PUT", "PATCH", "POST", "DELETE"],
});
// Todo: Create CRUD routes https://daily-dev-tips.com/posts/crud-operations-with-prisma-and-fastify/
// ! Get All
app.get('/blogs', async (request, reply) => {
  const allBlogs = await prisma.blog.findMany({});
  reply.send(allBlogs);
});

// ! Get Single
app.get <
  {Params: IByIdParam} >
  ('/blog/:id',
  async (request, reply) => {
    const {id} = request.params;
    const blog = await prisma.blog.findUnique({
      where: {id: String(id)},
    });
    reply.send(blog);
  });

// ! Create
app.post <
  {Body: IBlogBodyParam} >
  ('/create-blog',
  async (request, reply) => {
    const {title, body, author} = request.body;
    const newBlog = await prisma.blog.create({
      data: {
        title,
        body,
        author
      },
    });
    reply.send(newBlog);
  });
  
// ! Update
//As you can see, this route leverages both the body and the Params as we need to know the user's new name and ID.
app.put<{ Body: IBlogBodyParam; Params: IByIdParam }>(
  '/update-blog/:id',
  async (request, reply) => {
    const { id } = request.params;
    const { title, body, author } = request.body;
    const updatedBlog = await prisma.blog.update({
      where: { id: String(id) },
      data: {
        title,
        body,
        author
      },
    });
    reply.send(updatedBlog);
  }
);

// ! Delete
app.delete <
  {Params: IByIdParam} >
  ('/delete-blog/:id',
  async (request, reply) => {
    const {id} = request.params;
    await prisma.blog.delete({
      where: {id: String(id)},
    });
    reply.send('blog removed');
  });
  


app.listen(3030); 
// app.listen(3000); // http://localhost:3000/



/*
You may have noticed I'm using a definition here to define what the Params look like. 
This is because the typescript version of Fastify doesn't know wha5t kind of params to expect. 
The interface I created looks like this: (with interfaces)
*/
//* INTERFACES
interface IByIdParam {
  id: number;
}
interface IUserBodyParam {
  name: string;
  hobbies: string;
}
interface IBlogBodyParam {
  title: string;
  body: string;
  author: string;
}


