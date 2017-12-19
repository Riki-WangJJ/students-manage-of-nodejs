
var mongodb = require("mongodb");
var async = require("async");

var ott_connectDB = ( callback, host ) => {
  var host = host || "mongodb://127.0.0.1:27017"
  var client = mongodb.MongoClient;
  client.connect( host, ( err, use ) => {
    if(err) throw err;
    callback && callback( use );
  });
}


module.exports = {
  // 首页
  index ( req, res ) {
    res.render("index");
  },
  //学生列表
  students ( req, res ) {
    ott_connectDB(use => {
      use.db("sms").collection("students").find().toArray(( err, data )=>{
        if( err ) throw err;
        res.render("students",{ list : data });
      })
    });
  },
  //添加页面
  addhtml ( req, res ) {

    async.parallel({
      majors ( callback ) {
        ott_connectDB( use => {
          use.db("sms").collection("majors").find().toArray(( err , data ) => {
            if( err ) throw err;
            callback( err, data );
          });
        });
      },
      cities ( callback ) {
        ott_connectDB(use => {
          use.db("sms").collection("cities").find().toArray(( err , data ) => {
            if( err) throw err;
            callback( err, data );
          });
        })
      }
    },function ( err , result ) {

      res.render("add",{ majors: result.majors, cities:result.cities });
    });


  },
  //添加学生数据
  add ( req, res ) {
    // 获取前台数据
    var data = req.body;

    ott_connectDB( use => {
      use.db("sms").collection("students").insertOne( data , function ( err, result ) {
        if( err ) throw err;

        console.log("操作成功");
        res.redirect("/students");
      })
    });
  },
  //查看info
  info ( req, res ) {
    //获取id
    var id = req.query._id;

    ott_connectDB(use => {
      //将id转换成mongodb的id对象
      id = mongodb.ObjectId( id );
      use.db("sms").collection("students").findOne( {_id : id} , (err , data) => {
        if( err ) throw err;
        console.log(data);
        res.render("info", {item:data});
      })
    });
  },
  //编辑页面
  edithtml ( req, res ) {
    var id = req.query._id;
    id = mongodb.ObjectId( id );
    async.parallel( {
      item ( callback ) {
        ott_connectDB(use => {
          use.db("sms").collection("students").findOne({ _id : id }, (err, data) => {
            if( err ) throw err;
            callback(err,data )
         })
       });
      },
      cities ( callback ) {
        ott_connectDB(use => {
          use.db("sms").collection("cities").find().toArray(( err, data ) => {
            if(err) throw err;
            callback(err,data);
          })
        });
      },
      majors ( callback ) {
        ott_connectDB(use => {
          use.db("sms").collection("majors").find().toArray(( err, data ) => {
            if(err) throw err;
            callback(err,data);
          })
        });
      }
    },( err , result ) => {
      if( err ) throw err;
      res.render( "edit" , { item : result.item , cities : result.cities ,majors : result.majors });
    })
    
  },
  // 编辑更细数据
  edit ( req , res ) {
    // 获取前台数据
    var data = req.body;
    data._id = mongodb.ObjectId( data._id )

    ott_connectDB(use => {
      use.db("sms").collection("students").update({_id :data._id },{$set : data},( err ,result ) => {
        if( err ) throw err;
        console.log("编辑成功");
        res.redirect("/students")
      })
    });
  },
  // 删除
  delete ( req , res ) {
    //获取id
    var id = mongodb.ObjectId( req.query._id )

    ott_connectDB(use => {
      use.db("sms").collection("students").remove({_id:id},( err, result ) => {
        if( err ) throw err;

        console.log("删除成功");
        res.redirect( "/students" );
      })
    });
  }

}