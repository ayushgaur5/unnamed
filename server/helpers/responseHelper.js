module.exports = {
    success: (res, msg, data) => {
        console.log(msg);
        res.status(200).json({ status: "success", message: msg, data: data ? data : {} })
    },
    failed: (res, err, errcode) => {
        console.log(err);
        res.status(errcode ? errcode : 500).json({ status: 'failed', message: err });
    }
}