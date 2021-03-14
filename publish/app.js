const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');
const mongoose = require('mongoose');
const querystring = require('querystring')

//链接数据库
mongoose.connect('mongodb://localhost/shop', { useUnifiedTopology: true })
    .then(() => { console.log('链接成功') })
    .catch(() => { console.log('链接失败') })
//创建集合规则
const ChartSchema = new mongoose.Schema({
    visType: {
        type: String
    },
    reportedPercent: {
        type: Number,
        min: 0,
        max: 100
    },
    truePercent: {
        type: Number,
        min: 0,
        max: 100
    }
})
//创建集合
const Chart = mongoose.model('Chart', ChartSchema);

// const chart1 = new Chart({
//     age: 24
// })

// chart1.save();

//创建服务器
const app = http.createServer();

app.on('request', function (req, res) {

    const method = req.method;
    let { pathname } = url.parse(req.url, true);

    if (method == 'GET') {
        if (pathname == '/') {
            pathname = '/index.html'
        }
        let staticPath = path.resolve(__dirname, 'public');

        let filePath = path.join(staticPath, pathname);

        fs.readFile(filePath, function (err, data) {
            if (err) {
                console.log(err);

            } else {
                console.log('ok');
                res.write(data);
                res.end();
            }
        })
    } else if (method == 'POST') {
        if (pathname == '/') {
            let formdata = '';
            req.on('data', parms => {
                formdata += parms;
                console.log(parms)
            })

            console.log(formdata)

            req.on('end', async () => {
                let chart = querystring.parse(formdata);
                await Chart.create(chart)
            })
            res.end();
        }

    }
})
//监听8000端口
app.listen(8000);