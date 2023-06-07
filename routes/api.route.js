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
