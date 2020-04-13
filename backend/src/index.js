// @flow
// svehla build
// https://github.com/Svehla/nodejs-build
import { tableToSchema } from 'table-to-schema'
import { getNestedPath } from './sharedFunctions'
const express = require('express')
const postgraphql = require('postgraphql').postgraphql
const config = require('../config')
const bodyParser = require('body-parser');
const app = express()
const c = console.log
const cj = oneJson => console.log(JSON.stringify(oneJson, null, 2))

const postgreConf = config.default.postgre
const port = config.default.port
//postgre
const { Client } = require('pg')




/**
 * allow cross domain requests for graphql server
 */
const allowCrossDomain = function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');// 'localhost:'+port);
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}
app.use(allowCrossDomain)


//app.use(bodyParser.json({limit: '50mb'}));
//app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use(postgraphql(
  postgreConf.config,
  postgreConf.schema,
  { graphiql: true, // just for NODE_ENV === 'production'
    watchPg: true,
  }
))




////////////////////////////////////////////////////
//////////////----------REST API --------///////////
////////////////////////////////////////////////////
app.post('/trunacateAllData', async(req,res) => {
  cj(postgreConf.config)
  const client = new Client(postgreConf.config)
  await client.connect()
  const resultSql:String = await client.query(`
    TRUNCATE astronauts.astronauts_super_powers_map  CASCADE;
    TRUNCATE astronauts.astronauts CASCADE;
    TRUNCATE astronauts.super_powers CASCADE;
 `)
  c(resultSql.rows)
  await client.end()

  res.send(200)
})



// rest api implementation
app.get('/getAll', async(req,res) => {
  try{
    cj(postgreConf.config)
    const client = new Client(postgreConf.config)
    await client.connect()
    const resultSql:String = await client.query(`
      SELECT
        astronauts.id as id_astronauts,
        astronauts_super_powers_map.id as id_map,
        super_powers.id as id_super_power,
        *
          FROM astronauts.astronauts
          LEFT JOIN astronauts.astronauts_super_powers_map ON
        	astronauts.astronauts.id = astronauts.astronauts_super_powers_map.id_astronaut
          LEFT JOIN astronauts.super_powers ON
        	astronauts.astronauts_super_powers_map.id_super_power = astronauts.super_powers.id
        ORDER BY astronauts.astronauts.id
   `)
    c(resultSql.rows)
    await client.end()

    var  config = [
      { distinctKey: 'id_astronaut',
        childrenName: '__map',
        keys: [ 'id_astronaut', 'first_name', 'last_name', 'birth_date', 'email', 'color']
        //keys: [ 'id_astronaut', 'first_name' ]
      },
      { distinctKey: 'id_map',
        childrenName: '__map',
        keys: []
      },
      { distinctKey: 'id_super_power',
        keys: [  "id_super_power", 'name' ]
      },
    ]

    var formattedData = tableToSchema(config, resultSql.rows);
/*
    var formattedData2 = formattedData.map( item => (
      {
        ...item,
        super_powers: item.__map.map( item2 => (
          item2.__map[0]
        ))
      }
    ))
*/
    res.send(
      '<h2>RAW DAA</h2><pre>'+JSON.stringify(resultSql.rows,null,2)+'</pre>'+
      `<h2>All data</h2> formattedData <pre> ${ JSON.stringify(formattedData,null,2) }</pre>`+
      `<h2>Some data</h2> getNestedPath(['__map', '__map'], formattedData <pre>${JSON.stringify(getNestedPath(['__map', '__map'], formattedData),null,2)}</pre> ___<br>_`+
      '<h2>XPATH </h2> getNestedPath(__map/__map/id_super_power) <pre>'+JSON.stringify(getNestedPath(['__map', '__map', 'id_super_power'], formattedData),null,2)+'</pre>'+'___<br>_'
    )
  }catch(e){
    c(e)
    res.send({error: e.toString()})
  }
})


app.listen(port)
console.log('app listen on port: '+port)



//
