const express = require('express')
const fileUpload = require('express-fileupload')
const path = require('path')
const app = express()

app.set('view engine','ejs')

app.use(fileUpload({
    useTempFiles:true,
    tempFileDir: path.join(__dirname,'tmp'),
    createParentPath: true,
    limits:{fileSize: 2*1024*1024},
}))

app.get('/',async(req,res,next) => {
    res.render('index')
})


app.post('/single', async(req,res,next) => {
    try{
        const file=req.files.mFile
        console.log(file)
       // const fileName = new Date().getTime().toString() + path.extname(file.name)
        //const savePath = path.join(__dirname,'public','Uploads',fileName)
        const savePath = path.join(__dirname,'public','Uploads',file.name)
        if(file.truncated){
            throw new Error('File size is too big...')
        }
        if(file.mimetype !== 'image/jpeg'){
            throw new Error('Only jpegs are supported...')
        }
        await file.mv(savePath)
        res.redirect('/')

    }catch(error){
        console.log(error)
        res.send('Error uploading file')
    }
})

app.post('/multiple',async(req,res,next)=>{
    try{
            const files = req.files.mFiles
        //    let promises = []
        //    files.forEach(file => {
        //     const savePath = path.join(__dirname,'public','Uploads',file.name)
        //     promises.push(file.mv(savePath))
        // })
        const promises = files.map(file => {
            const savePath = path.join(__dirname,'public','Uploads',file.name)
            return file.mv(savePath)
        })
            await Promise.all(promises)
            res.redirect('/');

    }catch(error){
        console.log(error)
        res.send('Error uploading files....')
    }
})
app.listen(8000,()=>console.log("Server on port 8000"));