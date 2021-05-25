module.exports = {
    JWT_SECRET_KEY: '6dqw7dydyw7ewyuw',
    SESSION_EXPIRES_IN: '1d', // Session will expire after 1 day of creation
    mysqlHost: "localhost",
    user: "root",
    password: '1',
    database: "esqro",  
    mysqlPort: 3306,
    initialTokenRate: 0.5,

    defaultDir : "/home/upload/default/",
    tempDocumentsDir : "/home/upload/temp_documents/",
    otp: {
        port: 465,
        user: 'developer@espsofttechnologies.com',
        pass: 'Espsoft123#',
        subject: 'Account Activation - Esqro-crypto',
        // host: 'email-smtp.ap-southeast-2.amazonaws.com',
        host: 'espsofttechnologies.com',

        signupSubject: 'New User SignUp - ',
        forgotSubject: 'Forgot Password - ',
        passwordChangedSubject: 'Password Changed - ',
        trade_accept : 'Trade Accepted - ',
        trade_reject : 'Trade Rejected - ',
        unusualActivity: 'Critical security alert - ',
        alertBeforePasswordChangeSubject : 'Security alert',

        template: {
            emailSignupHtml: (token) => {
                return `<b>To complete the account registeration process, visit the following link:  </b> <a href="http://localhost:3000/esqro_frontent/verifyAccount/${token}"> Verification Link </a>`
            },
            emailForgotHtml: (token) => {
                return `<b>Your password change successfully <br><br>
                <b> Your new password : ${token} </b> <br> <br>
                
                Regards, <br> <br>

                EsqroCrypto Admin Team
                `
            },

            emailTradeAcceptHtml: (qoinAmounts) => {
                return `Trade request accepted for ${qoinAmount} Qoin.`
            },   
            
            emailTradeRejectHtml: (qoinAmounts) => {
                return `Trade request rejected for ${qoinAmount} Qoin.`
            },

            unusualActivityHtml: () => {
                return `Someone just used your password to try to sign in to your account.`
            },   
            
            beforePasswordChangeHtml: () => {
                return `Someone is changing your password.`
            },               

        }
    }

}