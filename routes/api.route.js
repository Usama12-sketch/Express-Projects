const router = require('express').Router();

const {PrismaClient} = require('@prisma/client')

const prisma = new PrismaClient()

router.get('/', async (req, res, next) => {
       
  res.send({ message: 'Ok api is working 🚀' });
});

router.get('/user/:id', async (req, res, next) => {
      const user = await prisma.user.findUnique({
        where: {
  id: req.params.id
}
})
res.json(user)
      
});
router.get('/users', async (req, res, next) => {
      const user = await  prisma.user.findMany()

res.json(user)
      
});
router.post('/message', async (req, res, next) => {
  // const io = req.io;
      const message = req.body.message;
      // const socket = req.body.socket;
      io.emit('chat message', message);
      console.log('Sent message:', message);
      res.json({ message: 'Message sent successfully' });
res.json(user)
      
});
router.post('/loadMsg', async (req, res, next) => {
  const io = req.io;
      const message = req.body
      // const socket = req.body.socket;

      io.emit('loadMsg', message);
      console.log('Sent message:', message);
      res.json({ message: 'Message sent successfully' });      
});
router.post('/chat', async (req, res, next) => {
  const io = req.io;

      const msg = await req.body;
  const message = await prisma.message.findUnique({
    where:{
      id: msg.data.id
    },
    include:{
      sender:true
    }


  }) 
        
      // return message
    
      io.emit('message', message);

      res.json({ message: 'Message sent successfully' });

      
});
router.delete('/chat/:id', async (req, res, next) => {
  const io = req.io;

    // get message
    const messageId = req.params.id;

    // dispatch to channel "message"
    const message = await prisma.message.delete({
      where: {
        id: req.params.id
      
  
      },
    });


    io.emit("deleteMsg", messageId);

      res.json({ message: 'Message delete successfully' });

      
});






router.post('/user', async (req, res, next) => {
  const{name, email, password } = req.body
      const user = await  prisma.user.findMany()

res.json(user)
      
});
router.post('/messages', async (req, res, next) => {
const id =   req.params.id
// const [sessionUserId, receiverId] = id.split(",")
const {sessionUserId, receiverId} = req.body

  const messages = await prisma.message.findMany({
    where: {
      AND: [
        
        { OR: [{ senderId: sessionUserId }, { receiverId: sessionUserId }  ] },
        { OR: [ { receiverId: receiverId } ,{ senderId:  receiverId } ] },
      ],
    },
    orderBy: {
      timestamp: 'asc',
    },
    include:{
      sender: true,
    }
   
  });
res.json(messages)
      
});

module.exports = router;
