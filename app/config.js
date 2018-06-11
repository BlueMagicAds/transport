// Sets the MongoDB Database options

module.exports = {

    mongolab:
    {
        name: "mongolab",
        url: "mongodb://sa.bluemagicads@gmail.com:FrankLG63@@ds245250.mlab.com:45250/heroku_mflj00qd",
        port: 27017
    },

    local:
    {
        name: "scotch-user-map-local",
        url: "mongodb://localhost/MeanMapApp",
        port: 27017
    },

    localtest:
    {
        name: "scotch-user-map-local",
        url: "mongodb://localhost/MeanMapAppTest",
        port: 27017
    }

};
