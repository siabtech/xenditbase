const { Datausers } = require('../models')

const Xendit = require('xendit-node');
const x = new Xendit({
    secretKey: 'xnd_development_yps1XaDZKthvYM9PuY2H4D1CS4CBsMf4cKniEOJnRg24J6Stlm7uLGHewZZtZy',
});

// let server =  'http://54.179.248.179' //aws
let server =  'https://xenditdase.herokuapp.com/' //heroku
let name = ''
let metode = ''
let terbilang = ''
let reference_id = ''

async function balance(req, res) {
    const { Balance } = x;
    const balanceSpecificOptions = {};
    const b = new Balance(balanceSpecificOptions);

    try {
        let type = req.params.params
        if (type == 'cash') {
            const resp = await b.getBalance({ accountType: Balance.AccountType.Cash })
            console.log(resp);
            res.send(resp)
        } else if (type == 'holding') {
            const resp = await b.getBalance({ accountType: Balance.AccountType.Holding })
            console.log(resp);
            res.send(resp)
        }

    }
    catch (err) {
        console.log(err);
    }

}

async function ewallet(req, res) {
    const { EWallet } = x;
    const ewalletSpecificOptions = {};
    const ew = new EWallet(ewalletSpecificOptions);

    name = req.params.name
    let phone = req.params.phone
    console.log("phone -> " + phone);
    if (phone[0] == '0') {
        phone = phone.substring(0, 0) + phone.substring(1, phone.length)
        phone = '+62' + phone;
    }

    if (phone === '0') {
        phone = undefined
    }

    metode = req.params.metode
    terbilang = req.params.jumlah

    console.log(`${name} / ${phone} / ${metode} / ${terbilang}`);

    try {
        const resp = await ew.createEWalletCharge({
            referenceID: Date.now().toString(),
            currency: 'IDR',
            amount: parseInt(terbilang),
            checkoutMethod: 'ONE_TIME_PAYMENT',
            channelCode: metode,
            channelProperties: {
                successRedirectURL: server + '/xendit/success',
                failureRedirectURL: server + '/xendit/failure',
                mobileNumber: phone
            }
        });

        let dat = '';
        if (metode === 'ID_OVO') {
            dat = {
                status: resp.status,
                link: 'http://localhost:8888/xendit/oke'
            }
        } else {
            dat = {
                reference_id: resp.reference_id,
                channel_code: resp.channel_code,
                desktop_web_checkout_url: resp.actions.desktop_web_checkout_url,
                mobile_web_checkout_url: resp.actions.mobile_web_checkout_url,
                mobile_deeplink_checkout_url: resp.actions.mobile_deeplink_checkout_url
            }
        }
        console.log("ini respon " + { resp });
        res.json(dat);
    } catch (error) {
        console.log("ini error");
        console.log(error);
    }
}

async function buatqr(req, res) {
    const { QrCode } = x;
    const qrcodeSpecificOptions = {};
    const q = new QrCode(qrcodeSpecificOptions);

    try {

        const resp = await q.createCode({
            externalID: Date.now().toString(),
            type: "DYNAMIC",
            callbackURL: server + "/xendit/back",
            amount: 1500,
        });
        console.log(resp);
        let a = {
            external_id: resp.external_id,
            status: resp.status
        }
        res.send(a)
        // process.exit(0);
    } catch (error) {
        console.log(error);
    }

}

async function cekqr(req, res) {
    const { QrCode } = x;
    const qrcodeSpecificOptions = {};
    const q = new QrCode(qrcodeSpecificOptions);

    console.log(req.params.params)

    try {
        const resp = await q.getCode({
            externalID: req.params.params,
        });
        console.log(resp);
        let a = {
            status: resp.status
        }
        res.send(a);
        // process.exit(0);
    } catch (error) {
        console.error(error);
    }
}

async function bayarqr(req, res) {
    const { QrCode } = x;
    const qrcodeSpecificOptions = {};
    const q = new QrCode(qrcodeSpecificOptions);

    try {
        const resp = await q.simulate({
            externalID: req.params.params,
        });
        console.log(resp);
        res.send(resp.status)
    } catch (error) {
        console.error(error);
    }
}

//------------------------callbacks------------------------

async function fva_success_c(req, res) {
    console.log("-----------fva_success_c-----------");
    res.status(200).json({ message: 'success_fva_success_c' });
    console.log(req.body);
}

async function db_connected_c(req, res) {
    console.log("-----------db_connected_c-----------");
    res.status(200).json({ message: 'success_db_connected_c' });
    console.log(req.body);
}

async function balance_c(req, res) {
    console.log("-----------balance_c-----------");
    res.status(200).json({ message: 'success_balance_c' });
    console.log(req.body);
}

async function metode_c(req, res) {
    console.log("-----------metode_c-----------");
    res.status(200).json({ message: 'success_metode_c' });
    console.log(req.body);
}

async function status_ewallet_c(req, res) {
    console.log("-----------status_ewallet_c-----------");
    console.log(req.body);
    reference_id = req.body.data.reference_id;
    res.json( req.body.data );
}

async function success(req, res) {
    console.log("----callback back ----");
    // res.status(200).json({ message: 'success' });
    // save data to db 
    
    setTimeout(function () {
        res.redirect(`http://localhost:3000/success/?name=${name}&metode=${metode}&terbilang=${terbilang}&id=${reference_id}`);
    }, 2000);
    // process.exit(0);
}

async function aha(req, res) {
    res.json({ aha: "bingung ya?" });
}

async function failure(req, res) {
    console.log("-----------failure-----------");
    res.json({ message: 'failure' });
}

async function bacaDB(req, res) {
    try {
        let data = await Datausers.findAll({ limit: 1, order: [['updatedAt', 'DESC']]});
        res.status(200).json({data});
        // console.log(data);
    } catch (error) {
        console.log(error);
    }
}

async function inputDB(req, res){
    try {
        let {nama, amount, air, sisa} = req.body;
        let input = {nama, amount, air, sisa};
        let data = await Datausers.create(input);
        console.log(data);
        // res.redirect('/viewAll');
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    balance,
    ewallet,
    buatqr,
    cekqr,
    bayarqr,
    fva_success_c,
    db_connected_c,
    balance_c,
    metode_c,
    status_ewallet_c,
    success,
    aha,
    failure,
    bacaDB,
    inputDB
}