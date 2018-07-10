// Sets the MongoDB Database options

module.exports = {

    /*mongolab:
    {
        name: "mongolab",
        url: "mongodb://sa.bluemagicads@gmail.com:FrankLG63@@ds245250.mlab.com:45250/heroku_mflj00qd",
        port: 27017
    },*/

    local:
    {
        name: "transport",
        url: "mongodb://localhost/transapp",
        port: 27017
    },

   /* localtest:
    {
        name: "transport",
        url: "mongodb://localhost/transapptest",
        port: 27017
    }*/

};
