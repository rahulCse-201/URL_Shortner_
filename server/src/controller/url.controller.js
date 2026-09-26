import Url from '../model/url.model.js';
import {nanoid} from 'nanoid';

const createUrl = async(req, res) => {
    const {originalUrl} = req.body;
    if(!originalUrl){
        return res.status(400).json({message: 'Original URL is required'});
    }
    try{
        const shortCode = nanoid(8);
        const shortUrl = `${req.protocol}://${req.get('host')}/${shortCode}`;
        console.log('Short URL:', shortUrl);
        const url = await Url.create({
            originalUrl,
            shortCode
        })

        if(!url) {
            return res.status(500).json({success: false, message: 'Unable to create short URL'});
        }

        return res.status(200).json({success: true, shortUrl: shortUrl, message: 'Short URL created successfully'});
    }catch (error) {
        console.log(error.message);
        return res.status(500).json({success: false, message: 'Server error'});
    }
}


const redirection = async (req, res) => {
    const {shortCode} = req.params;
    if(!shortCode){
        return res.status(400).json({message: 'Short code is required'});
    }
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
}




export { createUrl, redirection};