import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

type Send = { status: 'error' | 'pending', otp_id?: string };

// TODO Problema em que otp não tá sendo retornado de OTP

export async function send(phone: string): Promise<Send>{
    return { status: 'pending', otp_id: 'test'}; // temp
    
    /* phone = '+55' + phone;

    const data = JSON.stringify({
        "originator": "SignOTP",
        "recipient": phone,
        "content": "Seu Código de login é {}",
        "expiry": "600",
        "data_coding": "text"
    });

    const config = {
        method: 'post',
        url: 'https://api.d7networks.com/verify/v1/otp/send-otp',
        headers: { 
            'Authorization': `Bearer ${process.env.D7NETWORKS_TOKEN as string}`, 
            'Content-Type': 'application/json'
        },
        data
    };

    axios(config)
        .then(function (response: any) {
            return {status: 'pending', otp_id: response.data.otp_id};
        })
        .catch(function (err: any) {
            console.log(err);
        });

    return { status: 'error' }; */
}

type Verify = { status: 'error' | 'approved' | 'invalid' };

async function verify(code: string, otp_id: string): Promise<Verify>{
    return { status: 'approved' }; // temp
    
    /* const data = JSON.stringify({ "otp_id": otp_id, "otp_code": code });

    const config = {
        method: 'post',
        url: 'https://api.d7networks.com/verify/v1/otp/verify-otp',
        headers: { 
            'Authorization': `Bearer ${process.env.D7NETWORKS_TOKEN as string}`, 
            'Content-Type': 'application/json'
        },
        data
    };

    axios(config)
        .then(function (response: any) {
            if(response.data.status) return { status: 'approved' };

            else if(response.data.detail.code) return { status: 'invalid' };
        })
        .catch(function (error: any) {
            console.log(error);
        });

    return { status: 'error' }; */
}

type Resend = { status: 'error' | 'pending' | 'frequent' | 'expired' };

async function resend(otp_id: string): Promise<Resend>{
    return { status: 'pending' }; // temp

    /* const axios = require('axios');
    const data = JSON.stringify({ otp_id });

    const config = {
        method: 'post',
        url: 'https://api.d7networks.com/verify/v1/otp/resend-otp',
        headers: { 
            'Authorization': `Bearer ${process.env.D7NETWORKS_TOKEN as string}`, 
            'Content-Type': 'application/json'
        },
        data
    };

    axios(config)
        .then(function (response: any) {

            if(response.data.status) return { status: 'pending' };

            else if(response.data.detail.loc) console.log(response.data.detail);
            
            else{
                let errMessage = response.data.detail.split(' ');

                return { status: errMessage.contains('Frequent') ? 'frequent' : 'expired' }
            } 
        })
        .catch(function (error: any){ console.log(error) });

    return { status: 'error' }; */
}

export default {send, verify, resend};