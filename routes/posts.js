const router = require('express').Router();
const verify = require('./verifyToken');

router.get('/', verify, (req, res) => {
   res.send(req.user);
   //User.findbyOne({_id: req.user})
   //res.json({
   //    post: {
   //        title: 'My first post', 
   //        description: 'Random data you shouldnt access'
   //     }
   //});
});

module.exports = router;