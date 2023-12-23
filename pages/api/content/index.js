import connect from '../../../lib/mongodb'
import contentList from '../../../model/contentList'
// import multer from 'multer';

connect();

// const upload  = multer({
//     storage: multer.diskStorage({
//         destination: function (req, file, cb){
//             cb(null, path.join(process.cwd(), "public", "upload"));
//         },
//         filename: function (req, file, cb){
//             cb(null, new Date().getTime() + "=" + file.originalname);
//         },
//     }),
// });
const content = async (req, res) => {
    const { method } = req;
    const {id} = req.query;
    switch(method) {
        case 'GET':
            try{
                const list = await contentList.find({});
                res.status(200).json({success: true, data: list})
            } catch(error){
                res.status(400).json({success: false})
            }
            break;

        case 'POST':
            try {
                const list = await contentList.create(req.body);
                res.status(201).json({ success: true, data: list})
            }    
            catch (error){
            
                res.status(400).json({success:false});
            }
            break;
        default: 
            res.status(400).json({success:false});
            break;

            
    }
}

export default content;