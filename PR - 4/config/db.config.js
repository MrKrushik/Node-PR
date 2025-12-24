const mongoose = require('mongoose');

const URL = 'mongodb://localhost:27017/mydatabase';

mongoose.connect(URL)
    .then(() => 
        console.log('MongoDB connected')
    ).catch(err =>
        console.error('MongoDB connection error:', err)
    ).finally(() => {
        console.log('finally.....!');
        
    });
