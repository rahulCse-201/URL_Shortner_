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
     return res.redirect(302,url.originalUrl);
  }catch(error){
    console.log(error.message);
    return res.status(500).json({success: false, message: 'Server error'});
  }
})




import urlRouter from './routes/url.routes.js';

app.use('/api/url', urlRouter);



export default app;