import express from 'express';
import cors from 'cors';


const app = express();


app.use(express.json());
app.use(cors({
  origin: '*'
}));

app.get('/', (req, res) => {
  res.send('Hello, World!');
});



import Url from './model/url.model.js';

app.get('/:shortCode', async(req, res) => {
  const { shortCode } = req.params;
  try{
    const url = await Url.findOne({shortCode});
    if(!url) {
        return res.status(404).json({success: false, message: 'Short URL not found'});
    }
    console.log("received url from server");
    console.log("original url:", url.originalUrl);
     return res.redirect(302,url.originalUrl);
  }catch(error){
    console.log(error.message);
    return res.status(500).json({success: false, message: 'Server error'});
  }
})




import urlRouter from './routes/url.routes.js';
import authRouter from './routes/auth.routes.js';

app.use('/api/url', urlRouter);
app.use('/api/auth', authRouter);



export default app;
